import ActionButton from "./ActionButton"

export default function IntroPage(props) {

	return(
		<div className='intro-page'>
			<h1 className='intro-page__title'>Quizzical</h1>
			<p className='intro-page__desc'>Small quiz for fun</p>
			<ActionButton 
				handlerClick={props.buildQuiz} 
				text="Start quiz" 
				classText="btn" 
				type="button"
			/>
			<ActionButton 
				handlerClick={props.showSettings}
				text="Settings"
				classText="btn"
				type="button"
			/>
		</div>
	)
}