'use client'
import React, {useState} from 'react';
import Logo from '@/components/Logo';
import {colors} from '@/config/theme';
import ReactPlayer from 'react-player';
import {motion, useScroll, useMotionValueEvent} from 'framer-motion';
import {useRouter} from 'next/navigation';
import CTAButton from '@/components/CTAButton';

export default function Hero() {
	const {scrollY} = useScroll();
	const [opacity, setOpacity] = useState(1);
	const router = useRouter()

	useMotionValueEvent(scrollY, "change", (latest) => {
		let val;
		if(latest < 150) val = (150 - latest) / 150;
		else val = 0;
		setOpacity(val);
	})

	return (
		<div className="text-primaryText h-screen flex items-center flex-col mt-40">
			<motion.div style={{opacity: opacity}} className="flex flex-col items-center sticky top-[10rem] h-min">
				<Logo width={60} height={60} fill={colors.primaryText} />
				<p className="text-3xl font-medium text-white font-giasyr">Arti</p>
				<h2 className="text-5xl max-w-3xl text-center leading-tight">Revolutionizing Advertising and Strategy Planning with Artificial Intelligence. Unleash the Power of AI</h2>
				<p className="text-md my-4 opacity-50">Discover the Arti Difference</p>
				{/*<button className="my-4 cta-button" onClick={() => {*/}
				{/*	router.push('#arti-bot')*/}
				{/*}}>Try for Free Now</button>*/}
				<CTAButton onClick={() => router.push('#contact')} className="my-4">
					<span>Try for Free Now</span>
				</CTAButton>
			</motion.div>

			<div className="w-[30em] overflow-hidden rounded-xl aspect-video mt-20 z-20">
				<iframe style={{width: '100%', height: '100%'}}
				        src="https://www.youtube.com/embed/8vNlssOwI-Y">
				</iframe>
			</div>
		</div>
	)
}
