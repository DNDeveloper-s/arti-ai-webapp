'use client';

import React, {useRef, useState} from 'react';
import {motion} from 'framer-motion';
import Image from 'next/image';
import dummyImage from '@/assets/images/image4.webp';
import {IAdVariant} from '@/constants/artibotData';
import ReactionIcon from '@/components/ArtiBot/ReactionIcon';
import {REACTION} from '@/interfaces';
import {SlOptions} from 'react-icons/sl';

export default function FacebookAdVariant({adVariant, noExpand, className, ...props}: {adVariant: IAdVariant, [key: string]: any}) {
	const [expand, setExpand] = useState<boolean>(noExpand || false);
	const headingRef = useRef<HTMLHeadingElement>(null);
	const [reactionState, setReactionState] = useState<REACTION>();

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

	return (
		<div key={adVariant['One liner']} className={'ad-variant text-xs md:text-base !p-0 ' + (className ?? '')} {...props}>
			<div className={"flex justify-between items-center mb-[.3em] px-[1em] pt-[1em]"}>
				<div className="flex items-center gap-[0.5em]">
					<div className="w-[2em] h-[2em] rounded-full bg-gray-700" />
					<div>
						<div className="w-[4em] h-[1em] mb-[0.2em] rounded-[.17em] bg-gray-700" />
						<div className="w-[6em] h-[1em] rounded-[.17em] bg-gray-700" />
					</div>
				</div>
				<SlOptions className="text-[1.5em]" />
			</div>
			<div className="mb-[1em] px-[1em]">
				<span className="text-[0.95em] inline-flex leading-[1.5em]">{adVariant['Text']}</span>
			</div>
			<div>
				<Image width={600} height={100} className="mb-[0.5em] w-full" src={dummyImage} alt="Ad Image" />
			</div>
			<div className={"flex justify-between items-center px-[1em] mt-[1em]"}>
				<span className={"text-[1.25em] leading-[1.3em]"}>{adVariant['One liner']}</span>
				<div className="flex-shrink-0">
					<span className="cursor-pointer rounded bg-gray-700 px-[0.6em] py-[0.5em] text-[1em]" onClick={() => setExpand(c => !c)}>Learn More</span>
				</div>
			</div>
			<hr className="h-px my-[1em] border-0 bg-gray-700"/>
			<div className="w-full px-[1em] pb-[1em] flex justify-between">
				<div className="ml-[2em] w-[6.5em] h-[2em] rounded bg-gray-700" />
				<div className="w-[6.5em] h-[2em] rounded bg-gray-700" />
				<div className="w-[6.5em] h-[2em] rounded bg-gray-700" />
				<div className="w-[2em] h-[2em] rounded-full bg-gray-700" />
			</div>
			<motion.div className="px-[3.75em] overflow-hidden" initial={{height: noExpand ? 'auto' : 0}} onAnimationEnd={() => {
				headingRef.current && headingRef.current.scrollIntoView({behavior: 'smooth', block: 'start'})
			}} animate={{height: expand ? 'auto' : 0}}>
				<ol className="list-decimal">
					<li className="pl-1">
						<span className="text-[1.05em] font-medium"><strong>Ad Orientation</strong></span>
						<p className="mt-[0.3em] text-[1em] font-diatype opacity-60 leading-[1.5em]">{adVariant['Ad orientation']}</p>
					</li>
					<li className="pl-1 relative">
						<p className="text-[1.05em] font-medium z-10 relative"><strong>Image Description</strong></p>
						<p className="mt-[0.3em] mb-[1em] text-[1em] opacity-60 relative z-10 leading-[1.5em]">{adVariant['Image Description']}</p>
						{/*<div className="w-full h-full bg-secondaryText bg-opacity-30 rounded animate-pulse absolute top-0 left-0" />*/}
					</li>
					<li className="pl-1">
						<p className="text-[1.05em] font-medium"><strong>Rationale</strong></p>
						<p className="mt-[0.3em] mb-[1em] text-[1em] opacity-60 leading-[1.5em]">{adVariant.Rationale}</p>
					</li>
				</ol>
			</motion.div>
		</div>
	)
}
