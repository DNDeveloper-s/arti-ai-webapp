'use client'

import React, {FC, useEffect, useMemo, useRef, useState} from 'react';
import TabView from '@/components/ArtiBot/RIghtPane/TabView';
import FeedBackView from '@/components/ArtiBot/RIghtPane/FeedBackView';
import {FiDownload} from 'react-icons/fi';
import {motion} from 'framer-motion';
import {IAdCreative, AdCreativeVariant} from '@/interfaces/IAdCreative';
import FacebookAdVariant from '@/components/ArtiBot/FacebookAdVariant';
import {generateAdCreativeImages, updateVariantImage, useConversation} from '@/context/ConversationContext';
import {useRouter} from 'next/navigation';
import VariantItem from '@/components/ArtiBot/VariantItem';
import {Mock} from '@/constants/servicesData';
import {colors} from '@/config/theme';

interface RightPaneProps {
	adCreative: IAdCreative;
	mock?: Mock;
	style?: React.CSSProperties;
}

const MIN_WIDTH = 450;

const RightPane: FC<RightPaneProps> = ({adCreative, mock = new Mock(), style}) => {
	const [activeVariant, setActiveVariant] = useState<AdCreativeVariant>(adCreative.variants[0]);
	const resizeHandleRef = useRef<HTMLDivElement>(null);
	const resizeContainerRef = useRef<HTMLDivElement>(null);
	const [docUrl, setDocUrl] = useState<string | null>(null);
	const [width, setWidth] = useState(MIN_WIDTH);
	const {state: {inProcess, variant, inError, ...state}, getVariantsByAdCreativeId, dispatch} = useConversation();
	const router = useRouter();
	const ranTheGenerationRef = useRef<boolean>(false);
	const prevVariantListRef = useRef('');
	const intervalIdRef = useRef<any>(null);

	useEffect(() => {
		console.log('mock - ', mock);
		if(!mock.is) return;
		if(intervalIdRef.current) clearInterval(intervalIdRef.current);

		intervalIdRef.current = setInterval(() => {
			setActiveVariant(adCreative.variants[Math.floor(Math.random() * adCreative.variants.length)]);
		}, 10000);

		return () => {
			clearInterval(intervalIdRef.current);
		}
	}, [adCreative.variants, mock, activeVariant])

	useEffect(() => {
		if(!resizeHandleRef.current || !resizeContainerRef.current) return;
		const handleRef = resizeHandleRef.current;

		const MAX_WIDTH = window.innerWidth - 400;
		let isMouseDown = false;
		let initialData = {
			x: 0,
			y: 0,
			width: 0
		}
		const mouseDownHandler = (e: MouseEvent) => {
			if(!resizeContainerRef.current) return;
			isMouseDown = true;
			initialData.x = e.clientX;
			initialData.y = e.clientY;
			initialData.width = resizeContainerRef.current.clientWidth;
		}

		const mouseUpHandler = () => {
			isMouseDown = false;
		}

		const mouseMoveHandler = (e: MouseEvent) => {
			if(isMouseDown) {
				let _width = initialData.width + (initialData.x - e.clientX);
				if(_width < MIN_WIDTH) _width = MIN_WIDTH;
				if(_width > MAX_WIDTH) _width = MAX_WIDTH;
				setWidth(_width);
			}
		}

		handleRef.addEventListener('mousedown', mouseDownHandler)
		addEventListener('mouseup', mouseUpHandler)
		addEventListener('mousemove', mouseMoveHandler)

		return () => {
			removeEventListener('mousemove', mouseMoveHandler)
			removeEventListener('mouseup', mouseUpHandler)
			if(!handleRef) return;
			handleRef.removeEventListener('mousedown', mouseDownHandler)
		}
	}, []);

	const variantList = useMemo(() => {
		if(mock.is) return adCreative.variants;
		const list = getVariantsByAdCreativeId(adCreative.id) || [];
		// const list = [];

		const newVariantListRef = list.map(variant => variant.id).sort((a, b) => {
			if(a > b) return 1;
			if(a < b) return -1;
			return 0;
		}).join(',');

		if(newVariantListRef !== prevVariantListRef.current) ranTheGenerationRef.current = false;

		if(!ranTheGenerationRef.current) {
			console.log('setting active variant');
			setActiveVariant(list[0]);
		}

		prevVariantListRef.current = list.map(variant => variant.id).sort((a, b) => {
			if(a > b) return 1;
			if(a < b) return -1;
			return 0;
		}).join(',');
		return list;
		// const variantIds = adCreative.variants.map(variant => variant.id);
		// return variant.list.filter(c => variantIds.includes(c.id));
	}, [getVariantsByAdCreativeId, adCreative.id, mock.is]);

	useEffect(() => {
		if(mock.is) return;
		variantList.forEach(variant => {
			variant.imageUrl && router.prefetch(variant.imageUrl);
		});
	}, [router, mock.is, variantList]);

	useEffect(() => {

		if(variantList) {
			const hasAtLeastOneVariantToFetch = variantList.some(variant => !variant.imageUrl && variant.imageDescription && (!inProcess || !inProcess[variant.id]) && (!inError || !inError[variant.id]));
			if(!ranTheGenerationRef.current && !inProcess[adCreative.conversationId] && hasAtLeastOneVariantToFetch) {
				ranTheGenerationRef.current = true;
				generateAdCreativeImages(dispatch, adCreative.conversationId);
			}
			ranTheGenerationRef.current = true;
		}
	}, [dispatch, variantList, inProcess, inError, adCreative.conversationId])

	return (
		<div className={'w-[450px] pl-3 right-0 top-0 h-full z-10 flex-shrink-0 relative' + (mock.isMobile ? ' w-full' : '')} style={{width: mock.isMobile ? '100%' : width, ...(style ?? {})}} ref={resizeContainerRef}>
			<div ref={resizeHandleRef} style={{display: mock.is ? 'none' : 'block'}} className="absolute left-0 top-0 h-full w-2 bg-white bg-opacity-20 cursor-col-resize hover:w-2.5 transition-all" onMouseDown={(e) => {
				console.log('e', e, e.currentTarget)
			}} />
			<div className={'pb-10 h-full flex flex-col relative items-center bg-black' + (mock.is ? ' overflow-hidden' : ' overflow-y-auto overflow-x-visible')}>
				<div className="px-4 w-full py-4 flex justify-between items-center">
					<h2 className="text-xl font-medium font-diatype">Ad Creatives</h2>
					{mock.is && <motion.div key={activeVariant.id} initial={{
						backgroundImage: `conic-gradient(${colors.primary} 0deg, transparent 20deg)`
					}} animate={{
						backgroundImage: `conic-gradient(${colors.primary} 360deg, transparent 20deg)`
					}} transition={{
						duration: 10.1
					}} style={{
						width: '20px',
						height: '20px',
						background: colors.secondaryBackground,
						borderRadius: '50%',
						// backgroundImage: `conic-gradient(${colors.primary} 120deg, transparent 20deg)`,
					}} />}
					{docUrl && <motion.a title="Arti AI Generated Ad Creative PDF.pdf" initial={{opacity: 0}} download="Arti AI Generated Ad Creative PDF.pdf" animate={{opacity: 1}} href={docUrl} className="py-2 px-4 rounded-lg text-primaryText border-2 border-primary bg-transparent text-sm flex items-center justify-center">
						<FiDownload/>
						<span className="ml-2">Download as PDF</span>
					</motion.a>}

				{/*	: <motion.button initial={{opacity: 0}} animate={{opacity: 1}} className="py-2 px-4 rounded bg-primary text-sm flex items-center justify-center">*/}
				{/*	<div className="w-5 h-5 relative mr-2">*/}
				{/*		<Lottie animationData={generatingAnimation} loop={true} className="absolute w-7 h-7 top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2" />*/}
				{/*	</div>*/}
				{/*	<span>Generating PDF</span>*/}
				{/*</motion.button>*/}
				</div>
				<TabView items={variantList} activeAdTab={activeVariant} setActiveAdTab={setActiveVariant} />

				<VariantItem mock={mock} activeVariant={activeVariant} width={width} />

			</div>
		</div>
	)
}

export default RightPane;
