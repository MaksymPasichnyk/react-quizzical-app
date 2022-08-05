//import Question from './Question';
import { nanoid } from "nanoid";
import React from "react";
import { Grid } from "react-loader-spinner";
import ActionButton from "./ActionButton";

export default function Quiz({ questionsData, message, closeQuiz }) {
  const [isFinishedQuiz, setIsFinishedQuiz] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [questions, setQuestions] = React.useState(
    getQuestionsWithOptions(questionsData)
  );
  const [amountOfRigntAnswers, setAmountOfRightAnswers] = React.useState(0);
  const questionElements = questions.map((question) => {
    const answerElements = question.answers.map((answer) => {
      return (
        <div
          key={answer.id}
          className="question__response"
          style={{
            backgroundColor: `${
              (!answer.state && "white") ||
              (answer.state === "chosen" && "#99a4e3") ||
              (answer.state === "incorrect" && "red") ||
              (answer.state === "correct" && "green")
            }`,
            color: `${answer.state ? "white" : "black"}`,
          }}
          onClick={() => handleOptionClick(question.id, answer.id)}
        >
          <span className="question__response-text">
            {decodeStr(answer.text)}
          </span>
        </div>
      );
    });

    return (
      <div className="question" key={question.id}>
        <h3 className="question__title">{decodeStr(question.text)}</h3>
        <div className="question__responses">{answerElements}</div>
      </div>
    );
  });

	React.useEffect(() => {
		if (!questionsData.length) {
			setLoading(true);
		} else {
			setQuestions(getQuestionsWithOptions(questionsData))
			setLoading(false)
		}
	},[questionsData])

  function getQuestionsWithOptions(questionsData) {
    return questionsData.map((question) => {
      const answers = [...question.incorrect_answers, question.correct_answer]
        .map((answer) => {
          return {
            text: answer,
            id: nanoid(),
            isChosen: false,
            state: null,
          };
        })
        .sort(() => Math.random() - 0.5);
      return {
        text: question.question,
        id: nanoid(),
        answers: answers,
        correctAnswer: question.correct_answer,
      };
    });
  }

  function decodeStr(str) {
    const txt = document.createElement("textarea");
    txt.innerHTML = str;
    return txt.value;
  }

  function chooseAnswer(questionId, answerId) {
    setQuestions((prevQuestions) =>
      prevQuestions.map((question) => {
        const answers = question.answers.map((answer) => {
          return question.id === questionId
            ? { ...answer, state: null }
            : answer;
        });

        return { ...question, answers: answers };
      })
    );

    setQuestions((prevQuestions) =>
      prevQuestions.map((question) => {
        const answers = question.answers.map((answer) => {
          return answer.id === answerId
            ? { ...answer, state: "chosen" }
            : answer;
        });

        return { ...question, answers: answers };
      })
    );
  }

  function checkAnswers() {
    setIsFinishedQuiz(true);
		const newQuestions = questions.map((question) => {
        const answers = question.answers.map((answer) => {
					if (answer.state && question.correctAnswer === answer.text) {
						setAmountOfRightAnswers(prevAmountOfRightAnswers => prevAmountOfRightAnswers + 1)
					}
          if (answer.text === question.correctAnswer)
            return { ...answer, state: "correct" };
          if (
            answer.state === "chosen" &&
            answer.text === question.correctAnswer
          ) {
            return { ...answer, state: "correct" };
          }
          if (
            answer.text !== question.correctAnswer &&
            answer.state === "chosen"
          )
            return { ...answer, state: "incorrect" };
          return answer;
        });
        return { ...question, answers: answers };
      });
    setQuestions(newQuestions);
  }

  function startNewQuiz() {
    setQuestions(getQuestionsWithOptions(questionsData));
    setIsFinishedQuiz(false);
		setAmountOfRightAnswers(0);
  }

	function handleOptionClick(questionId, answerId) {
		if (!isFinishedQuiz) {
			return chooseAnswer(questionId, answerId)
		}
	}

  return (
    <>
      {loading && <Grid color="#00BFFF" height={80} width={80} />}
      {!loading && (
        <form className="quiz">
          {questionElements}
          {message && <p className="no-results-message">{message}</p>}
          {isFinishedQuiz && (
            <div className="amount-correct-answers">
              Quantity correct chosen answers is 
              <span className="highlight">{amountOfRigntAnswers}</span>
            </div>
          )}
          {!message && (
            <ActionButton
              handlerClick={isFinishedQuiz ? startNewQuiz : checkAnswers}
              text={`${isFinishedQuiz ? "Try again" : "Show answers"}`}
              type="button"
              classText="quiz__btn"
            />
          )}
          <ActionButton
            text="Back to Menu"
            classText="quiz__btn quiz__btn--secondary"
            type="button"
            handlerClick={closeQuiz}
          />
        </form>
      )}
    </>
  );
}
