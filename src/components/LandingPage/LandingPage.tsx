import Navbar from '@/components/Navbar';
import Hero from '@/components/LandingPage/Hero';
import Services from '@/components/LandingPage/Services';
import WhyUs from '@/components/LandingPage/WhyUs';
import ArtiBot from '@/components/ArtiBot/ArtiBot';
import Contact from '@/components/LandingPage/Contact';
import Footer from '@/components/LandingPage/Footer';
import ScreenLoader from '@/components/LandingPage/ScreenLoader';

export default function LandingPage() {

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
