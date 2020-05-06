import * as React from 'react'
import { useState } from 'react';
import './styles.scss';

const FileInput = () => {
	const [isOver, setIsOver] = useState(false);
	const drapHandler = (event: React.DragEvent<HTMLDivElement>) => {
		console.log('드랍함')
		event.preventDefault();
		event.stopPropagation();
		if (event.dataTransfer.items) {
			console.log(event.dataTransfer.items[0].getAsFile());
			setIsOver(false);
		}
	}

	const dragOverHandler = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		if (isOver) return;
		setIsOver(true)
	}
	 
	const dragLeaveHandler = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		if (!isOver) return;
		setIsOver(false);
	}
	return (
		<div
			onDrop={drapHandler} 
			onDragOver={dragOverHandler}
			onDragLeave={dragLeaveHandler}
		 	className="file-drop-box"
			style={isOver ? {backgroundColor: 'blue'} : {}}>
			<input type="file" name="file"></input>
			<p>이곳에 파일을 올려주세요</p>
			<button type="submit">ee</button>
		</div>
	)
}

export default FileInput;