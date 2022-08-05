import Quiz from "./components/Quiz";
import Settings from "./components/Settings";
import IntroPage from "./components/Intro-page";
import React from "react";

export default function App() {
  const storage = window.localStorage;
  const initialQuizSetup = {
    amount: 10,
    category: "any",
    difficulty: "any",
    type: "any",
  };

  const [quizSetup, setQuizSetup] = React.useState(
    storage.getItem("quiz")
      ? JSON.parse(storage.getItem("quiz"))
      : initialQuizSetup
  );

  const [displayQuiz, setDisplayQuiz] = React.useState(false);
  const [displaySettings, setDisplaySettings] = React.useState(false);
  const [questions, setQuestions] = React.useState([]);
  const [message, setMessage] = React.useState();

  const fetchQuizData = async () => {
    let url = `https://opentdb.com/api.php?`;

    for (let item in quizSetup) {
      if (quizSetup[item] !== "any") {
        url = url + `${item}=${quizSetup[item]}&`;
      }
    }

    fetch(url)
      .then((response) => {
        if (response.ok) return response.json();
        throw response;
      })
      .then((data) => {
        if (data.response_code === 1) {
          setMessage(
            `No Results. Could not find any appropriate questins.  
						Change your settings and try again`
          );
        } else {
          setMessage("");
        }

        setQuestions(data.results);
      });
  };

  React.useEffect(() => {
    fetchQuizData(quizSetup);
  }, [quizSetup]);

  function buildQuiz() {
    setDisplayQuiz(true);
  }

  function closeQuiz() {
    setDisplayQuiz(false);
  }

  const settingHandlers = {
    open() {
      setDisplaySettings(true);
    },

    close() {
      setDisplaySettings(false);
    },

    saveSettings(quizSetup) {
      storage.setItem("quiz", JSON.stringify(quizSetup));
      setQuizSetup(quizSetup);
      setDisplaySettings(false);
    },

    handleChangeFieldsState(event) {
      const { name, value } = event.target;

      setQuizSetup((prevQuiz) => ({
        ...prevQuiz,
        [name]: value,
      }));
    },
  };

  return (
    <main className="main">
      {displayQuiz && (
        <Quiz
          questionsData={questions}
          message={message}
          closeQuiz={closeQuiz}
        />
      )}
      {!displayQuiz && !displaySettings && (
        <IntroPage 
					buildQuiz={buildQuiz} 
					showSettings={settingHandlers.open} />
      )}
      {displaySettings && (
        <Settings
          settingHandlers={settingHandlers}
          quizSetup={quizSetup}
          storage={storage}
        />
      )}
    </main>
  );
}
