export default function IntroPage(props) {

	return(
		<div className='intro-page'>
			<h1 className='intro-page__title'>Quizzical</h1>
			<p className='intro-page__desc'>Small quiz for fun</p>
			<button onClick={props.buildQuiz} className='btn'>Start quiz</button>
			<button onClick={props.showSettings} className='btn'>Settings</button>
		</div>
	)
}