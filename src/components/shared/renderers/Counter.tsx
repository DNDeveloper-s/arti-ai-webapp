import React, {FC, useCallback, useEffect, useRef, useState} from 'react';
import {useCountUp} from 'react-countup';

interface CounterProps {
	from: number;
	to: number;
	duration: number;
	className?: string;
}

const Counter: FC<CounterProps> = ({from, to, duration, className}) => {
	const countUpRef = useRef(null);
	const { start, pauseResume, reset, update } = useCountUp({
		ref: countUpRef,
		start: from,
		end: to,
		delay: 0,
		duration: duration,
		onReset: () => console.log('Resetted!'),
		onUpdate: () => console.log('Updated!'),
		onPauseResume: () => console.log('Paused or resumed!'),
		onStart: ({ pauseResume }) => console.log(pauseResume),
		onEnd: ({ pauseResume }) => console.log(pauseResume),
	});

	const containerRef = useCallback((node: any) => {
		if (node !== null) {
			const observer = new IntersectionObserver((entries) => {
				entries.forEach(entry => {
					if(entry.isIntersecting) {
						console.log('entry - ', entry);
						start();
					}
				})
			});

			observer.observe(node);
		}
	}, [start])

	return (
		<span ref={containerRef}>
			<span className={className ?? ''} ref={countUpRef} />
		</span>
	);
};

export default Counter;
