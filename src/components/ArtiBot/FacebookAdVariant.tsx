'use client';

import React, {FC, useEffect, useRef, useState} from 'react';
import {motion} from 'framer-motion';
import Image from 'next/image';
import dummyImage from '@/assets/images/image4.webp';
import {IAdVariant} from '@/interfaces/IArtiBot';
import {REACTION} from '@/interfaces';
import {SlOptions} from 'react-icons/sl';
import {updateVariantImage, useConversation} from '@/context/ConversationContext';
import Lottie from 'lottie-react';
import generatingImage from '@/assets/lottie/generating_image.json';
import errorImage from '@/assets/lottie/error.json';


export const FacebookAdVariantShimmer = ({style = {}, className = ''}) => {

	return (
		<div className={'ad-variant text-xs md:text-base !p-0 ' + (className)} style={style}>
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
				<span className="app-shimmer text-[0.95em] inline-flex leading-[1.5em]">Than you for providing that information, Saurabh, To better undersant yousfka sdlf jalsdf lajflj alsjf lajsdfl jaldf jlasdjf lasdf </span>
			</div>
			<div className="w-full aspect-square app-shimmer !block" />
			<div className={"flex justify-between gap-[.8em] items-center px-[1em] mt-[1em]"}>
				<span className={"app-shimmer text-[1.25em] leading-[1.3em]"}>This is a normal one liner where you can show one liner</span>
				<div className="flex-shrink-0">
					<span className="app-shimmer cursor-pointer rounded bg-gray-700 px-[0.6em] py-[0.5em] text-[1em]">Learn More</span>
				</div>
			</div>
			<hr className="h-px my-[1em] border-0 bg-gray-700"/>
			<div className="w-full px-[1em] pb-[1em] flex justify-between">
				<div className="ml-[2em] w-[6.5em] h-[2em] rounded bg-gray-700" />
				<div className="w-[6.5em] h-[2em] rounded bg-gray-700" />
				<div className="w-[6.5em] h-[2em] rounded bg-gray-700" />
				<div className="w-[2em] h-[2em] rounded-full bg-gray-700" />
			</div>
		</div>
	)
}

interface FacebookAdVariantProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	adVariant: IAdVariant;
	noExpand?: boolean;
	className?: string;
}
const FacebookAdVariant: FC<FacebookAdVariantProps> = ({adVariant: _adVariant, noExpand, className, ...props}) => {
	const [expand, setExpand] = useState<boolean>(false);
	const headingRef = useRef<HTMLHeadingElement>(null);
	const [reactionState, setReactionState] = useState<REACTION>();
	const {state: {inError, inProcess, variant}, dispatch} = useConversation();

	const adVariant = variant.map && variant.map[_adVariant.id] ? variant.map[_adVariant.id] : _adVariant;

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
	// }, [expand]);

	useEffect(() => {
		if(!adVariant.id || adVariant.id.includes('variant') || noExpand) return;
		if(!adVariant.imageUrl && adVariant.imageDescription && (!inProcess || !inProcess[adVariant.id] || !inError[adVariant.id])) {
			console.log('adVariant.id - ', adVariant.id);
			updateVariantImage(dispatch, adVariant.imageDescription, adVariant.id);
		}
	}, [adVariant, dispatch]);


	let lottieAnimationJSX = <div className="w-full aspect-square flex flex-col justify-center items-center">
		<Lottie className={"w-32 h-32"} animationData={generatingImage} loop={true} />
		<h6 className="text-white text-opacity-60 text-center px-5 leading-normal">Creating your ad variant image to make your brand shine, one pixel at a time.</h6>
	</div>

	if(inError && inError[adVariant.id]) {
		lottieAnimationJSX = <div className="w-full aspect-square flex flex-col justify-center items-center">
			<Lottie className={"w-32 h-32"} animationData={errorImage} loop={true} />
			<h6 className="text-white text-opacity-60 text-center px-5 leading-normal">Oops! It looks like there was an issue creating your ad variant image. Try creating another one.</h6>
		</div>
	}

	const imageContainerJSX =
		adVariant.imageUrl
			? <Image width={600} height={100} className="mb-[0.5em] w-full" src={adVariant.imageUrl ? adVariant.imageUrl : dummyImage} alt="Ad Image" />
			: lottieAnimationJSX;

	return (
		<div key={adVariant.oneLiner} className={'ad-variant text-xs md:text-base !p-0 ' + (className ?? '')} {...props}>
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
				<span className="text-[0.95em] inline-flex leading-[1.5em]">{adVariant.text}</span>
			</div>
			<div>
				{imageContainerJSX}
				{/*<Image width={600} height={100} className="mb-[0.5em] w-full" src={variant && variant[adVariant['One liner']] ? variant[adVariant['One liner']] : dummyImage} alt="Ad Image" />*/}
			</div>
			<div className={"flex justify-between gap-[.8em] items-center px-[1em] mt-[1em]"}>
				<span className={"text-[1.25em] leading-[1.3em]"}>{adVariant.oneLiner}</span>
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
			<motion.div className="px-[3.75em] overflow-hidden" initial={{height: 0}} onAnimationEnd={() => {
				headingRef.current && headingRef.current.scrollIntoView({behavior: 'smooth', block: 'start'})
			}} animate={{height: !noExpand && expand ? 'auto' : 0}}>
				<ol className="list-decimal">
					<li className="pl-1">
						<span className="text-[1.05em] font-medium"><strong>Ad Orientation</strong></span>
						<p className="mt-[0.3em] text-[1em] font-diatype opacity-60 leading-[1.5em]">{adVariant.adOrientation}</p>
					</li>
					{adVariant.imageDescription && <li className="pl-1 relative">
						<p className="text-[1.05em] font-medium z-10 relative"><strong>Image Description</strong></p>
						<p
							className="mt-[0.3em] mb-[1em] text-[1em] opacity-60 relative z-10 leading-[1.5em]">{adVariant.imageDescription}</p>
						{/*<div className="w-full h-full bg-secondaryText bg-opacity-30 rounded animate-pulse absolute top-0 left-0" />*/}
					</li>}
					<li className="pl-1">
						<p className="text-[1.05em] font-medium"><strong>Rationale</strong></p>
						<p className="mt-[0.3em] mb-[1em] text-[1em] opacity-60 leading-[1.5em]">{adVariant.rationale}</p>
					</li>
				</ol>
			</motion.div>
		</div>
	)
}

export default FacebookAdVariant;
