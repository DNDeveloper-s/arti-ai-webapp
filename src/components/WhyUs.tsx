'use client';

import React, {RefObject, useEffect, useMemo, useRef, useState} from 'react';
import {whyUsData, WhyUsItem} from '@/constants/pageData/whyUs';
import {PiCaretRightBold} from 'react-icons/pi';
import {useInView, useMotionValueEvent, motion, useScroll} from 'framer-motion';
import { useMediaQuery } from 'react-responsive'

interface WhyUsCardProps {
	item: WhyUsItem;
	expand?: boolean
}

const WhyUsCard: React.FC<WhyUsCardProps> = ({item, expand}) => {
	const [expanded, setExpanded] = useState(null);

	console.log('expand - ', expand, expanded);

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
const offset = 500;
export default function WhyUs() {
	const ref = useRef<HTMLDivElement>(null)
	const isInView = useInView(ref)
	const { scrollY } = useScroll();
	const [scrollPos, setScrollPos] = useState<number>(0);
	const isSmallScreen = useMediaQuery({ query: '(max-width: 500px)' })

	useMotionValueEvent(scrollY, "change", (latest) => {
		if(!ref.current) return;
		const offsetTop = ref.current.offsetTop + 40;
		setScrollPos(latest - offsetTop);
	})
	const shouldVisible = (index: number) => (index === 0 || scrollPos > index * offset) && (index === whyUsData.items.length - 1 || scrollPos < (index + 1) * offset)

	return (
		<div className="landing-page-section relative grid grid-cols-1 md:grid-cols-[1fr_1fr_30px] gap-20 mt-40" id={'why-us'} ref={ref}>
			<div className="text-left relative md:sticky h-min top-1/2" style={{transform: 'translateY(-50%)'}}>
				<h2 className="text-5xl">{whyUsData.title}</h2>
				<p className="opacity-60 text-md my-6">{whyUsData.description}</p>
				{whyUsData.cta && <button className="cta-button">{whyUsData.cta}</button>}
				{whyUsData.bottomLine && <p className="mt-5 text-sm opacity-60">{whyUsData.bottomLine}</p>}
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
