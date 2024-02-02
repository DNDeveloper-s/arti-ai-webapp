'use client';
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
import Typist from 'react-typist-component';
import type { RenderPhotoProps } from "react-photo-album";
import PhotoAlbum from 'react-photo-album';

const breakpoints = [1080, 640, 384, 256, 128, 96, 64, 48];

const unsplashLink = (id: string, width: number, height: number) =>
	`https://source.unsplash.com/${id}/${width}x${height}`;

const carouselPhotos = [
	{id: "1", image: '/assets/images/carousel-images/1.png', width: 1080, height: 1080},
	{id: "2", image: '/assets/images/carousel-images/2.png', width: 1080, height: 1080},
	{id: "3", image: '/assets/images/carousel-images/3.png', width: 1080, height: 1080},
	{id: "4", image: '/assets/images/carousel-images/4.png', width: 1080, height: 1080},
	{id: "5", image: '/assets/images/carousel-images/5.png', width: 1080, height: 1080},
	{id: "6", image: '/assets/images/carousel-images/6.png', width: 1080, height: 1080},
	{id: "7", image: '/assets/images/carousel-images/4.png', width: 1080, height: 1080},
	{id: "8", image: '/assets/images/carousel-images/1.png', width: 1080, height: 1080},
	{id: "9", image: '/assets/images/carousel-images/2.png', width: 1080, height: 1080},
	{id: "10", image: '/assets/images/carousel-images/3.png', width: 1080, height: 1080},
	{id: "11", image: '/assets/images/carousel-images/2.png', width: 1080, height: 1080},
	{id: "12", image: '/assets/images/carousel-images/3.png', width: 1080, height: 1080},
	{id: "13", image: '/assets/images/carousel-images/6.png', width: 1080, height: 1080},
	{id: "14", image: '/assets/images/carousel-images/5.png', width: 1080, height: 1080},
	{id: "15", image: '/assets/images/carousel-images/1.png', width: 1080, height: 1080},
	{id: "16", image: '/assets/images/carousel-images/4.png', width: 1080, height: 1080},
	{id: "17", image: '/assets/images/carousel-images/1.png', width: 1080, height: 1080},
	{id: "18", image: '/assets/images/carousel-images/2.png', width: 1080, height: 1080},
	{id: "19", image: '/assets/images/carousel-images/3.png', width: 1080, height: 1080},
	{id: "20", image: '/assets/images/carousel-images/5.png', width: 1080, height: 1080},
]

const unsplashPhotos = [
	{ id: "8gVv6nxq6gY", width: 1080, height: 800 },
	{ id: "Dhmn6ete6g8", width: 1080, height: 1620 },
	{ id: "RkBTPqPEGDo", width: 1080, height: 720 },
	{ id: "Yizrl9N_eDA", width: 1080, height: 721 },
	{ id: "KG3TyFi0iTU", width: 1080, height: 1620 },
	{ id: "Jztmx9yqjBw", width: 1080, height: 607 },
	{ id: "-heLWtuAN3c", width: 1080, height: 608 },
	{ id: "xOigCUcFdA8", width: 1080, height: 720 },
	{ id: "1azAjl8FTnU", width: 1080, height: 1549 },
	{ id: "ALrCdq-ui_Q", width: 1080, height: 720 },
	{ id: "twukN12EN7c", width: 1080, height: 694 },
	{ id: "9UjEyzA6pP4", width: 1080, height: 1620 },
	{ id: "sEXGgun3ZiE", width: 1080, height: 720 },
	{ id: "S-cdwrx-YuQ", width: 1080, height: 1440 },
	{ id: "q-motCAvPBM", width: 1080, height: 1620 },
	{ id: "Xn4L310ztMU", width: 1080, height: 810 },
	{ id: "iMchCC-3_fE", width: 1080, height: 610 },
	{ id: "X48pUOPKf7A", width: 1080, height: 160 },
	{ id: "GbLS6YVXj0U", width: 1080, height: 810 },
	{ id: "9CRd1J1rEOM", width: 1080, height: 720 },
	{ id: "xKhtkhc9HbQ", width: 1080, height: 1440 },
];

const _photos = unsplashPhotos.map((photo) => ({
	src: unsplashLink(photo.id, photo.width, photo.height),
	width: photo.width,
	height: photo.height,
	srcSet: breakpoints.map((breakpoint) => {
		const height = Math.round((photo.height / photo.width) * breakpoint);
		return {
			src: unsplashLink(photo.id, breakpoint, height),
			width: breakpoint,
			height,
		};
	}),
}));

