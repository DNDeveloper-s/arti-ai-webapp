'use client';

import React, {useRef, useState} from 'react';
import {motion} from 'framer-motion';
import Image from 'next/image';
import dummyImage from '@/assets/images/dummy2.webp';
import {IAdVariant} from '@/interfaces/IArtiBot';
import ReactionIcon from '@/components/ArtiBot/ReactionIcon';
import {REACTION} from '@/interfaces';
import {useConversation} from '@/context/ConversationContext';
import generatingImage from '@/assets/lottie/generating_image.json';
import Lottie from 'lottie-react';

export default function AdVariant({adVariant, noExpand, ...props}: {adVariant: IAdVariant, [key: string]: any}) {
	const [expand, setExpand] = useState<boolean>(noExpand || false);
	const headingRef = useRef<HTMLHeadingElement>(null);
	const [reactionState, setReactionState] = useState<REACTION>();
	const {state: {variant}, dispatch} = useConversation();


	function handleLike() {
		setReactionState(c => c === REACTION.LIKED ? REACTION.NEUTRAL : REACTION.LIKED);
	}

	function handleDislike() {
		setReactionState(c => c === REACTION.DISLIKED ? REACTION.NEUTRAL : REACTION.DISLIKED);
	}

	// useEffect(() => {
	// 	if(!headingRef.current) return;
	// 	// const height = headingRef.current.offsetTop;
	// 	headingRef.current.scrollIntoView({behavior: 'smooth', block: 'start'})
	// }, [expand])

	const lottieAnimationJSX = <div className="w-full h-48 flex justify-center items-center">
		<Lottie animationData={generatingImage} loop={true} />
	</div>

	const imageContainerJSX =
		variant && variant[adVariant['One liner']]
		? <Image width={500} height={100} className="mb-[1.3em] w-full max-w-[30em]" src={variant && variant[adVariant['One liner']] ? variant[adVariant['One liner']] : dummyImage} alt="Ad Image" />
		: lottieAnimationJSX;


	return (
		<div key={adVariant['One liner']} className="ad-variant text-xs md:text-base" {...props}>
			<div className="flex justify-between items-center mb-[0.75em]">
				<div ref={headingRef} className="font-bold flex items-center font-diatype text-[1.4em] cursor-pointer" onClick={(e) => {
					if(!noExpand) setExpand(c => !c)
				}}><span className="inline leading-[1.2em]">{adVariant['One liner']}</span>
					{/*{adVariant['Ad Type'] && <span className="text-[0.6em] py-[0.1em] px-[0.5em] ml-[0.85em] font-regular bg-white bg-opacity-10 text-primary rounded-lg upper">{adVariant['Ad Type'].split(' ')[0]}</span>}*/}

				</div>
				{/*<div className="flex items-center ml-[1em]">*/}
					{/*<ReactionIcon reacted={reactionState === REACTION.LIKED} onClick={handleLike} />*/}
					{/*<ReactionIcon reacted={reactionState === REACTION.DISLIKED} onClick={handleDislike} isDislike />*/}
					{/*<AiFillLike className="mr-[0.8em] cursor-pointer text-[1.2em] text-secondaryText" />*/}
					{/*<AiFillDislike className="text-[1.2em] cursor-pointer text-secondaryText" />*/}
				{/*</div>*/}
			</div>
			<motion.div className="px-[1.75em] overflow-hidden" initial={{height: noExpand ? 'auto' : 0}} onAnimationEnd={() => {
				headingRef.current && headingRef.current.scrollIntoView({behavior: 'smooth', block: 'start'})
			}} animate={{height: expand ? 'auto' : 0}}>
				<ol className="list-decimal">
					<li className="pl-1">
						<span className="text-[1.05em] font-medium"><strong>Ad Orientation</strong></span>
						<p className="mt-[0.3em] text-[1em] font-diatype opacity-60">{adVariant['Ad orientation']}</p>
					</li>
					<div className="my-[2em] relative bg-background bg-opacity-50 p-[1em] rounded-lg">
						{imageContainerJSX}
						<p className="leading-[1.3em] text-[0.85em] font-diatype opacity-60">{adVariant.Text}</p>
					</div>
					<li className="pl-1 relative">
						<p className="text-[1.05em] font-medium z-10 relative"><strong>Image Description</strong></p>
						<p className="mt-[0.3em] mb-[1em] text-[1em] opacity-60 relative z-10">{adVariant['Image Description']}</p>
						{/*<div className="w-full h-full bg-secondaryText bg-opacity-30 rounded animate-pulse absolute top-0 left-0" />*/}
					</li>
					<li className="pl-1">
						<p className="text-[1.05em] font-medium"><strong>Rationale</strong></p>
						<p className="mt-[0.3em] mb-[1em] text-[1em] opacity-60">{adVariant.Rationale}</p>
					</li>
				</ol>
			</motion.div>
		</div>
	)
}
