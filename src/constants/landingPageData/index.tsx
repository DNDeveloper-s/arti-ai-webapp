import {FaMagnifyingGlassChart} from 'react-icons/fa6';
import {BsGraphUpArrow} from 'react-icons/bs';
import {GiSelfLove} from 'react-icons/gi';
import {RiCoinsLine} from 'react-icons/ri';
import {
	carouselImage1,
	carouselImage2,
	carouselImage3,
	carouselImage4,
	carouselImage5
} from '@/assets/images/carousel-images';
import adAnalysisImage from '@/assets/images/landing-page/services/ad_analysis.svg';
import adCreationImage from '@/assets/images/landing-page/services/ad_creation.svg';
import socialMediaImage from '@/assets/images/landing-page/services/social_media.svg';
import group1 from '@/assets/images/landing-page/group_1.png';
import group2 from '@/assets/images/landing-page/group_2.png';

import LogoImage from '@/assets/images/Logo.png'
import caseStudies from '@/components/LandingPage/CaseStudies';

export type NumberCard = typeof numbersData.items[0];
export const numbersData = {
	headLine: 'Our Performance in Numbers',
	subHeadLine: 'Significantly improved AD performance for our clients',
	items: [
		{
			id: '1',
			number: {
				value: 4,
				duration: 4
			},
			headLine: 'x',
			subHeadLine: 'cost savings',
			icon: RiCoinsLine,
		},
		{
			id: '2',
			number: {
				value: 5,
				duration: 4
			},
			headLine: 'x',
			subHeadLine: 'more effective lead generation',
			icon: FaMagnifyingGlassChart
		},
		{
			id: '3',
			number: {
				value: 150,
				duration: 2
			},
			headLine: '%',
			subHeadLine: 'increase in website traffic',
			icon: BsGraphUpArrow
		},
		{
			id: '4',
			number: {
				value: 95,
				duration: 2
			},
			headLine: '%',
			subHeadLine: 'of our clients LOVE US',
			icon: GiSelfLove
		},
	]
}

/**
 * @description {This service card type is for main landing page which is meant for the non-technical users}
 */
export type ServiceCard = typeof servicesData.items[0];
/**
 *
 * @description {This services is for the main landing page where the non-technical users will interact}
 */
export const servicesData = {
	headLine: null,
	subHeadLine: null,
	items: [
		{
			id: '1',
			headLine: 'AD Creation',
			description: 'Drive business growth and reach your target audience through highly effective AD creatives. Our AI will craft personalized and attention-catching creatives that captivate user attention.',
			imageSrc: adCreationImage,
			theme: {
				backgroundColor: 'rgba(20,5,0,.92)',
				bgUrl: '/assets/images/landing-page/services/ad_creation_bg.webp',
			}
		},
		{
			id: '2',
			headLine: 'Social Media Management',
			description: 'Harnessing a decade of social media expertise, our team powers AI-driven campaigns that precisely target and captivate your audience. We turn insights into impact, ensuring your message resonates with your audience.',
			imageSrc: socialMediaImage,
			theme: {
				backgroundColor: 'rgba(0,24,21,.92)',
				bgUrl: '/assets/images/landing-page/services/social_media_bg.webp',
			}
		},
		{
			id: '3',
			headLine: 'AD Performance Analysis & Iteration',
			description: 'Watch your ads soar: Our AI meticulously analyzes and iterates, ensuring steadily enhanced results.',
			imageSrc: adAnalysisImage,
			theme: {
				backgroundColor: 'rgba(2,0,24,.92)',
				bgUrl: '/assets/images/landing-page/services/ad_analysis_bg.webp',
			}
		},
	]
}

export type CaseStudyItem = typeof caseStudiesData.items[0];
/**
 *
 * @description {Case Studies data}
 */
