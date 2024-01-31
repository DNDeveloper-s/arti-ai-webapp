'use client';

import React, {FC, useCallback, useEffect, useRef, useState} from 'react';
import Element from '@/components/shared/renderers/Element';
import {brands, caseStudiesData, CaseStudy, CaseStudyItem} from '@/constants/landingPageData';
import {carouselImage1, carouselImage2} from '@/assets/images/carousel-images';
import Image from 'next/image';
import SwipeableViews from 'react-swipeable-views';
import CTAButton from '@/components/CTAButton';
import {AiOutlineCaretLeft, AiOutlineCaretRight} from 'react-icons/ai';
import caseStudies from '@/components/LandingPage/CaseStudies';
import {RxCaretLeft, RxCaretRight} from 'react-icons/rx';
import adPreviewImage from '@/assets/images/case-study/midtowneast/preview_images_old.png';
import AdPreview, {
	AdPreview2,
	AdPreview3,
	AdPreviewBlack4,
	AdPreviewBlack5,
	FacebookAdPreview, FacebookAdPreview2
} from '@/components/LandingPage/AdPreview';
import adSnapshot from '@/assets/images/case-study/midtowneast/ad_creative.png';
import {AnimatePresence, motion} from 'framer-motion';

function CaseStudyContent({item}: {item: CaseStudyItem}) {
	console.log('item - ', item);
	return (
		<div className={"h-full flex flex-col justify-center divide-y divide-gray-800 p-4"}>
			<Element content={item.brief.client_name} type={'h3'} className={"text-3xl font-extrabold pb-4"} />
			<Element content={item.brief.oneLiner} type={'p'} className="pt-9 leading-relaxed text-gray-400"/>
			<CTAButton className="py-2 px-4 text-sm rounded mt-12" to={"/case-study/" + item.id}>Read More</CTAButton>
		</div>
	)
}

const bg = ['red', 'green', 'blue'];

interface PreviewObj {
	id: string;
	el: JSX.Element;
}

const previews = [
	{id: '1', el: <div key={'1'} className={'w-[320px] flex-shrink-0'}>
			<FacebookAdPreview variant={brands.midTownEast.variant[0]} />
		</div>},
	{id: '2', el: <div key={'2'} className={'w-[320px] flex-shrink-0'}>
			<FacebookAdPreview variant={brands.midTownEast.variant[1]} />
		</div>},
	{id: '3', el: <div key={'3'} className={'w-[320px] flex-shrink-0'}>
			<FacebookAdPreview variant={brands.midTownEast.variant[2]} />
		</div>}
]

export function AnimatedAdPreview({isActive, previews = []}: {isActive: boolean, previews?: PreviewObj[]}) {
	const [preview, setPreview] = useState(previews[0]);
	const intervalIdRef = useRef<NodeJS.Timeout>();

	const handleChange = useCallback(() => {
		setPreview(c => {
			const ind = previews.indexOf(c);
			if(ind === previews.length - 1) {
				return previews[0];
			}
			return previews[ind + 1];
		});
	}, [previews]);

	useEffect(() => {
		if(!isActive) {
			return clearInterval(intervalIdRef.current);
		}

		intervalIdRef.current = setInterval(() => {
			handleChange();
		}, 3000)
		const intervalId = intervalIdRef.current;

		return () => {
			clearInterval(intervalId);
		}
	}, [handleChange, isActive])

	return (
		<Element content={preview.id} type={'div'} className="w-full flex items-center justify-center gap-7">
			<AnimatePresence mode={'wait'}>

				{/*<motion.div key={preview.id} initial={{scale: 1.15, opacity: 0}} animate={{scale: 1, opacity: 1}} exit={{scale: 0.85, opacity: 0}}>*/}
				{/*<motion.div key={preview.id} initial={{scale: 0.85, opacity: 0}} animate={{scale: 1, opacity: 1}} exit={{scale: 1.15, opacity: 0}}>*/}
				<motion.div key={preview.id} initial={{x: -40, opacity: 0}} animate={{x: 0, opacity: 1}} exit={{x: 40, opacity: 0}}>
					{preview.el}
				</motion.div>
			</AnimatePresence>
		</Element>
	)
}

