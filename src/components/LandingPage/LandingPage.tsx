'use client';

import Navbar from '@/components/Navbar';
import Hero from '@/components/LandingPage/Hero';
import Services from '@/components/LandingPage/Services';
import WhyUs from '@/components/LandingPage/WhyUs';
import ArtiBot from '@/components/ArtiBot/ArtiBot';
import Contact from '@/components/LandingPage/Contact';
import Footer from '@/components/LandingPage/Footer';
import ScreenLoader from '@/components/LandingPage/ScreenLoader';
import {useEffect, useRef, useState} from 'react';
import useAnalyticsClient from '@/hooks/useAnalyticsClient';
import {GTM_EVENT, logEvent} from '@/utils/gtm';
import BgAttachment from '@/components/LandingPage/BgAttachment';
import TryForFreeButton from '@/components/LandingPage/TryForFreeButton';

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
	const sectionLoggedRef = useRef<Map<string, boolean>>(new Map());
	const [showTryButton, setShowTryButton] = useState<boolean>(true);

	useEffect(() => {
		if(!clientId) return;

		// const handleScroll = () => {
		// 	clearTimeout(timeoutRef.current);
		//
		// 	timeoutRef.current = setTimeout(() => {
		// 		const scrollDepth = calculateScrollDepth();
		//
		// 		if (clientId) {
		// 			logEvent({
		// 				event: GTM_EVENT.SCROLL_DEPTH,
		// 				event_category: 'Engagement',
		// 				event_label: 'Scroll Depth',
		// 				value: scrollDepth,
		// 				client_identifier: clientId,
		// 			});
		// 		}
		// 	}, 1000); // 1 second is the debounce time
		// };
		//
		// window.addEventListener('scroll', handleScroll);
		//
		// return () => {
		// 	window.removeEventListener('scroll', handleScroll);
		// };
		const handleIntersection = (entries, observer) => {
			entries.forEach((entry) => {
				console.log('entry - ', entry);
				if (entry.isIntersecting) {
					const sectionIndex = entry.target.dataset.section;
					console.log(`User scrolled to section ${sectionIndex}`);

					if(sectionIndex === 'hero' || sectionIndex === 'arti_bot') {
						setShowTryButton(false);
					} else {
						setShowTryButton(true);
					}

					const isSectionLogged = sectionLoggedRef.current.get(sectionIndex);
					if(!isSectionLogged) {
						logEvent({
							event: GTM_EVENT.SCROLL_DEPTH,
							event_category: 'Engagement',
							event_label: 'Section Viewed',
							value: sectionIndex,
							client_identifier: clientId,
						});

						sectionLoggedRef.current.set(sectionIndex, true);
					}
					// Log your event or perform any other action here
				}
			});
		};

		const options = {
			root: null,
			rootMargin: '0px',
			threshold: 0.5,
		};

		const observer = new IntersectionObserver(handleIntersection, options);

		const sections = document.querySelectorAll('main [data-groupid="landing-section"]');

		console.log('sections - ', sections);

		sections.forEach((section, index) => {
			observer.observe(section);
		});

		return () => {
			observer.disconnect();
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

				{/*<BgAttachment />*/}
				<div data-groupid={'landing-section'} data-section="arti_bot" id="arti-bot" className="bg-black py-20">
					<div className="landing-page-section px-0 md:px-10">
						<h2 className="text-3xl mb-10 px-10">Try Arti AI for free</h2>
						<ArtiBot miniVersion={true} containerClassName="rounded-xl border-2 border-primary" />
					</div>
				</div>
				<WhyUs />
				<Contact />
				{showTryButton && <TryForFreeButton/>}
				<Footer />
			</main>
		</>
	)
}

// https://www.artiai.org/artibot/ad_creative/656ec68f03b0997ed7c52c06?project_name=Baskin%27%20Coffee