const photos = carouselPhotos.map((photo) => ({
	src: photo.image,
	width: photo.width,
	height: photo.height,
	srcSet: breakpoints.map((breakpoint) => {
		const height = Math.round((photo.height / photo.width) * breakpoint);
		return {
			src: photo.image,
			width: breakpoint,
			height,
		};
	}),
}));

function NextJsImage({photo, imageProps: { alt, title, sizes, className, onClick }, wrapperStyle}: RenderPhotoProps) {
	return (
		<div style={{ ...wrapperStyle, position: "relative" }}>
			<Image
				fill
				src={photo}
				placeholder={"blurDataURL" in photo ? "blur" : undefined}
				{...{ alt, title, sizes, className, onClick }}
			/>
		</div>
	);
}

export default function Hero() {
	const {scrollY} = useScroll();
	const [opacity, setOpacity] = useState(1);
	const router = useRouter();
	const [typistKey, setTypistKey] = useState(0);

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
		<div id={'#home'} data-groupid="landing-section" data-section="hero" className="relative text-primaryText h-screen flex items-center justify-center flex-col mt-0 md:mt-0">
			<div className="absolute w-full h-full top-0 left-0 flex flex-col justify-center gap-[1.2em] items-center hero-image-container overflow-hidden">
				{/*<div className="flex gap-[1.6rem] image-animation-sm-1 md:image-animation-1">*/}
				{/*	<Image src={MobileImage} className="h-[200px] md:h-auto max-w-none w-auto md:w-full" alt="mobile_image" />*/}
				{/*	<Image src={MobileImage} className="h-[200px] md:h-auto max-w-none w-auto md:w-full" alt="mobile_image" />*/}
				{/*</div>*/}
				{/*<div className="flex gap-[1.6rem] image-animation-sm-2 md:image-animation-2">*/}
				{/*	<Image src={MobileImage} className="h-[200px] md:h-auto max-w-none w-auto md:w-full" alt="mobile_image" />*/}
				{/*	<Image src={MobileImage} className="h-[200px] md:h-auto max-w-none w-auto md:w-full" alt="mobile_image" />*/}
				{/*	<Image src={MobileImage} className="h-[200px] md:h-auto max-w-none w-auto md:w-full" alt="mobile_image" />*/}
				{/*</div>*/}
				{/*<div className="flex gap-[1.6rem] image-animation-sm-3 md:image-animation-3">*/}
				{/*	<Image src={MobileImage} className="h-[200px] md:h-auto max-w-none w-auto md:w-full" alt="mobile_image" />*/}
				{/*	<Image src={MobileImage} className="h-[200px] md:h-auto max-w-none w-auto md:w-full" alt="mobile_image" />*/}
				{/*</div>*/}
				<div className='w-full h-full'>
					<PhotoAlbum
						layout="rows"
						photos={photos}
						renderPhoto={NextJsImage}
						defaultContainerWidth={1200}
						sizes={{ size: "calc(100vw - 240px)" }}
					/>
				</div>
			</div>
			<div className="flex flex-col justify-center items-center h-auto bg-transparent backdrop-blur-[2px] px-4 z-10">
				<Logo width={60} height={60} />
				<p className="text-2xl md:text-3xl font-medium text-white font-giasyr">Arti AI</p>
				<h2 className="text-3xl md:text-5xl max-w-3xl text-center leading-9 md:leading-tight">
					{/*<span className="text-primary font-medium">Crafting, Running, and Refining</span>*/}
					<Typist
						startDelay={0}
						cursor={<span style={{color: 'white'}}>|</span>}
						// cursor={{
						// 	show: false,
						// 	blink: false,
						// 	element: "|",
						// 	hideWhenDone: true,
						// 	hideWhenDoneDelay: 500,
						// }}
						typingDelay={100}
						loop={true}
						key={typistKey}
						onTypingDone={() => setTypistKey(c => c >= 3 ? 1 : c + 1)}
					>
						{[{text: "Crafting", color: colors.primary},
							{text: "Running", color: colors.primary},
							{text: "Refining", color: colors.primary},
						].map(({text: word, color}) => [
							<span key={word} style={{color}} className={'font-medium ' + word}>{word}</span>,
							<Typist.Delay key={word} ms={2000} />,
							<Typist.Backspace key={word} count={word.length}/>,
						])}
					</Typist>
				</h2>
				<h2 className="text-3xl md:text-5xl max-w-3xl text-center leading-9 md:leading-tight">Your Ads for Peak Performance.</h2>
				<p className="text-md my-2 md:my-4 opacity-50">Discover the Arti Difference</p>
				<CTAButton onClick={() => router.push('#contact')} className="my-4">
					<span>Try it free for 2 weeks</span>
				</CTAButton>
			</div>
		</div>
	)
}
