'use client';

import React, {RefObject, useEffect, useMemo, useRef, useState} from 'react';
import {whyUsData, WhyUsItem} from '@/constants/landingPageData/whyUs';
import {PiCaretRightBold} from 'react-icons/pi';
import {useInView, useMotionValueEvent, motion, useScroll} from 'framer-motion';
import { useMediaQuery } from 'react-responsive'
import Image from 'next/image';
import {
	carouselImage1,
	carouselImage2,
	carouselImage3,
	carouselImage4, carouselImage5,
	carouselImage6, carouselImage7
} from '@/assets/images/carousel-images';

interface WhyUsCardProps {
	item: WhyUsItem;
	expand?: boolean
}

const WhyUsCard: React.FC<WhyUsCardProps> = ({item, expand}) => {
	const [expanded, setExpanded] = useState(null);

	function toggleExpand() {
		setExpanded(c => !c);
	}

	useEffect(() => {
		setExpanded(expand);
	}, [expand])

	// return (
	// 	<div className="h-screen">
	// 		<div style={{
	// 			top: '50%',
	// 			right: '100px',
	// 			transform: 'translateY(-50%)'
	// 		}} className="fixed bg-secondaryText bg-opacity-25 rounded-2xl mb-14 p-8 pt-14 font-diatype" onClick={toggleExpand}>
	// 			<PiCaretRightBold className="absolute top-5 right-5" />
	// 			<h4 className="font-bold text-lg mb-2">{item.title}</h4>
	// 			<p className="text-sm leading-5 opacity-50">{item.overview}</p>
	//
	// 			{item.readMore !== undefined && <div className="overflow-hidden max-h-0 pt-5" style={{
	// 				maxHeight: expanded ? '300px' : 0,
	// 				transition: '.3s ease-out'
	// 			}}>
	// 				{typeof item.readMore === 'string' ? <p className="text-sm leading-5 opacity-50">{item.readMore}</p> : item.readMore.map(item => (
	// 					<div key={item.id} className="mt-4">
	// 						<h6 className="font-medium text-md mb-0.5 font-diatype">{item.title}</h6>
	// 						<p className="text-sm leading-5 opacity-50">{item.overview}</p>
	// 					</div>
	// 				))}
  //       </div>}
	// 		</div>
	// 	</div>
	// )

	return (
		<div className="md:h-screen flex items-center">
			<div className="relative bg-secondaryText bg-opacity-25 rounded-2xl p-8 mb-10 md:mb-0 pt-14 font-diatype" onClick={toggleExpand}>
				<PiCaretRightBold style={{transform: `rotate(${expanded ? -90 : 0}deg)`}} className="md:hidden transition-all absolute top-5 right-5" />
				<h4 className="font-bold text-lg mb-2">{item.title}</h4>
				<p className="text-sm leading-5 opacity-50">{item.overview}</p>

				{item.readMore !== undefined && <div className="overflow-hidden max-h-0 pt-5" style={{
					maxHeight: expanded ? '300px' : 0,
					transition: '.3s ease-out'
				}}>
					{typeof item.readMore === 'string' ? <p className="text-sm leading-5 opacity-50">{item.readMore}</p> : item.readMore.map(item => (
						<div key={item.id} className="mt-4">
							<h6 className="font-medium text-md mb-0.5 font-diatype">{item.title}</h6>
							<p className="text-sm leading-5 opacity-50">{item.overview}</p>
						</div>
					))}
		    </div>}
			</div>
		</div>
	)
}

