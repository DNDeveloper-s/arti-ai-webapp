import React, {FC} from 'react';
import ScreenLoader from '@/components/ProductPage/ScreenLoader';
import Navbar from '@/components/LandingPage/Navbar';
import Hero from '@/components/LandingPage/Hero';
import Numbers from '@/components/LandingPage/Numbers';
import Services from '@/components/LandingPage/Services';
import CaseStudies from '@/components/LandingPage/CaseStudies';
import Contact from '@/components/ProductPage/Contact';

interface LandingPageProps {

}

const LandingPage: FC<LandingPageProps> = (props) => {
	return (
		<>
			<ScreenLoader />
			<Navbar />
			<main>
				<Hero />
				<Numbers />
				<Services />
				<CaseStudies />
				<Contact />
			</main>
		</>
	);
};

export default LandingPage;
