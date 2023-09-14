import Lottie from 'lottie-react';
import sparkJSON from '@/assets/lottie/spark.json';
import React, {useRef, useState} from 'react';
import {AiFillLike} from 'react-icons/ai';
import typingAnimation from '@/assets/lottie/typing.json';

export default function LikeIcon({onClick}) {
	const [start, setStart] = useState(false);
	const timeoutRef = useRef<NodeJS.Timeout>(null);

	function handleClick(e) {
		if(timeoutRef.current) clearTimeout(timeoutRef.current)
		setStart(true);

		timeoutRef.current = setTimeout(() => {
			setStart(false);
		}, 1000)

		// onClick(e);
	}


	return (
		<div className="w-5 h-5 relative mr-[0.5em] cursor-pointer" onClick={handleClick}>
			<div className="w-full h-full">
				<AiFillLike className="hover:scale-[1.1] transition-all text-[1.2em] cursor-pointer text-secondaryText" />
				{start && <Lottie loop={false} animationData={sparkJSON}
				         className="like-animation w-14 h-14 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"/>}
				{/*<Lottie loop={true} animationData={sparkJSON} className="like-animation w-14 h-14 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />*/}
			</div>
		</div>
	)
}
