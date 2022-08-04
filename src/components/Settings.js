import React from 'react';
import { Grid } from 'react-loader-spinner';

export default function Settings(props) {
	// data from props
	const { close, saveSettings, handleChangeFieldsState } = props.settingHandlers;
	const {quizSetup} = props;

	// hardcoded types and diffic data cause API has not got this
	const typeData = [
		{name: 'Multiple Choice', id: 1, type: 'multiple'}, 
		{name:'True / False', id: 2, type: 'boolean'}
	];
	const difficultyData = [
		{name:'Easy', id: 1, value: 'easy'}, 
		{name:'Medium', id: 2, value: 'medium'}, 
		{name:'Hard', id: 3, value: 'hard'}
	];
	//

	// react states
	const [types, setTypes] = React.useState(typeData);
	const [difficulty, setDifficulty] = React.useState(difficultyData);
	const [categories, setCategories] = React.useState([]);
	const [loading, setLoading] = React.useState(true);
	//const [questionsCount, setQuestionsCount] = React.useState(null);

	React.useEffect( () => {
		fetch('https://opentdb.com/api_category.php')
		.then(response => {
			if (response.ok) return response.json();
			throw response
		})
		.then(data => setCategories(data.trivia_categories))
		.catch(error => console.error(error))
		.finally(() => {
			setLoading(false);
		});

		//fetchCountQuestions(quizSetup.category);
		
	}, [])

	console.log(quizSetup)

	// vars for creating JSX elements
	const categoryElements = categories.map(category => {
		return (
			<option key={category.id} value={category.id}>{category.name}</option>
		)
	})

	const typeElements = types.map(type => (
		<option key={type.id} value={type.type}>{type.name}</option>
	))

	const difficultyElements = difficulty.map(difficulty => (
		<option key={difficulty.id} value={difficulty.value}>{difficulty.name}</option>
	))
	//

	//// functions
	//const fetchCountQuestions = async (categoryId) => {
	//	const response = await fetch(`https://opentdb.com/api_count.php?category=${categoryId}`);
	//	const data = await response.json();
	//	setQuestionsCount(data);
	//}

	return (
		<>
		{
			loading && <Grid 
			color="#00BFFF" 
			height={80} 
			width={80} />
		}
		{
			!loading && 
				<form className='settings-form'>
					<h2 className='settings-form__title'>Customize you quizSetup</h2>
					<div className='settings-form__field'>
						<label className='settings-form__subtitle' htmlFor="questionNumber">Number of Questions</label>
						<input
							onChange={handleChangeFieldsState}  
							className='settings-form__control' 
							name='amount' id='questionNumber' type='number' value={quizSetup.amount}
							/>
					</div>
					<div className='settings-form__field'>
						<label className='settings-form__subtitle' htmlFor="category">Select Category</label>
						<select 
							value={quizSetup.category} 
							onChange={handleChangeFieldsState}  
							className='settings-form__control round' 
							name='category' id='category' >
							<option value='any'>Any Category</option>
							{categoryElements}
						</select>
					</div>
					<div className='settings-form__field'>
						<label className='settings-form__subtitle' htmlFor="difficulty">Select Difficulty</label>
						<select 
							value={quizSetup.difficulty} 
							onChange={handleChangeFieldsState} 
							className='settings-form__control round' 
							name='difficulty' 
							id='difficulty'>
							<option value='any'>Any Difficulty</option>
							{difficultyElements}
						</select>
					</div>
					<div className='settings-form__field'>
						<label className='settings-form__subtitle' htmlFor="type">Select Type</label>
						<select 
							value={quizSetup.type} 
							onChange={handleChangeFieldsState}  
							className='settings-form__control round' 
							name='type' 
							id='type'>
							<option value='any'>Any Type</option>
							{typeElements}
						</select>
					</div>
					<div className='settings-form__field'>
						<button 
							onClick={() => { saveSettings(quizSetup) }}
							type='button' 
							className='settings-form__btn btn'>Save
						</button>
						<button 
							onClick={close} 
							type='reset' 
							className='settings-form__btn btn settings-form__btn--cancel'>
								Cancel
						</button>
					</div>
				</form>
		}
		</>
	)
}