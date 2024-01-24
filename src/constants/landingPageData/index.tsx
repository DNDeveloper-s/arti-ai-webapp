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
import LogoImage from '@/assets/images/Logo.png'
import caseStudies from '@/components/LandingPage/CaseStudies';

export type NumberCard = typeof numbersData.items[0];
export const numbersData = {
	headLine: 'Our Performance in Numbers',
	subHeadLine: 'Significantly improved AD performance for our clients',
	items: [
		{
			id: '1',
			headLine: '4x cost savings',
			subHeadLine: '',
			icon: RiCoinsLine
		},
		{
			id: '2',
			headLine: '5x more effective lead generation',
			subHeadLine: '',
			icon:FaMagnifyingGlassChart
		},
		{
			id: '3',
			headLine: '150% increase in website traffic',
			subHeadLine: '',
			icon: BsGraphUpArrow
		},
		{
			id: '4',
			headLine: '95% of our clients LOVE US',
			subHeadLine: '',
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
			imageSrc: carouselImage3,
		},
		{
			id: '2',
			headLine: 'Social Media Management',
			description: 'Harnessing a decade of social media expertise, our team powers AI-driven campaigns that precisely target and captivate your audience. We turn insights into impact, ensuring your message resonates with your audience.',
			imageSrc: carouselImage2
		},
		{
			id: '2',
			headLine: 'AD Performance Analysis & Iteration',
			description: 'Watch your ads soar: Our AI meticulously analyzes and iterates, ensuring steadily enhanced results.',
			imageSrc: carouselImage1
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
			images: [
				{id: 'image-1', imageSrc: carouselImage1, label: 'Before'},
				{id: 'image-2', imageSrc: carouselImage2, label: 'After'}
			],
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
			images: [
				{id: 'image-1', imageSrc: carouselImage3, label: 'Before'},
				{id: 'image-2', imageSrc: carouselImage4, label: 'After'}
			],
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
