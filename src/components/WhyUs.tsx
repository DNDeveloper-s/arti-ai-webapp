'use client';

import React, {RefObject, useMemo, useRef, useState} from 'react';
import {whyUsData} from '@/constants/pageData/whyUs';
import {PiCaretRightBold} from 'react-icons/pi';
import {useInView, useMotionValueEvent, motion, useScroll} from 'framer-motion';
import { useMediaQuery } from 'react-responsive'

interface WhyUsItem {
	id?: number;
	title: string;
	overview: string;
	readMore?: string | WhyUsCardProps[];
}

interface WhyUsCardProps {
	item: WhyUsItem;
	expand?: boolean
}

const WhyUsCard: React.FC<WhyUsCardProps> = ({item, expand = true}) => {
	const [expanded, setExpanded] = useState(expand);

	function toggleExpand() {
		setExpanded(c => !c);
	}

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
		<div className="relative bg-secondaryText bg-opacity-25 rounded-2xl p-8 mb-10 md:mb-0 pt-14 font-diatype" onClick={toggleExpand}>
			<PiCaretRightBold className="md:hidden absolute top-5 right-5" />
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
				{/*<button className="cta-button">{whyUsData.cta}</button>*/}
				<p className="mt-5 text-sm opacity-60">{whyUsData.bottomLine}</p>
			</div>
			<div className="relative h-auto w-auto md:h-[2800px] md:w-[360px]">
				<div className="relative md:sticky top-0 right-0 h-auto md:h-screen flex flex-col items-center">
					{(whyUsData.items as WhyUsItem[]).map((whyUsItem, index) => (
						!isSmallScreen ? <motion.div key={whyUsItem.id} initial={{
							opacity: 0,
							x: 150,
						}} animate={{
							opacity: shouldVisible(index) ? 1 : 0,
							x: shouldVisible(index) ? 0 : 150,
						}} transition={{delay: 0.3}} className="absolute top-0 right-0 h-screen flex items-center">
							<WhyUsCard
								item={whyUsItem}
							/>
						</motion.div> :
						<WhyUsCard
							key={whyUsItem.id}
							expand={!isSmallScreen}
							item={whyUsItem}
						/>
					))}
				</div>
			</div>
			<div className="hidden md:visible sticky top-0 right-0 h-screen md:flex flex-col items-center justify-center">
				{whyUsData.items.map((whyUsItem, index) => (
					<motion.span onClick={() => ref.current && window.scrollTo({top: (index * offset) + ref.current.offsetTop + 41, behavior: 'smooth'})} className="cursor-pointer w-3 h-3 mb-2 rounded-full bg-primaryText bg-opacity-25" initial={{'--tw-bg-opacity': 0.25}} animate={{
						'--tw-bg-opacity': shouldVisible(index) ? 0.75 : 0.25
					}} key={whyUsItem.id}/>
				))}
			</div>
		</div>
	)
}
