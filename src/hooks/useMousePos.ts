import React, {MutableRefObject, useEffect, useState} from 'react';

type UseMousePosProps = MutableRefObject<HTMLElement>

const UseMousePos = (elRef: UseMousePosProps) => {
	const [mousePos, setMousePos] = useState({x: 0, y: 0});

	useEffect(() => {
		if(!elRef?.current) return;

		// Calculate the mouse position relative to the container which is elRef.current on mousemove
		const calculatePosition = (e) => {
			// Getting the dimensions of the container which is elRef.current
			const rect = elRef.current.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const y = e.clientY - rect.top;
			return {x, y};
		}

		// Function to be called on mousemove
		const mouseMoveHandler = (e: any) => {
			const {x, y} = calculatePosition(e);
			setMousePos({x, y});
		}

		// Function to be called on mouseleave
		const mouseLeaveHandler = () => {
			// elRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
		}

		// Add event listeners
		elRef.current.addEventListener('mousemove', mouseMoveHandler);
		elRef.current.addEventListener('mouseleave', mouseLeaveHandler);

		const ref = elRef.current;
		// Remove event listeners
		return () => {
			ref.removeEventListener('mousemove', mouseMoveHandler);
			ref.removeEventListener('mouseleave', mouseLeaveHandler);
		}
	}, [elRef]);

	return mousePos;
};

export default UseMousePos;
