'use client';

import React, {FC, useEffect, useRef, useState} from 'react';
import {motion} from 'framer-motion';
import Image1 from 'next/image';
import dummyImage from '@/assets/images/image4.webp';
import {IAdVariant} from '@/interfaces/IArtiBot';
import {REACTION} from '@/interfaces';
import {SlOptions} from 'react-icons/sl';
import {updateVariantImage, useConversation} from '@/context/ConversationContext';
import Lottie from 'lottie-react';
import generatingImage from '@/assets/lottie/generating_image.json';
import errorImage from '@/assets/lottie/error.json';
import {Mock} from '@/constants/servicesData';
import {RiAiGenerate} from 'react-icons/ri';
import Loader from '@/components/Loader';
import CTAButton from '../CTAButton';
import { resetImageUrl, useEditVariant } from '@/context/EditVariantContext';
import { NoImage } from './LeftPane/ConversationListItem';


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

export interface FacebookAdVariantProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	adVariant: IAdVariant;
	noExpand?: boolean;
	className?: string;
	mock?: Mock;
	forceAdVariant?: boolean;
	handleEditVariantClose?: () => void;
}

const FacebookAdVariant: FC<FacebookAdVariantProps> = ({mock = new Mock(), forceAdVariant, adVariant: _adVariant, noExpand, className, ...props}) => {
	const [expand, setExpand] = useState<boolean>(false);
	const headingRef = useRef<HTMLHeadingElement>(null);
	const [reactionState, setReactionState] = useState<REACTION>();
	const {state: {inError, inProcess, variant}, dispatch} = useConversation();
	const {state: editState, dispatch: editDispatch} = useEditVariant();
	const isLoaded = useRef<Record<string, boolean>>({});
	const adVariantImageUrlRef = useRef<string | null>(null);

	const adVariant = forceAdVariant ? _adVariant : variant.map && variant.map[_adVariant.id] ? variant.map[_adVariant.id] : _adVariant;

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

	// useEffect(() => {
	// 	if(!adVariant.id || adVariant.id.includes('variant') || noExpand) return;
	// 	if(!adVariant.imageUrl && adVariant.imageDescription && (!inProcess || !inProcess[adVariant.id]) && (!inError || !inError[adVariant.id])) {
	// 		console.log('adVariant.id - ', adVariant.id);
	// 		updateVariantImage(dispatch, adVariant.imageDescription, adVariant.id);
	// 	}
	// }, [adVariant, dispatch, inError, inProcess, noExpand]);
	const [imageUrl, setImageUrl] = useState<string | null>(mock.is ? null : adVariant.imageUrl);
	const fallbackImage = editState.fallbackImage ? editState.fallbackImage[adVariant.id] : undefined;

	useEffect(() => {
		setImageUrl(fallbackImage ?? adVariant.imageUrl);
		const img = new Image();
		img.src = adVariant.imageUrl;
		img.onload = () => {
			setImageUrl(adVariant.imageUrl);
			resetImageUrl(editDispatch);
		}
		img.onloadstart = () => {
			console.log('testing load start');
		}
	}, [fallbackImage, adVariant.imageUrl])

	function handleErrorImage() {
		if(fallbackImage) setImageUrl(fallbackImage);
		else setImageUrl('error');
	}

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
		imageUrl === 'error' ? <NoImage className='!text-6xl !flex-col !aspect-square'>
				<span className='text-lg mt-2'>Image not found</span>
			</NoImage> : imageUrl 
			? <Image1 width={600} height={100} className="mb-[0.5em] w-full" src={imageUrl ? imageUrl : dummyImage} onError={handleErrorImage} alt="Ad Image" />
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
			{/*<div className="mb-[1em] px-[1em]">*/}
			<div className="mb-[1em] text-[1.6em] leading-[1.6] py-[0.6em] px-[1em] relative">
				<span className={'' + (mock.is ? ' line-clamp-3 text-ellipsis' : ' line-clamp-4 text-ellipsis min-h-[82px]')}>{adVariant.text}</span>
			</div>
			<div className="relative aspect-square">
				{imageContainerJSX}
				{/*<Image width={600} height={100} className="mb-[0.5em] w-full" src={variant && variant[adVariant['One liner']] ? variant[adVariant['One liner']] : dummyImage} alt="Ad Image" />*/}
			</div>
			<div className={"flex justify-between gap-[.8em] items-center px-[1em] mt-[1em]"}>
				<div className="relative px-2 py-2 text-[1.75em] leading-[1.3em] flex-1">
					<span>{adVariant.oneLiner}</span>
				</div>
				<div className="flex-shrink-0">
					<span className="cursor-pointer rounded bg-gray-700 px-[0.6em] py-[0.5em] text-[1em]" onClick={() => setExpand(c => !c)}>Learn More</span>
				</div>
			</div>
			<hr className="h-px my-[1em] border-0 bg-gray-700"/>
			<div className="w-full px-[1em] pb-[1em] flex justify-between" style={{zoom: mock.is ? 0.7 : 1}}>
				<div className="ml-[2em] w-[6.5em] h-[2em] rounded bg-gray-700" />
				<div className="w-[6.5em] h-[2em] rounded bg-gray-700" />
				<div className="w-[6.5em] h-[2em] rounded bg-gray-700" />
				<div className="w-[2em] h-[2em] rounded-full bg-gray-700" />
			</div>
			{!mock.is && <motion.div className="px-[3.75em] overflow-hidden" initial={{height: 0}} onAnimationEnd={() => {
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
			</motion.div>}
		</div>
	)
}

export const FacebookAdVariantMini: FC<FacebookAdVariantProps> = ({adVariant: _adVariant, noExpand, className, ...props}) => {
	const {state: {inError, inProcess, variant}, dispatch} = useConversation();

	const adVariant = variant.map && variant.map[_adVariant.id] ? variant.map[_adVariant.id] : _adVariant;

	let lottieAnimationJSX = <div className="w-full aspect-square flex flex-col justify-center items-center">
		<Lottie className={"w-[120px] h-[120px]"} animationData={generatingImage} loop={true} />
		<h6 className="text-white text-opacity-60 text-[7.25px] text-center px-5 leading-normal">Creating your ad variant image to make your brand shine, one pixel at a time.</h6>
	</div>

	if(inError && inError[adVariant.id]) {
		lottieAnimationJSX = <div className="w-full aspect-square flex flex-col justify-center items-center">
			<Lottie className={"w-[120px] h-[120px]"} animationData={errorImage} loop={true} />
			<h6 className="text-white text-opacity-60 text-[7.25px] text-center px-5 leading-normal">Oops! It looks like there was an issue creating your ad variant image. Try creating another one.</h6>
		</div>
	}

	const imageContainerJSX =
		adVariant.imageUrl
			? <Image1 width={600} height={100} className="mb-[2.5px] w-full" src={adVariant.imageUrl ? adVariant.imageUrl : dummyImage} alt="Ad Image" />
			: lottieAnimationJSX;

	return (
		<div key={adVariant.oneLiner} className={'ad-variant text-[7px] md:text-[35px] !p-0 ' + (className ?? '')} {...props}>
			<div className={"flex justify-between items-center mb-[2.1px] px-[4px] pt-[3px]"}>
				<div className="flex items-center gap-[3.5px]">
					<div className="w-[14px] h-[14px] rounded-full bg-gray-700" />
					<div>
						<div className="w-[28px] h-[7px] mb-[1.4px] rounded-[1.19px] bg-gray-700" />
						<div className="w-[42px] h-[7px] rounded-[1.19px] bg-gray-700" />
					</div>
				</div>
				<SlOptions className="text-[10.5px]" />
			</div>
			<div className="mb-[7px] px-[7px]">
				<span className="text-[6.65px] inline-flex leading-[10.5px]">{adVariant.text}</span>
			</div>
			<div>
				{imageContainerJSX}
				{/*<Image width={4200px} height={700px} className="mb-[3.5px] w-full" src={variant && variant[adVariant['One liner']] ? variant[adVariant['One liner']] : dummyImage} alt="Ad Image" />*/}
			</div>
			<div className={"flex justify-between gap-[5.6px] items-center px-[7px] mt-[7px]"}>
				<span className={"text-[8.75px] leading-[9.1px]"}>{adVariant.oneLiner}</span>
				<div className="flex-shrink-0">
					<span className="cursor-pointer rounded bg-gray-700 px-[4.2px] py-[3.5px] text-[7px]">Learn More</span>
				</div>
			</div>
			<hr className="h-[1.4px] my-[7px] border-0 bg-gray-700"/>
			<div className="w-full px-[7px] pb-[7px] flex justify-between">
				<div className="ml-[14px] w-[45.5px] h-[14px] rounded bg-gray-700" />
				<div className="w-[45.5px] h-[14px] rounded bg-gray-700" />
				<div className="w-[45.5px] h-[14px] rounded bg-gray-700" />
				<div className="w-[14px] h-[14px] rounded-full bg-gray-700" />
			</div>
		</div>
	)
}

export default FacebookAdVariant;
