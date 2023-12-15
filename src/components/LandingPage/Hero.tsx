'use client'
import React, {useEffect, useState} from 'react';
import Logo from '@/components/Logo';
import {colors} from '@/config/theme';
import {motion, useScroll, useMotionValueEvent} from 'framer-motion';
import {useRouter} from 'next/navigation';
import CTAButton from '@/components/CTAButton';
import {GTM_EVENT, initGTM, logEvent} from '@/utils/gtm';
import Image from 'next/image';
import MobileImage from '@/assets/images/mobile_bg.png';
import MobileTextImage from '@/assets/images/mobile_bg_text.png';

export default function Hero() {
	const {scrollY} = useScroll();
	const [opacity, setOpacity] = useState(1);
	const router = useRouter()

	useEffect(() => {
		initGTM();
	}, [])

	useMotionValueEvent(scrollY, "change", (latest) => {
		let val;
		if(latest < 150) val = (150 - latest) / 150;
		else val = 0;
		setOpacity(val);
	})

	return (
		<div data-groupid="landing-section" data-section="hero" className="relative text-primaryText h-screen flex items-center justify-center flex-col mt-0 md:mt-0">
			<div className="absolute w-full h-full top-0 left-0 flex flex-col justify-center gap-[1.2em] items-center hero-image-container overflow-hidden">
				<div className="flex gap-[1.6rem] image-animation-1">
					<Image src={MobileImage} alt="mobile_image" />
					<Image src={MobileImage} alt="mobile_image" />
				</div>
				<div className="flex gap-[1.6rem] image-animation-2">
					<Image src={MobileTextImage} alt="mobile_image" />
					<Image src={MobileTextImage} alt="mobile_image" />
					<Image src={MobileTextImage} alt="mobile_image" />
				</div>
				<div className="flex gap-[1.6rem] image-animation-3">
					<Image src={MobileImage} alt="mobile_image" />
					<Image src={MobileImage} alt="mobile_image" />
				</div>
			</div>
			<div className="flex flex-col justify-center items-center h-auto bg-transparent backdrop-blur-[2px] px-4 z-10">
				<Logo width={60} height={60} />
				<p className="text-2xl md:text-3xl font-medium text-white font-giasyr">Arti AI</p>
				<h2 className="text-3xl md:text-5xl max-w-3xl text-center leading-9 md:leading-tight">Revolutionizing Advertising and Strategy Planning with Artificial Intelligence. Unleash the Power of AI</h2>
				<p className="text-md my-2 md:my-4 opacity-50">Discover the Arti Difference</p>
				<CTAButton onClick={() => router.push('#arti-bot')} className="my-4">
					<span>Chat for Free Now</span>
				</CTAButton>
			</div>
		</div>
	)
}
