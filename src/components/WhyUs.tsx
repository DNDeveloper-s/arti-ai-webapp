'use client';

import React, {useRef, useState} from 'react';
import {whyUsData} from '@/constants/pageData/whyUs';
import {PiCaretRightBold} from 'react-icons/pi';
import {useInView, useMotionValueEvent, useScroll} from 'framer-motion';

interface WhyUsCardProps {
	id?: number;
	title: string;
	overview: string;
	readMore?: string | WhyUsCardProps[];
}

const WhyUsCard: React.FC<WhyUsCardProps> = (item) => {
	const [expanded, setExpanded] = useState(true);

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
		<div className="h-screen flex items-center">
			<div className="relative bg-secondaryText bg-opacity-25 rounded-2xl mb-14 p-8 pt-14 font-diatype" onClick={toggleExpand}>
				{/*<PiCaretRightBold className="absolute top-5 right-5" />*/}
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

export default function WhyUs() {
	const ref = useRef(null)
	const isInView = useInView(ref)
	const { scrollY } = useScroll()

	useMotionValueEvent(scrollY, "change", (latest) => {
		console.log("isInView - ", latest, ref.current)
	})
	console.log('isInView - ', isInView);


	return (
		<div className="landing-page-section relative grid grid-cols-2 gap-20 mt-40" id={'why-us'} ref={ref}>
			<div className="text-left sticky h-min top-1/2" style={{transform: 'translateY(-50%)'}}>
				<h2 className="text-5xl">{whyUsData.title}</h2>
				<p className="opacity-60 text-md my-6">{whyUsData.description}</p>
				<button className="cta-button">{whyUsData.cta}</button>
				<p className="mt-5 text-sm opacity-60">{whyUsData.bottomLine}</p>
			</div>
			<div>
				{whyUsData.items.map(whyUsItem => (
					<WhyUsCard
						key={whyUsItem.id}
						{...whyUsItem}
					/>
				))}
			</div>
		</div>
	)
}
