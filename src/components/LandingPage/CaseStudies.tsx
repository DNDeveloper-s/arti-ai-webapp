'use client';

import React, {FC, useRef, useState} from 'react';
import Element from '@/components/shared/renderers/Element';
import {caseStudiesData, CaseStudyItem} from '@/constants/landingPageData';
import {carouselImage1, carouselImage2} from '@/assets/images/carousel-images';
import Image from 'next/image';
import SwipeableViews from 'react-swipeable-views';
import CTAButton from '@/components/CTAButton';
import {AiOutlineCaretLeft, AiOutlineCaretRight} from 'react-icons/ai';
import caseStudies from '@/components/LandingPage/CaseStudies';
import {RxCaretLeft, RxCaretRight} from 'react-icons/rx';

function CaseStudyContent({item}: {item: CaseStudyItem}) {
	return (
		<div className={"h-full flex flex-col justify-center divide-y divide-gray-800 p-4"}>
			<Element content={item.clientDetails.name} type={'h3'} className={"text-3xl font-extrabold pb-4"} />
			<Element content={item.oneLiner} type={'p'} className="pt-9 text-gray-400"/>
			<CTAButton className="py-2 px-4 text-sm rounded mt-12" to={"/case-study"}>VIEW CASE STUDY</CTAButton>
		</div>
	)
}

function CaseStudyImage({item}: {item: CaseStudyItem}) {
	return (
		<Element content={item.image.imageSrc} type={'div'} className="w-full">
			<Image src={item.image.imageSrc} alt={'Image Item'} />
		</Element>
	)
	// return (item.images.map(imageItem => (
	// 			<Element key={imageItem.id} content={imageItem.imageSrc} type={'div'} className="w-[40%] p-1 bg-gray-800 rounded">
	// 				<Image src={imageItem.imageSrc} alt={'Image Item'} />
	// 				<p className={'text-center mt-1'}>{imageItem.label}</p>
	// 			</Element>
	// 		))
	// )
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
		<div id="case-studies" className="landing-page-section py-12 md:py-16">
			<Element content={caseStudiesData.headLine} type={'h2'} className="text-3xl text-center" />
			<Element content={caseStudiesData.subHeadLine} type={'h6'} />
			<div className="flex-col-reverse gap-10 md:gap-1 flex md:flex-row py-10 md:py-20 justify-center">
				<>
					<div className={'flex flex-col relative justify-between w-full md:w-[40%] px-6'}>
						<div className={'absolute top-1/2 -left-2 transform -translate-y-1/2 flex items-center gap-2 group cursor-pointer'} onClick={() => handleChange(-1)}>
							<div>
								<RxCaretLeft className={'text-5xl'} />
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
								<RxCaretRight className={'text-5xl'} />
							</div>
						</div>
					</div>
					<div className={'w-full md:w-[60%]'}>
						<SwipeableViews
							axis="x"
							index={activeTab}
							onChangeIndex={(e) => setActiveTab(e)}
							scrolling={"false"}
							ignoreNativeScroll={true}
							disabled={true}
							style={{height: '100%'}}
						>
							{caseStudiesData.items.map(item => (
								<div key={item.id} className={'h-full flex gap-4 p-3 justify-center items-center'}>
									<CaseStudyImage item={item} />
								</div>
							))}
						</SwipeableViews>
					</div>
				</>
			</div>
		</div>
	);
};

export default CaseStudies;
