'use client';
import React, {useEffect, useRef, useState} from 'react';
import {whyUsData, WhyUsItem} from '@/constants/landingPageData/whyUs/whyUs';
import {PiCaretRightBold} from 'react-icons/pi';
import {useInView, useMotionValueEvent, motion, useScroll} from 'framer-motion';
import { useMediaQuery } from 'react-responsive';
import Image from 'next/image';

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

	return (
		<div className="arti-card">
			<div className="p-6 relative h-full bg-gray-950 rounded-[inherit] z-20 overflow-hidden  font-diatype" onClick={toggleExpand}>
			{/*<div className="relative bg-secondaryText bg-opacity-25 rounded-2xl p-8 mb-10 md:mb-0 pt-14 font-diatype" onClick={toggleExpand}>*/}
				<PiCaretRightBold style={{transform: `rotate(${expanded ? -90 : 0}deg)`}} className="md:hidden transition-all absolute top-5 right-5" />
				{item.icon && (
					<div className="w-10 h-10 border border-gray-900 rounded-full flex justify-center items-center mb-4">
						<item.icon className="w-8 h-8 text-white fill-primary stroke-primary" />
					</div>
				)}
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

interface TestimonialItemProps {
	item: {
		title: string
	}
}
const TestimonialItem: React.FC<TestimonialItemProps> = ({item}) => {
	return (
		<div>
			<div className="bg-gray-800 py-2 px-4 rounded-lg whitespace-nowrap">
				<span>{item.title}</span>
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

	return (
		<div className="landing-page-section relative mt-40" id={'why-us'} ref={ref}>
		{/*<div className="landing-page-section relative grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-20 mt-40" id={'why-us'} ref={ref}>*/}
			{/*<div data-groupid={"landing-section"} data-section="why_us" className="relative md:sticky h-screen top-0 flex justify-center items-start pt-32">*/}
			{/*	<div className="text-left relative h-min">*/}
			{/*		<h2 className="text-5xl">{whyUsData.title}</h2>*/}
			{/*		<p className="opacity-60 text-md my-6">{whyUsData.description}</p>*/}
			{/*		{whyUsData.cta && <button className="cta-button">{whyUsData.cta}</button>}*/}
			{/*		{whyUsData.bottomLine && <p className="mt-5 text-sm opacity-60">{whyUsData.bottomLine}</p>}*/}
			{/*		{whyUsData.bottomLine2 && <p className="opacity-60 text-md text-green-400 my-6">{whyUsData.bottomLine2}</p>}*/}
			{/*	</div>*/}
			{/*</div>*/}
			<div data-groupid={"landing-section"} data-section="why_us" className="max-w-[800px] mx-auto grid grid-cols-2 gap-8">
				{whyUsData.items.map((whyUsItem) => (
					<WhyUsCard
						key={whyUsItem.id}
						item={whyUsItem}
						expand={!isSmallScreen}
					/>
				))}
			</div>
			<div className="flex my-20 overflow-hidden gap-3 mask-black">
				<div className="flex justify-center gap-3 image-animation-1">
					<TestimonialItem item={{title: 'Amazon'}} />
					<TestimonialItem item={{title: 'Microsoft'}} />
					<TestimonialItem item={{title: 'Apple'}} />
					<TestimonialItem item={{title: 'Google'}} />
					<TestimonialItem item={{title: 'Mendable'}} />
					<TestimonialItem item={{title: 'Pustack'}} />
					<TestimonialItem item={{title: 'Facebook'}} />
					<TestimonialItem item={{title: 'Android'}} />
					<TestimonialItem item={{title: 'VS Code'}} />
					<TestimonialItem item={{title: 'Youtube'}} />
					<TestimonialItem item={{title: 'Monitor'}} />
				</div>
				<div className="flex justify-center gap-3 image-animation-1">
					<TestimonialItem item={{title: 'Amazon'}} />
					<TestimonialItem item={{title: 'Microsoft'}} />
					<TestimonialItem item={{title: 'Apple'}} />
					<TestimonialItem item={{title: 'Google'}} />
					<TestimonialItem item={{title: 'Mendable'}} />
					<TestimonialItem item={{title: 'Pustack'}} />
					<TestimonialItem item={{title: 'Facebook'}} />
					<TestimonialItem item={{title: 'Android'}} />
					<TestimonialItem item={{title: 'VS Code'}} />
					<TestimonialItem item={{title: 'Youtube'}} />
					<TestimonialItem item={{title: 'Monitor'}} />
				</div>
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
