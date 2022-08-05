export default function ActionButton({ text, handlerClick, classText, type }) {
	return (
		<button
			onClick={handlerClick}
			className={classText}
			type={type}
		>
			{text}
		</button>
	)
}