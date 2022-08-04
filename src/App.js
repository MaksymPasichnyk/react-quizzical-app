import Quiz from "./components/Quiz";
import Settings from "./components/Settings";
import IntroPage from "./components/Intro-page";
import React from "react";
//import { nanoid } from 'nanoid';

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

	console.log(message)
  console.log(questions);
  const fetchQuizData = async () => {
    let url = `https://opentdb.com/api.php?`;

    for (let item in quizSetup) {
      if (quizSetup[item] !== "any") {
        url = url + `${item}=${quizSetup[item]}&`;
      }
    }

    //const response = await fetch(url);
    //const quiz = await response.json();
    //setQuestions(quiz.results);
    fetch(url)
      .then((response) => {
        if (response.ok) return response.json();
        throw response;
      })
      .then((data) => {
        if (data.response_code === 1) {
          setMessage(
            `No Results. Could not find any appropriate questins. 
						(Ex. Asking for 50 Questions in a Category that only has 20.) 
						Change your settings and try again`
          );
        } else {
					setMessage('')
				}

        setQuestions(data.results);
      });
  };

  React.useEffect(() => {
    fetchQuizData(quizSetup);
  }, [quizSetup]);

  function buildQuiz() {
    setDisplayQuiz(true);
    //fetchQuizData(quizSetup);
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

      console.log(quizSetup);

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
      {displayQuiz && <Quiz questionsData={questions} />}
      {!displayQuiz && !displaySettings && (
        <IntroPage buildQuiz={buildQuiz} showSettings={settingHandlers.open} />
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
