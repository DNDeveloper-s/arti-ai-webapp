import Lottie from 'lottie-react';
import sparkJSON from '@/assets/lottie/spark.json';
import React, {FC, SetStateAction, useRef, useState} from 'react';
import {AiFillDislike, AiFillLike} from 'react-icons/ai';
import {color, motion} from 'framer-motion';
import {colors} from '@/config/theme';

interface ReactionIconProps {
	onClick: () => any;
	reacted: boolean;
	isDislike?: boolean;
}

const ReactionIcon: FC<ReactionIconProps> = ({onClick, reacted, isDislike}) => {
	const [start, setStart] = useState(false);
	const timeoutRef = useRef<NodeJS.Timeout>(null);

	function handleClick(e) {
		if(start) return false;
		if(timeoutRef.current) clearTimeout(timeoutRef.current)
		setStart(true);
		// setLiked(c => !c)

		timeoutRef.current = setTimeout(() => {
			setStart(false);
		}, 1000)

		onClick(e);
	}

	let Icon = AiFillLike;
	if(isDislike) Icon = AiFillDislike;

	return (
		<div className="w-5 h-5 relative mr-[0.5em] cursor-pointer">
			<div className="w-full h-full flex items-center justify-center">
				<motion.div onClick={handleClick} initial={{scale: 1, color: colors.secondaryText}} animate={{scale: [1, 0.8, 1.3, 0.8, 1], color: reacted ? colors.primary : colors.secondaryText}} whileTap={{scale: [1, 0.8, 1.3, 0.8, 1]}}>
					<Icon className="transition-all text-[1.2em] cursor-pointer" />
				</motion.div>
				{start && <Lottie loop={false} animationData={sparkJSON}
				         className="like-animation text-red-600 w-14 h-14 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"/>}
				{/*<Lottie loop={true} animationData={sparkJSON} className="like-animation w-14 h-14 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />*/}
			</div>
		</div>
	)
}

export default ReactionIcon;