function CaseStudyImage({item}: {item: CaseStudyItem}) {

	return (
		<Element content={item.images.preview_image} type={'div'} className="w-full flex items-center justify-center gap-7">
			{/*<Image src={item.image.imageSrc} alt={'Image Item'} />*/}
			{/*<div className={'w-[350px] scale-75'}>*/}

			{/*<div className={'w-[320px] h-[567px] flex-shrink-0'}>*/}
			{/*	<FacebookAdPreview variant={brands.midTownEast.variant[0]} />*/}
			{/*</div>*/}
			{/*<div className={'flex flex-col gap-7'}>*/}
			{/*	<div className={'w-[550px]'}>*/}
			{/*		<FacebookAdPreview2 variant={brands.midTownEast.variant[1]} />*/}
			{/*	</div>*/}
			{/*	<div className={'w-[320px] flex-shrink-0'}>*/}
			{/*		<FacebookAdPreview variant={brands.midTownEast.variant[2]} />*/}
			{/*	</div>*/}
			{/*</div>*/}

			{/*<AnimatePresence mode={'wait'}>*/}
			{/*	<motion.div key={preview.id} initial={{x: -40, opacity: 0}} animate={{x:0, opacity: 1}} exit={{x: 40, opacity: 0}}>*/}
			{/*		{preview.el}*/}
			{/*	</motion.div>*/}
			{/*</AnimatePresence>*/}

			{/*<button onClick={handleChange}>Change</button>*/}
			
			{/*<div className={'w-[320px] h-[567px] flex-shrink-0'}>*/}
			{/*	<AdPreview brand={brands.amplified} />*/}
			{/*</div>*/}
			{/*<div className={'flex flex-col gap-7'}>*/}
			{/*	<div className={'w-[550px]'}>*/}
			{/*		<AdPreviewBlack5 brand={brands.amplified} />*/}
			{/*	</div>*/}
			{/*	<div className={'w-[350px] flex-shrink-0'}>*/}
			{/*		<AdPreviewBlack4 brand={brands.amplified} />*/}
			{/*	</div>*/}
			{/*</div>*/}

			<Image src={item.images.preview_image} alt={'Ad Preview Image'} />

			{/*<div className={'w-[240px] h-auto'}>*/}
			{/*	<Image src={adSnapshot} alt={'Ad Snapshot'} />*/}
			{/*</div>*/}
		</Element>
	)
}

interface CaseStudiesProps {

}

const CaseStudies: FC<CaseStudiesProps> = (props) => {
	const [activeTab, setActiveTab] = useState(0);

	const handleChange = (dir: number) => {
		setActiveTab(ind => {
			const newInd = ind + dir;
			if(newInd >= 0 && newInd < caseStudiesData.items.length) {
				return newInd;
			}
			return ind;
		})
	}

	return (
		<div id="case-studies" data-groupid="landing-section" className="px-3 py-12 md:py-16">
			<Element content={caseStudiesData.headLine} type={'h2'} className={'text-center mb-5 md:mb-0'}>
				<span className={'landing-page-grad-title'}>{caseStudiesData.headLine}</span>
			</Element>
			<Element content={caseStudiesData.subHeadLine} type={'h6'} />
			<div className="flex-col-reverse pl-0 md:pl-14 gap-10 md:gap-1 flex md:flex-row py-10 md:py-20 pt-0 md:pt-0 justify-center">
				<>
					<div className={'flex flex-col relative justify-between w-full md:w-[40%] md:max-w-[520px] px-6'}>
						<div className={'absolute top-1/2 -left-2 transform -translate-y-1/2 flex items-center gap-2 group cursor-pointer'} onClick={() => handleChange(-1)}>
							<div>
								<RxCaretLeft className={'text-5xl transition-all ' + (activeTab === 0 ? 'text-gray-700' : '')} />
							</div>
							{/*<span className="text-gray-400 group-hover:text-gray-200">PREV</span>*/}
						</div>
						<SwipeableViews
							axis="x"
							index={activeTab}
							onChangeIndex={(e) => setActiveTab(e)}
							scrolling={"false"}
							ignoreNativeScroll={true}
							disabled={true}
							style={{height: '100%'}}
							containerStyle={{height: '100%'}}
						>
							{caseStudiesData.items.map(item => <CaseStudyContent item={item} key={item.id} />)}
						</SwipeableViews>
						<div className={'absolute top-1/2 -right-2 transform -translate-y-1/2 flex items-center gap-2 group cursor-pointer'} onClick={() => handleChange(1)}>
							{/*<span className="text-gray-400 group-hover:text-gray-200">NEXT</span>*/}
							<div>
								<RxCaretRight className={'text-5xl transition-all ' + (activeTab === caseStudiesData.items.length - 1 ? 'text-gray-700' : '')} />
							</div>
						</div>
					</div>
					<div className={'w-full md:w-[50%]'}>
						<SwipeableViews
							axis="x"
							index={activeTab}
							onChangeIndex={(e) => setActiveTab(e)}
							scrolling={"false"}
							ignoreNativeScroll={true}
							disabled={true}
							style={{height: '100%'}}
							containerStyle={{height: '100%'}}
						>
							{caseStudiesData.items.slice(0, 2).map(item => (
								<div key={item.id} className={'h-full flex gap-4 p-3 justify-center items-center'}>
									<CaseStudyImage item={item} />
								</div>
							))}
							<div className={'h-full flex gap-4 p-3 justify-center items-center overflow-x-hidden'}>
								<AnimatedAdPreview isActive={activeTab === 2} previews={previews} />
							</div>
						</SwipeableViews>
					</div>
				</>
			</div>
		</div>
	);
};

export default CaseStudies;
