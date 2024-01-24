'use client';

import Navbar from '@/components/ProductPage/Navbar';
import Hero from '@/components/ProductPage/Hero';
import Services from '@/components/ProductPage/Services';
import WhyUs from '@/components/ProductPage/WhyUs';
import ArtiBot from '@/components/ArtiBot/ArtiBot';
import Contact from '@/components/ProductPage/Contact';
import Footer from '@/components/ProductPage/Footer';
import ScreenLoader from '@/components/ProductPage/ScreenLoader';
import {useEffect, useRef, useState} from 'react';
import useAnalyticsClient from '@/hooks/useAnalyticsClient';
import {GTM_EVENT, logEvent} from '@/utils/gtm';
import BgAttachment from '@/components/ProductPage/BgAttachment';
import TryForFreeButton from '@/components/ProductPage/TryForFreeButton';
import Testimonials from '@/components/ProductPage/Testimonials';
import {useMediaQuery} from 'react-responsive';
import Services_Sm from '@/components/ProductPage/Services_Sm';
import useMounted from '@/hooks/useMounted';

function calculateScrollDepth() {
	const scrollHeight = document.documentElement.scrollHeight;
	const clientHeight = window.innerHeight;
	const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

	const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;
	return Math.round(scrollPercentage);
}

export default function ProductLandingPage() {
	const {clientId} = useAnalyticsClient();
	const timeoutRef = useRef<any>(0);
	const sectionLoggedRef = useRef<Map<string, boolean>>(new Map());
	const [showTryButton, setShowTryButton] = useState<boolean>(true);
	const [focusedSection, setFocusedSection] = useState<string>('');
	const isSmallScreen = useMediaQuery({query: '(max-width: 500px)'});
	const isMounted = useMounted();

	useEffect(() => {
		if(!clientId) return;

		const handleIntersection = (entries, observer) => {
			entries.forEach((entry) => {
				console.log('entry - ', entry);
				if (entry.isIntersecting) {
					const sectionIndex = entry.target.dataset.section;
					console.log(`User scrolled to section ${sectionIndex}`);
					setFocusedSection(sectionIndex);

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
				{isMounted && isSmallScreen ? <Services_Sm /> : <Services/>}
				<Testimonials />
				{/*<BgAttachment />*/}
				<div data-groupid={'landing-section'} data-section="arti_bot" id="arti-bot" className="bg-black pt-4 pb-10">
					<div className="landing-page-section px-0 md:px-10">
						<h2 className="text-3xl mb-10 px-10 text-center">Try Arti AI for free</h2>
						<ArtiBot borderAnimation={true} miniVersion={true} containerClassName="rounded-xl" />
					</div>
				</div>
				<WhyUs focusedSection={focusedSection} />
				<Contact />
				{showTryButton && <TryForFreeButton/>}
				<Footer />
			</main>
		</>
	)
}

// https://www.artiai.org/artibot/ad_creative/656ec68f03b0997ed7c52c06?project_name=Baskin%27%20Coffee
