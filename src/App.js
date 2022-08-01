import Quiz from './components/Quiz';
import Settings from './components/Settings';
import IntroPage from './components/Intro-page';
import React from 'react';
//import { nanoid } from 'nanoid';

export default function App() {
	
	const storage = window.localStorage;
	const defaultQuiz = {
		questionNumber: 10,
		category: '9',
		difficulty: 'easy',
		type: "multiple",
	}

	const [quiz, setQuizSetup] = React.useState(storage.getItem('quiz') ? JSON.parse(storage.getItem('quiz')) : defaultQuiz);
	const [isQuiz, setQuiz] = React.useState(false);
	const [isSettings, setIsSettings] = React.useState(false);
	const [questions, setQuestions] = React.useState([]);
	const [userToken, setUserToken] = React.useState(null);

	const fetchQuizData = async ({questionNumber, category, difficulty, type}) => {
		const response = await fetch(`https://opentdb.com/api.php?amount=${questionNumber}&category=${category}&difficulty=${difficulty}&type=${type}`);
		const quiz = await response.json();
		setQuestions(quiz.results)
	}

	const fetchUserToken = async () => {
		const response = await fetch('https://opentdb.com/api_token.php?command=request');
		const data = await response.json();
		setUserToken(data.token);
	}


	React.useEffect( () => {

		fetchQuizData(quiz)
		fetchUserToken();


	}, [quiz]);

	function buildQuiz() {
		setQuiz(true);
		fetchQuizData(quiz);
	};




	const settingsHandler = {
		open() {
			setIsSettings(true)
		},

		close() {
			setIsSettings(false)
		},

		saveSettings(quiz) {
			console.log('quiz that came from settings', quiz)
			storage.setItem('quiz', JSON.stringify(quiz))

			setQuizSetup(quiz);

			setIsSettings(false)
		},

	}

	return(
		<main className='main'>
			{isQuiz && < Quiz quiz={quiz} questionsData={questions} />}
			{(!isQuiz && !isSettings) && <IntroPage buildQuiz={buildQuiz} showSettings={settingsHandler.open} />}
			{isSettings && <Settings settingsHandler={settingsHandler} storage={storage}  />}
		</main>
	)
}