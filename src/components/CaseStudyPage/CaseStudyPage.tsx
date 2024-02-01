'use client';

import React, {FC, useRef} from 'react';
import Element from '@/components/shared/renderers/Element';
import {caseStudiesData, CaseStudyItem, navbarData} from '@/constants/landingPageData';
import {carouselImage1, carouselImage2} from '@/assets/images/carousel-images';
import Image from 'next/image';
import useMousePos from '@/hooks/useMousePos';
import ScreenLoader from '@/components/ProductPage/ScreenLoader';
import Navbar from '@/components/ProductPage/Navbar';
import {BsArrowDown, BsArrowUp} from 'react-icons/bs';
import Counter from '@/components/shared/renderers/Counter';
import CTAButton from '@/components/CTAButton';
import Footer from '@/components/ProductPage/Footer';
import {AnimatedAdPreview} from '@/components/LandingPage/CaseStudies';
import TryForFreeButton from '@/components/ProductPage/TryForFreeButton';
import {useMediaQuery} from 'react-responsive';

interface NumberValue {
	value: number;
	duration: number;
	from: number;
}

interface OutcomeItemProps {
	label: string;
	number: NumberValue & {postString: string};
	decrease?: boolean;
}

function OutcomeItem({label, number, decrease}: OutcomeItemProps) {
	return (
		<div className={'grid grid-cols-2 md:grid-cols-[130px_1fr] gap-10'}>
			<div className='whitespace-nowrap flex flex-col px-10 md:px-1'>
				<div>
					<span className='text-7xl mb-4 block text-primary font-giasyr'>
						<Counter from={number.from} to={number.value} duration={number.duration} />
						<span className='text-4xl ml-1 text-primary font-giasyr'>{number.postString}</span>
					</span>
					<p className={'font-light block text-left text-gray-400'}>{label}</p>
				</div>
			</div>
			<div className={'flex flex-col justify-end'}>
				{decrease ? <BsArrowDown /> : <BsArrowUp/>}
				<span className={'text-xs text-gray-400 mt-2'}>{decrease ? 'Decrease' : 'Increase'}</span>
			</div>
		</div>
	)
}

interface CaseStudyItemProps {
	item: CaseStudyItem;
}

