'use client';

import Navbar from '@/components/Navbar';
import Hero from '@/components/LandingPage/Hero';
import Services from '@/components/LandingPage/Services';
import WhyUs from '@/components/LandingPage/WhyUs';
import ArtiBot from '@/components/ArtiBot/ArtiBot';
import Contact from '@/components/LandingPage/Contact';
import Footer from '@/components/LandingPage/Footer';
import ScreenLoader from '@/components/LandingPage/ScreenLoader';
import {useEffect, useRef} from 'react';
import useAnalyticsClient from '@/hooks/useAnalyticsClient';
import {GTM_EVENT, logEvent} from '@/utils/gtm';

function calculateScrollDepth() {
	const scrollHeight = document.documentElement.scrollHeight;
	const clientHeight = window.innerHeight;
	const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

	const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;
	return Math.round(scrollPercentage);
}

export default function LandingPage() {
	const {clientId} = useAnalyticsClient();
	const timeoutRef = useRef<any>(0);

	useEffect(() => {
		if(!clientId) return;

		// setInterval(() => {
		// 	logEvent({
		// 		event: GTM_EVENT.TIME_SPENT,
		// 		event_category: 'Engagement',
		// 		event_label: 'Webpage Time',
		// 		value: 10,
		// 		client_identifier: clientId,
		// 	})
		// }, 10000) // 10 seconds
	}, [clientId]);

	useEffect(() => {
		if(!clientId) return;

		const handleScroll = () => {
			clearTimeout(timeoutRef.current);

			timeoutRef.current = setTimeout(() => {
				const scrollDepth = calculateScrollDepth();

				if (clientId) {
					logEvent({
						event: GTM_EVENT.SCROLL_DEPTH,
						event_category: 'Engagement',
						event_label: 'Scroll Depth',
						value: scrollDepth,
						client_identifier: clientId,
					});
				}
			}, 1000); // 1 second is the debounce time
		};

		window.addEventListener('scroll', handleScroll);

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, [clientId]);

	return (
		<>
			<ScreenLoader />
			<Navbar />
			<main>
				{/*<Logo />*/}
				<Hero />
				<Services />
				<WhyUs />
				<div id="arti-bot" className="bg-black py-20">
					<div className="landing-page-section px-0 md:px-10">
						<h2 className="text-3xl mb-10 px-10">Try Arti AI for free</h2>
						<ArtiBot miniVersion={true} containerClassName="rounded-xl border-2 border-primary" />
					</div>
				</div>
				<Contact />
				<Footer />
			</main>
		</>
	)
}
