'use client';

import React, {FC, SetStateAction, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {servicesData} from '@/constants/landingPageData/services';
import {ChatGPTMessageObj} from '@/interfaces/IArtiBot';
import useMounted from '@/hooks/useMounted';
import {mockProductOverviewData as mock, screens, ViewScreen} from '@/constants/servicesData';
import {ArtiChatDemo} from '@/components/LandingPage/Services';

interface Props {
	id: number | string;
	title: string;
	description: string;
	style?: any;
	handleIdInView?: (id: Props['id']) => void;
}

const ServiceCard: React.FC<Props> = ({id, title, description, handleIdInView = (id: Props['id']) => {}}) => {
	const [expand, setExpand] = useState(false);

	const nodeRef = useCallback((node: any) => {
		if(node !== null) {
			const observer = new IntersectionObserver(entries => {
				entries.forEach(entry => {
					if(entry.isIntersecting) {
						// console.log('entries - ', entries);
						handleIdInView(id)
						entry.target.classList.add('animate-fadeInUp');
						// observer.unobserve(entry.target);
					} else {
						// entry.target.classList.remove('animate-fadeInUp');
					}
				})
			}, {
				root: null,
				rootMargin: '0px',
				threshold: 0.8
			})
			observer.observe(node);
		}
	}, [])

	return (
		<div className="absolute top-0 left-0 flex flex-col items-center justify-center">
			<div ref={nodeRef} data-id={id}>
				<h1 className="text-[40px] text-white leading-[45px] font-gilroyBold tracking-[-3.15px]">{title}</h1>
				<p className="font-gilroyRegular text-white text-opacity-40 text-[13px]">{description.slice(0, 20)}</p>
			</div>
		</div>
	)
}


export default function Services_Sm() {
	const [idInView, setIdInView] = useState<Props['id']>(0);
	const isMounted = useMounted();
	const [viewScreen, setViewScreen] = useState(ViewScreen.MOBILE);

	function handleIdInView(id: Props['id']) {
		setIdInView(id);
	}

	function handleEnd(setKey: React.Dispatch<SetStateAction<number>>) {
		// console.log('handling end --- ')
		setKey((c: number) => c+1);
	}

	const mockMessages = useMemo(() => {
		return mock.messages.sort((a,b) => a.serialOrder - b.serialOrder);
	}, []);

	const mockAdCreativeMessages = useMemo(() => {
		return mock.adCreativeMessages.sort((a,b) => a.serialOrder - b.serialOrder);
	}, []);

	/**
	 *     width: 446px;
	 *     height: 278.4px;
	 *     top: 84px;
	 *     left: 52px;
	 *     border-radius: 11px 11px 0 0;
	 */

	const handleChangeScreen = useCallback((screen: ViewScreen) => {
		setViewScreen(screen);
	}, []);

	return (
		<div className="landing-page-section relative" id={'product-overview'}>
			<div className="sticky top-0 left-0 w-screen h-screen">
				<div data-groupid={"landing-section"} data-section={"product_overview"} className="relative md:sticky h-screen top-0 flex flex-col gap-3 justify-center items-center">
					{isMounted &&<div className="text-left w-[90vw] h-[80vh] flex items-center justify-center relative">
						<ArtiChatDemo.Chat messages={mockMessages} viewScreen={viewScreen} isInView={true} />
						{/*<ArtiChatDemo.AdCreative messages={mockAdCreativeMessages} viewScreen={viewScreen} isInView={idInView === 2} />*/}
					</div>}
				</div>
				<div className="relative">
					{servicesData.cards.map(serviceItem => <ServiceCard handleIdInView={handleIdInView} key={serviceItem.title} {...serviceItem} />)}
				</div>
			</div>

		</div>
	)
}