export const caseStudiesData = {
	headLine: 'CASE STUDIES',
	subHeadLine: null,
	items: [
		{
			id: '1',
			clientDetails: {
				// logoSrc: LogoImage,
				name: 'Midtown East'
			},
			oneLiner: 'Revitalizing Digital Marketing for Midtown East Physical Therapy',
			image: {
				imageSrc: group1,
			},
			sections: [
				{
					id: 'background_and_challenge',
					headLine: 'Background and Challenge',
					description: 'Midtown East Physical Therapy, a New York-based clinic, excels in offering comprehensive physical therapy services. However, they faced a significant challenge in digital marketing. Their social media campaigns, consisting of lackluster image ads, failed to capture audience attention and generate leads, hindering their online growth.',
					serialOrder: 1
				},
				{
					id: 'objective',
					headLine: 'Objective',
					description: 'Our goal was to transform their digital presence, leveraging advanced marketing technologies to drive engagement and patient acquisition.',
					serialOrder: 2
				},
				{
					id: 'approach_and_solution',
					headLine: 'Approach and Solution',
					description: 'Our team initiated a deep dive into the clinic\'s marketing strategy, employing AI-driven tools for a comprehensive analysis. This included competitor benchmarking and market trends evaluation to identify key areas of improvement. We then harnessed generative AI to design and execute a series of captivating, targeted ads (image and text), each crafted to resonate with the clinic\'s audience. Our approach was not only creative but also data-driven, ensuring each ad was optimized for maximum impact. Below are some of our best performing ADs:',
					serialOrder: 3,
				},
				{
					id: 'outcomes',
					headLine: 'Outcomes',
					description: <div>
						<p>The result were dramatic:</p>
						<ul className="list-disc">
							<li>Reduction in ad volume with a focus on quality, producing 5 high-impact ads compared to the previous 30.</li>
							<li>A surge in engagement, evidenced by an increase from 15 to 450 link clicks.</li>
							<li>A breakthrough in conversions, achieving 12 compared to none previously, within a span of 5 days.</li>
							<li>Cost efficiency was significantly improved, with expenses cut to a third of the previous amount.</li>
						</ul>
					</div>,
					outcomeData: [
						'7x Website Visits',
						'4x Leads',
						'2x Cheaper'
					]
				},
				{
					id: 'client_quote',
					headLine: 'Client Quote',
					description: <div>
						<span>Arti AI can help me grow from <span className="text-primary">80 to 95 patients</span>, and scale my business to medium scale, thank you guys!</span>
					</div>
				},
				{
					id: 'conclusion',
					headLine: 'Conclusion',
					description: 'This case is a testament to the power of intelligent and targeted digital marketing. Through our strategic approach, Midtown East Physical Therapy not only enhanced their online presence but also achieved substantial business growth, marking a new era in their digital journey.'
				},
				{
					id: 'engage_with_us',
					headLine: 'Engage with Us',
					description: 'Are you facing similar challenges in your digital marketing efforts? Connect with us to explore how our cutting-edge solutions can transform your online presence and drive tangible business growth.'
				}
			]
		},
		{
			id: '2',
			clientDetails: {
				// logoSrc: LogoImage,
				name: 'Amplified EMS'
			},
			oneLiner: 'Increase leads generation by 4x through personalized AD creatives and optimizing social media ad delivery for Amplified EMS.',
			image: {
				imageSrc: group2,
			},
			sections: [
				{
					id: 'background_and_challenge',
					headLine: 'Background and Challenge',
					description: 'Midtown East Physical Therapy, a New York-based clinic, excels in offering comprehensive physical therapy services. However, they faced a significant challenge in digital marketing. Their social media campaigns, consisting of lackluster image ads, failed to capture audience attention and generate leads, hindering their online growth.',
					serialOrder: 1
				},
				{
					id: 'objective',
					headLine: 'Objective',
					description: 'Our goal was to transform their digital presence, leveraging advanced marketing technologies to drive engagement and patient acquisition.',
					serialOrder: 2
				},
				{
					id: 'approach_and_solution',
					headLine: 'Approach and Solution',
					description: 'Our team initiated a deep dive into the clinic\'s marketing strategy, employing AI-driven tools for a comprehensive analysis. This included competitor benchmarking and market trends evaluation to identify key areas of improvement. We then harnessed generative AI to design and execute a series of captivating, targeted ads (image and text), each crafted to resonate with the clinic\'s audience. Our approach was not only creative but also data-driven, ensuring each ad was optimized for maximum impact. Below are some of our best performing ADs:',
					serialOrder: 3,
				},
				{
					id: 'outcomes',
					headLine: 'Outcomes',
					description: <div>
						<p>The result were dramatic:</p>
						<ul className="list-disc">
							<li>Reduction in ad volume with a focus on quality, producing 5 high-impact ads compared to the previous 30.</li>
							<li>A surge in engagement, evidenced by an increase from 15 to 450 link clicks.</li>
							<li>A breakthrough in conversions, achieving 12 compared to none previously, within a span of 5 days.</li>
							<li>Cost efficiency was significantly improved, with expenses cut to a third of the previous amount.</li>
						</ul>
					</div>,
					outcomeData: [
						'7x Website Visits',
						'4x Leads',
						'2x Cheaper'
					]
				},
				{
					id: 'client_quote',
					headLine: 'Client Quote',
					description: <div>
						<span>Arti AI can help me grow from <span className="text-primary">80 to 95 patients</span>, and scale my business to medium scale, thank you guys!</span>
					</div>
				},
				{
					id: 'conclusion',
					headLine: 'Conclusion',
					description: 'This case is a testament to the power of intelligent and targeted digital marketing. Through our strategic approach, Midtown East Physical Therapy not only enhanced their online presence but also achieved substantial business growth, marking a new era in their digital journey.'
				},
				{
					id: 'engage_with_us',
					headLine: 'Engage with Us',
					description: 'Are you facing similar challenges in your digital marketing efforts? Connect with us to explore how our cutting-edge solutions can transform your online presence and drive tangible business growth.'
				}
			]
		},

	]
}

/**
 * @description {'Navbar for landing page which is meant for non-technical users'}
 */
export const navbarData = {
	navItems: [
		{
			id: '1',
			href: '/#home',
			label: 'Home'
		},{
			id: '2',
			href: '/#numbers',
			label: 'Numbers'
		},{
			id: '3',
			href: '/#services',
			label: 'Services'
		},{
			id: '4',
			href: '/#case-studies',
			label: 'Case Studies'
		},{
			id: '5',
			href: '/product',
			label: 'Our Product'
		},
	],
	cta: {
		href: '/#contact',
		label: 'Schedule a call for free'
	}
}
