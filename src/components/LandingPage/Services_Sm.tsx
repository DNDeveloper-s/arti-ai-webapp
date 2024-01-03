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
	isInView?: boolean;
}

const ServiceCard: React.FC<Props> = ({isInView, id, title, description, handleIdInView = (id: Props['id']) => {}}) => {
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
	}, [handleIdInView, id])

	return (
		<div ref={nodeRef} data-id={id} className="w-screen h-screen bg-red-300 bg-opacity-0" />
	)
}


export default function Services_Sm() {
	const [idInView, setIdInView] = useState<Props['id']>(1);
	const isMounted = useMounted();
	const [viewScreen, setViewScreen] = useState(ViewScreen.MOBILE);

	const handleIdInView = useCallback((id: Props['id']) => {
		setIdInView(id);
	}, [])

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
		<div className="landing-page-section p-0 relative" id={'product-overview'}>
			<div className="sticky top-[80px] left-0 w-screen h-screen">
				<div data-groupid={"landing-section"} data-section={"product_overview"} className="relative md:sticky h-auto md:h-screen md:top-0 flex flex-col gap-3 justify-center items-center">
					{isMounted &&<div className="text-left w-[90vw] h-[70vh] flex items-center justify-center relative">
						<ArtiChatDemo.Chat sm={true} messages={mockMessages} viewScreen={viewScreen} isInView={idInView === 1} />
						<ArtiChatDemo.AdCreative sm={true} messages={mockAdCreativeMessages} viewScreen={viewScreen} isInView={idInView === 2} />
						<ArtiChatDemo.Metrics sm={true} messages={mockAdCreativeMessages} viewScreen={viewScreen} isInView={idInView === 3} />
					</div>}
				</div>
				<div className="relative mt-6">
					{/*{servicesData.cards.map(serviceItem => <ServiceCard handleIdInView={handleIdInView} isInView={idInView === serviceItem.id} key={serviceItem.title} {...serviceItem} />)}*/}
					{servicesData.cards.map(serviceItem => (
						<div key={serviceItem.title} className="absolute top-0 left-1/2 transform -translate-x-1/2 flex flex-col items-center justify-center" style={{opacity: idInView === serviceItem.id ? 1 : 0}}>
							<div>
								<h1 className="text-[30px] whitespace-nowrap text-white leading-[32px] font-diatype font-bold tracking-[-1.15px]">{serviceItem.title}</h1>
								<p className="font-gilroyRegular text-white text-opacity-40 text-[13px]">{serviceItem.description.slice(0, 50)}</p>
							</div>
						</div>
					))}
				</div>
			</div>
			{servicesData.cards.map(serviceItem => <ServiceCard handleIdInView={handleIdInView} isInView={idInView === serviceItem.id} key={serviceItem.title} {...serviceItem} />)}
			<div className="w-screen h-screen bg-red-300 bg-opacity-0" />
		</div>
	)
}
