'use client';

import React, {FC, useRef} from 'react';
import Element from '@/components/shared/renderers/Element';
import {caseStudiesData, CaseStudyItem, navbarData} from '@/constants/landingPageData';
import {carouselImage1, carouselImage2} from '@/assets/images/carousel-images';
import Image from 'next/image';
import useMousePos from '@/hooks/useMousePos';
import ScreenLoader from '@/components/ProductPage/ScreenLoader';
import Navbar from '@/components/LandingPage/Navbar';
import {BsArrowUp} from 'react-icons/bs';
import Counter from '@/components/shared/renderers/Counter';
import CTAButton from '@/components/CTAButton';
import Footer from '@/components/ProductPage/Footer';

interface NumberValue {
	value: number;
	duration: number;
	from: number;
}

interface OutcomeItemProps {
	label: string;
	number: NumberValue & {postString: string};
}

function OutcomeItem({label, number}: OutcomeItemProps) {
	return (
		<div className={'grid grid-cols-2 md:grid-cols-[2fr_1fr] gap-10'}>
			<div className='whitespace-nowrap flex flex-col px-10 md:px-1'>
				<div>
					<p className={'font-light block text-left text-gray-400'}>{label}</p>
					<span className='text-7xl mt-4 block text-primary font-giasyr'>
						<Counter from={number.from} to={number.value} duration={number.duration} />
						<span className='text-4xl ml-1 text-primary font-giasyr'>{number.postString}</span>
					</span>
				</div>
			</div>
			<div className={'flex flex-col justify-end'}>
				<BsArrowUp />
				<span className={'text-xs text-gray-400 mt-2'}>Increase</span>
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
			<div className='relative w-full py-10 md:py-20 flex items-center max-h-[70vh]' style={{aspectRatio: 2 / 1}}>
				<div className='w-full h-full absolute top-0 left-0' style={{backgroundSize: 'cover', backgroundImage: 'url(/assets/images/landing-page/case_study_bg.svg)'}} />
				<div className='landing-page-section z-10 bg-transparent relative'>
					<Element content={item.clientDetails.name} type={'h3'} className="text-xl md:text-2xl font-medium mt-3 text-gray-400" />
					<Element content={item.oneLiner} type={'h2'} className="font-giasyr text-4xl md:text-7xl font-medium !leading-snug text-primary mt-10" />
				</div>
			</div>
			<div className="landing-page-section">
				<div className="flex flex-col gap-8 md:gap-6 md:flex-row items-start">
					<div className={'h-full text-xl md:min-w-[300px]'}>
						<span>Service and Offer</span>
					</div>
					<div className="flex flex-wrap gap-6">
						<div className='py-1 px-3 text-lg rounded-full border border-white'>
							<span>Ad Creation</span>
						</div>
						<div className='py-1 px-3 text-lg rounded-full border border-white'>
							<span>Social Media Management</span>
						</div>
						<div className='py-1 px-3 text-lg rounded-full border border-white'>
							<span>AD Analytics</span>
						</div>
					</div>
				</div>
				<div className="flex flex-col gap-8 md:gap-6 md:flex-row items-start mt-14">
					<div className={'h-full text-xl md:min-w-[300px]'}>
						<span>Sector</span>
					</div>
					<div className="flex flex-wrap gap-6">
						<div className='py-1 px-3 text-lg rounded-full border border-white'>
							<span>Physical Therapy</span>
						</div>
					</div>
				</div>
			</div>
			<div className={'landing-page-section'}>
				<div className={'grid grid-cols-1 md:grid-cols-2 mt-20'}>
					<div>
						<h4 className="text-4xl font-medium">Background and Challenge</h4>
						<p className="text-gray-400 text-lg mt-8 leading-8">Midtown East Physical Therapy, a New York-based clinic, excels in offering comprehensive physical therapy services. However, they faced a significant challenge in digital marketing. Their social media campaigns, consisting of lackluster image ads, failed to capture audience attention and generate leads, hindering their online growth.</p>
					</div>
				</div>
				<div className={'grid grid-cols-1 md:grid-cols-2 mt-20'}>
					<div />
					<div>
						<h4 className="text-4xl font-medium">Objective</h4>
						<p className="text-gray-400 text-lg mt-8 leading-8">Our goal was to transform their digital presence, leveraging advanced marketing technologies to drive engagement and patient acquisition.</p>
					</div>
				</div>
				<div className={'grid grid-cols-1 md:grid-cols-2 mt-20'}>
					<div>
						<h4 className="text-4xl font-medium">Approach and Solution</h4>
						<p className="text-gray-400 text-lg mt-10 leading-8">Our team initiated a deep dive into the clinic's marketing strategy, employing AI-driven tools for a comprehensive analysis. This included competitor benchmarking and market trends evaluation to identify key areas of improvement. We then harnessed generative AI to design and execute a series of captivating, targeted ads (image and text), each crafted to resonate with the clinic's audience. Our approach was not only creative but also data-driven, ensuring each ad was optimized for maximum impact. Below are some of our best performing ADs:</p>
					</div>
				</div>
				<div className='w-full'>
					<div className="flex justify-center gap-6 my-10">
						<div className="w-1/2">
							<Image className={'w-full h-auto'} src={carouselImage1} alt={"Arti AI"} />
						</div>
						<div className="w-1/2">
							<Image className={'w-full h-auto'} src={carouselImage2} alt={"Arti AI"} />
						</div>
					</div>
				</div>
				<div className='flex flex-col md:flex-row gap-4 md:gap-10 mt-20'>
					<div>
						<h4 className="text-4xl font-medium">Outcomes</h4>
						<div className="text-gray-400 text-lg mt-5 leading-7">
							<p>The result were dramatic:</p>
							<ul className="flex flex-col list-disc list-outside px-6 gap-2 mt-4">
								<li>Reduction in ad volume with a focus on quality, producing <strong className="text-white">5 high-impact ads</strong> compared to the previous 30.</li>
								<li>A surge in engagement, evidenced by an increase from <strong className="text-white">15 to 450 link clicks</strong>.</li>
								<li>A breakthrough in conversions, achieving <strong className="text-white">12 compared to none</strong> previously, within a span of 5 days.</li>
								<li>Cost efficiency was significantly improved, with expenses cut to a <strong className="text-white">third of the previous amount</strong>.</li>
							</ul>
						</div>
					</div>
					<div className="flex flex-col gap-6 justify-center my-5">
						<OutcomeItem label={'Website Visits'} number={{value: 7, duration: 2, from: 0, postString: 'x'}} />
						<OutcomeItem label={'Leads'} number={{value: 4, duration: 2, from: 0, postString: 'x'}} />
						<OutcomeItem label={'Cheaper'} number={{value: 2, duration: 2, from: 0, postString: 'x'}} />
					</div>
				</div>
				<div className={'mt-20 py-10 md:py-24'}>
					{/*<h4 className="text-xl font-medium">Client Quote</h4>*/}
					<div className={'text-5xl leading-snug text-white font-mali'}>
						<span>"Arti AI can help me grow from 80 to 95 patients, and scale my business to medium scale, thank you guys!"</span>
					</div>
					<div className={'flex justify-end items-center mt-10 gap-5'}>
						<div className={'h-0.5 bg-gray-500 bg-opacity-60 w-[100px]'}/>
						<span className={'text-xl'}>Greg, Midtown East Co-Owner</span>
					</div>
				</div>
				<div className={'grid grid-cols-1 md:grid-cols-2 mt-20'}>
					<div>
						<h4 className="text-4xl font-medium">Conclusion</h4>
						<p className="text-gray-400 text-lg mt-8 leading-8">This case is a testament to the power of intelligent and targeted digital marketing. Through our strategic approach, Midtown East Physical Therapy not only enhanced their online presence but also achieved substantial business growth, marking a new era in their digital journey.</p>
					</div>
				</div>
				<div className={'grid grid-cols-1 md:grid-cols-2 mt-20'}>
					<div />
					<div>
						<h4 className="text-4xl font-medium">Engage with Us</h4>
						<p className="text-gray-400 text-lg mt-8 leading-8 mb-8">Are you facing similar challenges in your digital marketing efforts? Connect with us to explore how our cutting-edge solutions can transform your online presence and drive tangible business growth.</p>
						<CTAButton>
							<span>Try it free for 2 weeks</span>
						</CTAButton>
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
			<Footer />
		</>
	)
}