function CarouselContainer() {

	const images = (
		<>
			<div className="grid grid-cols-3 grid-rows-[150px_150px]">
				<div className="border border-primary">
					<Image className="object-cover w-full h-full" src={carouselImage1} alt="One" />
				</div>
				<div className="border border-primary">
					<Image className="object-cover w-full h-full" src={carouselImage2} alt={"Two"} />
				</div>
				<div className="border border-primary row-span-2">
					<Image className="object-cover w-full h-full" src={carouselImage3} alt={"Three"} />
				</div>
				<div className="border border-primary">
					<Image className="object-cover w-full h-full" src={carouselImage4} alt={"Four"} />
				</div>
				<div className="border border-primary">
					<Image className="object-cover w-full h-full" src={carouselImage5} alt={"Five"} />
				</div>
			</div>
		</>
	)

	const imagesAlt = (
		<>
			<div className="grid grid-cols-3 grid-rows-[150px_150px]">
				<div className="border border-primary row-span-2">
					<Image className="object-cover w-full h-full" src={carouselImage1} alt="One" />
				</div>
				<div className="border border-primary">
					<Image className="object-cover w-full h-full" src={carouselImage2} alt={"Two"} />
				</div>
				<div className="border border-primary">
					<Image className="object-cover w-full h-full" src={carouselImage3} alt={"Three"} />
				</div>
				<div className="border border-primary">
					<Image className="object-cover w-full h-full" src={carouselImage4} alt={"Four"} />
				</div>
				<div className="border border-primary">
					<Image className="object-cover w-full h-full" src={carouselImage5} alt={"Five"} />
				</div>
			</div>
		</>
	)

	return (
		<div className="absolute top-0 left-1/2 w-full h-screen -translate-x-1/2 image-carousel-whyus-container overflow-hidden">
			<div className="absolute top-0 left-0 w-full h-full bg-opacity-70 bg-black" style={{zIndex: 1}} /> {/* This is the overlay */}
			<div className="w-[90%] max-w-[500px] h-auto flex flex-col carousel-images">
				{images}
				{imagesAlt}
				{images}
				{imagesAlt}
				{images}
				{imagesAlt}
				{images}
				{imagesAlt}
				{images}
				{imagesAlt}
				{images}
				{imagesAlt}
				{images}
				{imagesAlt}
				{images}
				{imagesAlt}
				{images}
				{imagesAlt}
				{images}
				{imagesAlt}
				{images}
				{imagesAlt}
				{images}
				{imagesAlt}
				{images}
				{imagesAlt}
				{images}
				{imagesAlt}
				{images}
				{imagesAlt}
				{images}
				{imagesAlt}
				{images}
				{imagesAlt}
				{images}
				{imagesAlt}
			</div>
		</div>
	)
}

const offset = 500;
export default function WhyUs() {
	const ref = useRef<HTMLDivElement>(null);
	const isInView = useInView(ref);
	const { scrollY } = useScroll();
	const [scrollPos, setScrollPos] = useState<number>(0);
	const isSmallScreen = useMediaQuery({ query: '(max-width: 500px)' });

	useMotionValueEvent(scrollY, "change", (latest) => {
		if(!ref.current) return;
		const offsetTop = ref.current.offsetTop + 40;
		setScrollPos(latest - offsetTop);
	})
	const shouldVisible = (index: number) => (index === 0 || scrollPos > index * offset) && (index === whyUsData.items.length - 1 || scrollPos < (index + 1) * offset)

	return (
		<div className="landing-page-section relative grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-20 mt-40" id={'why-us'} ref={ref}>
			<div data-groupid={"landing-section"} data-section="why_us" className="relative md:sticky h-screen top-0 flex justify-center items-start pt-32">
				<CarouselContainer />
				<div className="text-left relative h-min">
					<h2 className="text-5xl">{whyUsData.title}</h2>
					<p className="opacity-60 text-md my-6">{whyUsData.description}</p>
					{whyUsData.cta && <button className="cta-button">{whyUsData.cta}</button>}
					{whyUsData.bottomLine && <p className="mt-5 text-sm opacity-60">{whyUsData.bottomLine}</p>}
					{whyUsData.bottomLine2 && <p className="opacity-60 text-md text-green-400 my-6">{whyUsData.bottomLine2}</p>}
				</div>
			</div>
			<div>
				{whyUsData.items.map((whyUsItem) => (
					<WhyUsCard
						key={whyUsItem.id}
						item={whyUsItem}
						expand={!isSmallScreen}
					/>
				))}
			</div>
			{/*<div className="hidden md:visible sticky top-0 right-0 h-screen md:flex flex-col items-center justify-center">*/}
			{/*	{whyUsData.items.map((whyUsItem, index) => (*/}
			{/*		<motion.span onClick={() => ref.current && window.scrollTo({top: (index * offset) + ref.current.offsetTop + 41, behavior: 'smooth'})} className="cursor-pointer w-3 h-3 mb-2 rounded-full bg-primaryText bg-opacity-25" initial={{'--tw-bg-opacity': 0.25}} animate={{*/}
			{/*			'--tw-bg-opacity': shouldVisible(index) ? 0.75 : 0.25*/}
			{/*		}} key={whyUsItem.id}/>*/}
			{/*	))}*/}
			{/*</div>*/}
		</div>
	)
}