const CaseStudyItem: FC<CaseStudyItemProps> = ({item}) => {
	const isSmallScreen = useMediaQuery({query: '(max-width: 500px)'});
	return (
		<div>
			<div className='relative w-full py-10 md:py-20 flex items-center max-h-[70vh]' style={{aspectRatio: 2 / 1}}>
				<div className='w-full h-full absolute top-0 left-0' style={{backgroundSize: 'cover', backgroundImage: 'url(/assets/images/landing-page/case_study_bg.svg)'}} />
				<div className='landing-page-section z-10 bg-transparent relative'>
					<Element content={item.clientDetails.name} type={'h3'} className="text-xl md:text-2xl font-medium mt-3 text-gray-400" />
					<Element content={item.oneLiner} type={'h2'} className="font-giasyr text-4xl md:text-7xl font-medium !leading-snug text-primary mt-10" />
				</div>
			</div>
			<Element content={item.images?.main_image && item.images?.main_image.length > 0} type={'div'} className={'landing-page-section'}>
				<div className={'w-full'}>
					<div className="flex justify-center gap-6 my-10">
						{item.images?.main_image?.map((image, index) => (
							<>
								<div style={{width: `calc(100% / ${item.images?.main_image?.length})`}}>
									<Image className={'w-full h-auto'} src={image} alt={"Arti AI"} />
								</div>
							</>
						))}
					</div>
				</div>
			</Element>
			<Element content={item.service_info} type={'div'} className={'landing-page-section flex flex-col gap-14'}>
				{item.service_info?.map((service, index) => (
					<div className="flex flex-col gap-8 md:gap-6 md:flex-row items-start" key={index}>
						<div className={'h-full text-xl md:min-w-[300px]'}>
							<span>{service.title}</span>
						</div>
						<div className="flex flex-wrap gap-6">
							{service.items.map((item, index) => (
								<div className='py-1 px-3 text-lg rounded-full border border-white' key={index}>
									<span>{item}</span>
								</div>
							))}
						</div>
					</div>
				))}
			</Element>
			<Element content={item.sections} type={'div'} className={'landing-page-section'}>
				{item.sections.sort((a,b) => (a.serialOrder ?? 0) - (b.serialOrder ?? 0))?.map((section, index) => (
					<div className={'grid grid-cols-1 md:grid-cols-2 gap-14 md:gap-5 mt-20'} key={index}>
						{index % 2 !== 0 && <div className={section.sideContent ? '' : 'hidden md:block'}>{section.sideContent ?? null}</div>}
						<div>
							<h4 className="text-4xl font-medium">{section.headLine}</h4>
							<p className="text-gray-400 text-lg mt-8 leading-8">{section.description}</p>
						</div>
						{index % 2 === 0 && <div className={section.sideContent ? '' : 'hidden md:block'}>{section.sideContent ?? null}</div>}
					</div>
				))}
			</Element>
			<Element content={item.images?.raw && item.images?.raw.length > 0} type={'div'} className={'landing-page-section md:max-w-[1300px]'}>
				<div className={'w-full'}>
					<div className="flex flex-col md:flex-row justify-end gap-14 my-2 md:my-10">
						{item.images?.raw?.map((image, index) => (
							<>
								<div style={{width: isSmallScreen ? '100%' : `calc(100% / ${item.images.raw.length})`}}>
									<Image className={'w-full h-auto'} src={image} alt={"Arti AI"} />
								</div>
							</>
						))}
					</div>
				</div>
			</Element>
			<Element content={item.outcomes} type={'div'} className={'landing-page-section'}>
				<div className='flex flex-col md:flex-row gap-4 md:gap-10 mt-20'>
					<div>
						<h4 className="text-4xl font-medium">{item.outcomes?.headLine}</h4>
						{item.outcomes?.description}
					</div>
					<div className="flex flex-col gap-6 justify-center my-5">
						{item.outcomes?.outcomeData.map((outcome, index) => (
							<OutcomeItem label={outcome.label} number={outcome.number} key={index} decrease={outcome.decrease} />
						))}
					</div>
				</div>
			</Element>
			<Element content={item.clientQuote?.description} type={'div'} className={'landing-page-section'}>
				<div className={'mt-8 md:mt-16 py-10 md:py-24'}>
					{/*<h4 className="text-xl font-medium">Client Quote</h4>*/}
					<div className={'text-3xl md:text-5xl !leading-snug text-white font-giasyr'}>
						{item.clientQuote?.description}
					</div>
					{item.clientQuote?.author && <div className={'flex justify-end items-center mt-10 gap-5'}>
						<div className={'h-0.5 bg-gray-500 bg-opacity-60 w-[100px]'}/>
						<span className={'text-lg md:text-xl'}>{item.clientQuote?.author}</span>
					</div>}
				</div>
			</Element>
			{/* <Element content={item.previews} type={'div'} className={'landing-page-section h-[600px] flex gap-4 p-3 justify-center items-center'}>
				<AnimatedAdPreview isActive={true} previews={item.previews ?? []} />
			</Element> */}
			<Element content={item.lowerSections} type={'div'} className={'landing-page-section'}>
				<div className={'grid grid-cols-1 md:grid-cols-2 mt-20 gap-10'}>
					{item.lowerSections?.sort((a,b) => (a.serialOrder ?? 0) - (b.serialOrder ?? 0))?.map((section, index) => (
							<div key={section.id}>
								<h4 className="text-4xl font-medium">{section.headLine}</h4>
								<p className="text-gray-400 text-lg mt-8 mb-3 leading-8">{section.description}</p>
								{section.containsCta && <CTAButton>
	                <span>Try it free for 2 weeks</span>
	              </CTAButton>}
							</div>
					))}
				</div>
			</Element>
			{/*<Element content={item.engageWithUs} type={'div'} className={'landing-page-section'}>*/}
			{/*	<div className={'grid grid-cols-1 md:grid-cols-[5fr_3fr] mt-20'}>*/}
			{/*		<div className={'h-[600px] flex gap-4 p-3 justify-center items-center'}>*/}
			{/*			<AnimatedAdPreview isActive={true} />*/}
			{/*		</div>*/}
			{/*		<div className={'flex flex-col justify-center'}>*/}
			{/*			<h4 className="text-4xl font-medium">{item.engageWithUs.headLine}</h4>*/}
			{/*			<p className="text-gray-400 text-lg mt-8 mb-3 leading-8">{item.engageWithUs.description}</p>*/}
			{/*			<CTAButton>*/}
			{/*				<span>Try it free for 2 weeks</span>*/}
			{/*			</CTAButton>*/}
			{/*		</div>*/}
			{/*	</div>*/}
			{/*</Element>*/}
		</div>
	)
}

interface CaseStudiesProps {
	caseStudyItem: CaseStudyItem
}

const CaseStudies: FC<CaseStudiesProps> = ({caseStudyItem}) => {
	return (
		<div className="pt-10">
			{/*<Element content={'Case Study'} type={'h2'} className="text-2xl text-gray-500" />*/}
			{/*<Element content={caseStudiesData.subHeadLine} type={'h6'} />*/}
			<Element content={caseStudyItem} type={'div'}>
				<CaseStudyItem key={caseStudyItem.id} item={caseStudyItem} />
			</Element>
		</div>
	);
};

export default function CaseStudyPage({caseStudyItem}: {caseStudyItem: CaseStudyItem}) {
	return (
		<>
			<ScreenLoader />
			<Navbar />
			<main className="mt-10">
				<CaseStudies caseStudyItem={caseStudyItem} />
			</main>
			<TryForFreeButton label={'Contact Us'} />
			<Footer />
		</>
	)
}
