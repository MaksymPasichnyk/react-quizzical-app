//import Question from './Question';
import { nanoid } from "nanoid";
import React from "react";
import { Grid } from "react-loader-spinner";

export default function Quiz({ questionsData }) {
  const [isFinishedQuiz, setIsFinishedQuiz] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [questions, setQuestions] = React.useState(
    getQuestionsWithOptions(questionsData)
  );

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

  const questionElements = questions.map((question) => {
    const answerElements = question.answers.map((answer) => {
      return (
        <div
          key={answer.id}
          className="question__response"
          //style={{backgroundColor: `${ answer.isChosen ? '#99a4e3' : 'white'}`}}
          style={{
            backgroundColor: `${
              (!answer.state && "white") ||
              (answer.state === "chosen" && "#99a4e3") ||
              (answer.state === "incorrect" && "red") ||
              (answer.state === "correct" && "green")
            }`,
            color: `${answer.state ? "white" : "black"}`,
          }}
          onClick={() => chooseAnswer(question.id, answer.id)}
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
        <div className="question__responses">
          {answerElements}
          {/*<div className='question__response'>
						<span className='question__response-text'>response</span>
					</div>*/}
        </div>
      </div>
    );
  });

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

  		setQuestions(prevQuestions => {
  			return prevQuestions.map(question => {
  				const answers = question.answers.map(answer => {
  					if (answer.text === question.correctAnswer) return {...answer, state: 'correct'}
  					if (answer.state === 'chosen' && answer.text === question.correctAnswer)	return {...answer, state: 'correct'}
  					if (answer.text !== question.correctAnswer && answer.state === 'chosen') return {...answer, state: 'incorrect'}
  					return answer
  				})
  			return {...question, answers: answers}
  		})
  	})
  }

	function startNewQuiz() {
  	setQuestions(getQuestionsWithOptions(questionsData));
  	setIsFinishedQuiz(false);
  }

  return (
    <>
      {loading && <Grid color="#00BFFF" height={80} width={80} />}
      {!loading && (
        <form className="quiz">
          {questionElements}
          {/*<div className='question'>
					<h3 className='question__title'>test</h3>
					<div className='question__responses'>
						<div className='question__response'>
							<span className='question__response-text'>response</span>
						</div>
					</div>
				</div>*/}
          <button onClick={isFinishedQuiz ? startNewQuiz : checkAnswers} type="button" className="quiz__btn">{`${
            isFinishedQuiz ? "Try again" : "Show answers"
          }`}</button>
        </form>
      )}
    </>
  );
}
