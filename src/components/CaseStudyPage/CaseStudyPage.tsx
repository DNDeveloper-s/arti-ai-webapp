'use client';

import React, {FC, useRef} from 'react';
import Element from '@/components/shared/renderers/Element';
import {caseStudiesData, CaseStudyItem, navbarData} from '@/constants/landingPageData';
import {carouselImage1, carouselImage2} from '@/assets/images/carousel-images';
import Image from 'next/image';
import useMousePos from '@/hooks/useMousePos';
import ScreenLoader from '@/components/ProductPage/ScreenLoader';
import Navbar from '@/components/LandingPage/Navbar';

function OutcomeItem({label}: {label: string}) {
	const ref = useRef<HTMLDivElement>(null);
	const mousePos = useMousePos(ref);
	return (
		<div className='arti-card rounded' ref={ref} style={{'--mouse-x': `${mousePos.x}px`, '--mouse-y': `${mousePos.y}px`}}>
			<div className="p-3 flex cursor-pointer flex-col gap-6 items-center justify-center relative h-full bg-gray-950 w-full rounded-[inherit] z-20 overflow-hidden scale-100 font-diatype group">
				<span className="text-primary">{label}</span>
			</div>
		</div>
	)
}

interface CaseStudyItemProps {
	item: CaseStudyItem;
}

const CaseStudyItem: FC<CaseStudyItemProps> = ({item}) => {
	return (
		<div>
			<div className='relative w-full py-20'>
				<div className='w-full h-full absolute top-0 left-0' style={{backgroundSize: 'cover', backgroundImage: 'url(/assets/images/landing-page/case_study_bg.png)'}} />
				<div className='landing-page-section z-10 bg-transparent relative'>
					<Element content={item.clientDetails.name} type={'h3'} className="text-2xl font-medium mt-3 text-gray-400" />
					<Element content={item.oneLiner} type={'h2'} className="text-6xl font-medium leading-normal text-primary mt-2" />
				</div>
			</div>
			<div className={'landing-page-section'}>
				<div>
					<h4 className="text-3xl font-light mt-10">Background and Challenge</h4>
					<p className="text-gray-400 text-lg mt-5 leading-7">Midtown East Physical Therapy, a New York-based clinic, excels in offering comprehensive physical therapy services. However, they faced a significant challenge in digital marketing. Their social media campaigns, consisting of lackluster image ads, failed to capture audience attention and generate leads, hindering their online growth.</p>
				</div>
				<div>
					<h4 className="text-3xl font-light mt-10">Objective</h4>
					<p className="text-gray-400 text-lg mt-5 leading-7">Our goal was to transform their digital presence, leveraging advanced marketing technologies to drive engagement and patient acquisition.</p>
				</div>
				<div>
					<h4 className="text-3xl font-light mt-10">Approach and Solution</h4>
					<p className="text-gray-400 text-lg mt-5 leading-7">Our team initiated a deep dive into the clinic's marketing strategy, employing AI-driven tools for a comprehensive analysis. This included competitor benchmarking and market trends evaluation to identify key areas of improvement. We then harnessed generative AI to design and execute a series of captivating, targeted ads (image and text), each crafted to resonate with the clinic's audience. Our approach was not only creative but also data-driven, ensuring each ad was optimized for maximum impact. Below are some of our best performing ADs:</p>
					<div className="flex justify-center gap-6 my-10">
						<div className="w-1/2">
							<Image className={'w-full h-auto'} src={carouselImage1} alt={"Arti AI"} />
						</div>
						<div className="w-1/2">
							<Image className={'w-full h-auto'} src={carouselImage2} alt={"Arti AI"} />
						</div>
					</div>
				</div>
				<div>
					<h4 className="text-3xl font-light mt-10">Outcomes</h4>
					<div className="text-gray-400 text-lg mt-5 leading-7">
						<p>The result were dramatic:</p>
						<ul className="list-disc list-inside leading-10">
							<li>Reduction in ad volume with a focus on quality, producing <strong className="text-white">5 high-impact ads</strong> compared to the previous 30.</li>
							<li>A surge in engagement, evidenced by an increase from <strong className="text-white">15 to 450 link clicks</strong>.</li>
							<li>A breakthrough in conversions, achieving <strong className="text-white">12 compared to none</strong> previously, within a span of 5 days.</li>
							<li>Cost efficiency was significantly improved, with expenses cut to a <strong className="text-white">third of the previous amount</strong>.</li>
						</ul>
					</div>
					<div className="flex gap-4 justify-center my-5">
						<OutcomeItem label={'7x Website Visits'} />
						<OutcomeItem label={'4x Leads'} />
						<OutcomeItem label={'2x Cheaper'} />
					</div>
				</div>
			</div>
		</div>
	)
}

interface CaseStudiesProps {

}

const CaseStudies: FC<CaseStudiesProps> = (props) => {
	return (
		<div className="pt-10">
			{/*<Element content={'Case Study'} type={'h2'} className="text-2xl text-gray-500" />*/}
			{/*<Element content={caseStudiesData.subHeadLine} type={'h6'} />*/}
			<Element content={caseStudiesData.items} type={'div'}>
				{caseStudiesData.items.slice(0,1).map(item => (
					<CaseStudyItem key={item.id} item={item} />
				))}
			</Element>
		</div>
	);
};

export default function CaseStudyPage() {
	return (
		<>
			<ScreenLoader />
			<Navbar />
			<main className="mt-10">
				<CaseStudies />
			</main>
		</>
	)
}
