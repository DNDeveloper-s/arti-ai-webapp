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
import amplifiedLogo from '@/assets/images/case-study/amplified/logo.jpg';
import amplifiedAdCreative from '@/assets/images/case-study/amplified/raw_1.jpeg';
import midtownEastAdCreative from '@/assets/images/case-study/midtowneast/raw_1.png';
import antAdCreative from '@/assets/images/case-study/ant/raw_1.png';
import Image, {StaticImageData} from 'next/image';

// Preview Image
import amplifiedPreviewImage from '@/assets/images/case-study/amplified/preview_images.png';
import midtownEastPreviewImage from '@/assets/images/case-study/midtowneast/preview_images.png';
import antPreviewImage from '@/assets/images/case-study/ant/preview_images.png';

// Raw Images
import amplifiedRawImage1 from '@/assets/images/case-study/amplified/raw_1.jpeg';
import amplifiedRawImage2 from '@/assets/images/case-study/amplified/raw_2.png';
import amplifiedRawImage3 from '@/assets/images/case-study/amplified/raw_3.jpeg';

import midtownEastRawImage1 from '@/assets/images/case-study/midtowneast/raw_1.png';
import midtownEastRawImage2 from '@/assets/images/case-study/midtowneast/raw_2.png';
import midtownEastRawImage3 from '@/assets/images/case-study/midtowneast/raw_3.png';

import antRawImage1 from '@/assets/images/case-study/ant/raw_1.png';
import antSideImage from '@/assets/images/case-study/ant/side.png';
import React from 'react';
import {FacebookAdPreview} from '@/components/LandingPage/AdPreview';

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
				value: 100,
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


export interface BrandVariant {
	id: string;
	image: StaticImageData;
	description: string;
	oneLiner: string;
}

export interface Brand {
	logo: StaticImageData;
	adCreative: StaticImageData;
	variant: BrandVariant[];
	label: string;
	offer: string;
	offerDescription: string;
	subOffer?: string;
	cta: string;
}


/**
 * @description {'Brands for case study section in the landing page'}
 */
export const brands: Record<'amplified' | 'midTownEast' | 'ant', Brand> = {
	amplified: {
		logo: amplifiedLogo,
		adCreative: amplifiedAdCreative,
		label: 'AmplifiedEMS',
		offer: 'Claim Your FREE Week!',
		variant: [
			{id: '1', image: amplifiedRawImage1, description: 'Don\'t let back pain keep you on the sidelines. Our expert physical therapists empower you to lift the burden of discomfort. With personalized care and cutting-edge techniques, we\'ll help you strengthen your back, improve flexibility, and reclaim your active lifestyle. Take control and elevate your well-being—start your journey to a stronger back today!', oneLiner: 'Say Goodbye to Back Pain'},
			{id: '2', image: amplifiedRawImage2, description: 'Visualize the best version of yourself with just 20 minutes a week using our state-of-the-art EMS technology! We harness the power of electrical muscle stimulation to maximize your workouts, sculpting your physique efficiently and effectively. Say goodbye to endless hours at the gym and hello to rapid, visible results. Join the fitness revolution and experience the transformation with us – your journey to a fitter, stronger you awaits!', oneLiner: 'Unlock Your Potential: Transform with EMS Fitness!'},
			{id: '3', image: amplifiedRawImage3, description: 'This included competitor benchmarking and market trends evaluation to identify key areas of improvement. We then harnessed generative AI to design and execute a series of captivating, targeted ads (image and text), each crafted to resonate with the clinic\'s audience.', oneLiner: 'Revitalizing Digital Marketing for Midtown East Physical Therapy'}
		],
		offerDescription: 'New Year, New You! 🎉 Kickstart your fitness journey with our exclusive FREE WEEK TRIAL! Embrace a healthier, stronger version of yourself in 2024.',
		subOffer: 'Reach your goals faster!',
		cta: 'Get Offer',
	},
	midTownEast: {
		logo: amplifiedLogo,
		adCreative: midtownEastAdCreative,
		variant: [
			{id: '1', image: midtownEastRawImage3, description: 'Don\'t let back pain keep you on the sidelines. Our expert physical therapists empower you to lift the burden of discomfort. With personalized care and cutting-edge techniques, we\'ll help you strengthen your back, improve flexibility, and reclaim your active lifestyle. Take control and elevate your well-being—start your journey to a stronger back today!', oneLiner: 'Say Goodbye to Back Pain'},
			{id: '2', image: midtownEastRawImage1, description: 'Bid farewell to knee pain with expert physical therapy services. Our tailored programs are designed to strengthen, heal, and enhance mobility. Embrace a life of movement and comfort—book your consultation today and take the first step towards a pain-free tomorrow!', oneLiner: 'Sign up Today!'},
			{id: '3', image: midtownEastRawImage2, description: 'This included competitor benchmarking and market trends evaluation to identify key areas of improvement. We then harnessed generative AI to design and execute a series of captivating, targeted ads (image and text), each crafted to resonate with the clinic\'s audience.', oneLiner: 'Revitalizing Digital Marketing for Midtown East Physical Therapy'}
		],
		label: 'Midtown East',
		offer: 'Claim Your FREE Week!',
		offerDescription: 'New Year, New You! 🎉 Kickstart your fitness journey with our exclusive FREE WEEK TRIAL! Embrace a healthier, stronger version of yourself in 2024.',
		subOffer: 'Reach your goals faster!',
		cta: 'Get Offer',
	},
	ant: {
		logo: amplifiedLogo,
		adCreative: antAdCreative,
		label: 'AnT - A Streetwear Revolution',
		offer: 'Claim Your FREE Week!',
		offerDescription: 'In the ever-evolving landscape of streetwear fashion, AnT stands as a beacon for the young and the bold. Our brand is a celebration of the individual, a tribute to the unique. We are the future of fashion.',
		subOffer: 'Reach your goals faster!',
		cta: 'Get Offer',
		variant: []
	},
}


export type CaseStudyItem = typeof caseStudiesData.items[0];
export enum CaseStudy {
	'MIDTOWN_EAST'= 'midtown-east',
	'AMPLIFIED_EMS' = 'amplified-ems',
	'ANT_STREET_WEAR' = 'ant-streetwear'
}
/**
 *
 * @description {Case Studies data}
 */
export const caseStudiesData = {
	headLine: 'CASE STUDIES',
	subHeadLine: null,
	items: [
		{
			id: CaseStudy.MIDTOWN_EAST,
			clientDetails: {
				// logoSrc: LogoImage,
				name: 'Midtown East',
			},
			brief: {
				client_name: 'Revitalizing Digital Marketing for Midtown East Physical Therapy',
				oneLiner: <span>
					After a year of unsuccessful advertising, Midtown East Physical Therapy experienced a <span className={'text-primary'}>10x surge</span> in website traffic and gained <span className="text-primary">20+ leads in 2 weeks</span>, thanks to our tailored ad strategy.
				</span>,
			},
			oneLiner: 'Revitalizing Digital Marketing for Midtown East Physical Therapy',
			images: {
				preview_image: midtownEastPreviewImage,
				raw: [
					midtownEastRawImage1,
					midtownEastRawImage2
				]
			},
			service_info: [
				{id: '1', title: 'Service and Offer', items: ['AD Creation', 'Social Media Management', 'AD Analytics']},
				{id: '2', title: 'Sector', items: ['Physical Therapy']},
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
			],
			outcomes: {
				headLine: 'Outcomes',
				description: <div className="text-gray-400 text-lg mt-5 leading-7">
					<p>The result were dramatic:</p>
					<ul className="flex flex-col list-disc list-outside px-6 gap-2 mt-4">
						<li>Reduction in ad volume with a focus on quality, producing <strong className="text-white">5 high-impact ads</strong> compared to the previous 30.</li>
						<li>A surge in engagement, evidenced by an increase from <strong className="text-white">15 to 450 link clicks</strong>.</li>
						<li>A breakthrough in conversions, achieving <strong className="text-white">12 compared to none</strong> previously, within a span of 5 days.</li>
						<li>Cost efficiency was significantly improved, with expenses cut to a <strong className="text-white">third of the previous amount</strong>.</li>
					</ul>
				</div>,
				outcomeData: [
					{label: 'Website Visits', number: {value: 7, duration: 2, from: 0, postString: 'x'}},
					{label: 'Leads', number: {value: 4, duration: 2, from: 0, postString: 'x'}},
					{label: 'Cheaper', number: {value: 2, duration: 2, from: 0, postString: 'x'}, decrease: true},
				]
			},
			clientQuote: {
				headLine: 'Client Quote',
				description: <span>"Arti AI can help me grow from <span className="text-primary">80 to 95 patients</span>, and scale my business to medium scale, thank you guys!"</span>,
				author: 'Greg, Midtown East Co-Owner',
			},
			lowerSections: [
				{
					id: 'conclusion',
					headLine: 'Conclusion',
					description: 'This case is a testament to the power of intelligent and targeted digital marketing. Through our strategic approach, Midtown East Physical Therapy not only enhanced their online presence but also achieved substantial business growth, marking a new era in their digital journey.',
					serialOrder: 2,
				},
				{
					id: 'engage_with_us',
					headLine: 'Engage with Us',
					description: 'Are you facing similar challenges in your digital marketing efforts? Connect with us to explore how our cutting-edge solutions can transform your online presence and drive tangible business growth.',
					containsCta: true,
					serialOrder: 1,
				}
			],
			previews: [
				{id: '1', el: <div key={'1'} className={'w-[320px] flex-shrink-0'}>
						<FacebookAdPreview variant={brands.midTownEast.variant[0]} />
					</div>},
				{id: '2', el: <div key={'2'} className={'w-[320px] flex-shrink-0'}>
						<FacebookAdPreview variant={brands.midTownEast.variant[1]} />
					</div>},
				{id: '3', el: <div key={'3'} className={'w-[320px] flex-shrink-0'}>
						<FacebookAdPreview variant={brands.midTownEast.variant[2]} />
					</div>}
			]
		},
		{
			id: CaseStudy.AMPLIFIED_EMS,
			clientDetails: {
				// logoSrc: LogoImage,
				name: 'Amplified EMS',
			},
			brief: {
				client_name: 'Amplifying online presence for Next-gen Amplified EMS gym',
				oneLiner: <span>
					Our refined advertising approach, focusing on clear messaging and targeted audiences, yielded <span className="text-primary">2x leads at 4x less cost</span> compared to traditional gym advertising techniques.
				</span>,
			},
			oneLiner: 'Marketing Recharged: The Amplified EMS Success Story in Digital Engagement',
			images: {
				preview_image: amplifiedPreviewImage,
				raw: [
					amplifiedRawImage1,
					amplifiedRawImage2
				]
			},
			service_info: [
				{id: '1', title: 'Service and Offer', items: ['Market research', 'Strategy Planning', 'AD creation', 'Social Media Management', 'AD Analytics']},
				{id: '2', title: 'Sector', items: ['Gym']},
			],
			sections: [
				{
					id: 'background_and_challenge',
					headLine: 'Background and Challenge',
					description: 'Amplified EMS, a pioneering company in the Electric Muscle Stimulation (EMS) industry, encountered significant hurdles in lead generation and client acquisition. Their previous advertising strategy, primarily reliant on Facebook, employed substandard images of their facility without informative text. This approach failed to engage potential clients, as the ads blended into the background of users\' news feeds due to their uninspiring nature and lack of informative content.',
					serialOrder: 1
				},
				{
					id: 'objective',
					headLine: 'Objective',
					description: 'Our primary objective was to elevate Amplified EMS\'s digital marketing strategy. The focus was on increasing awareness about the unique benefits of EMS, especially its efficiency compared to traditional gym workouts, and to drive client engagement and lead generation more effectively.',
					serialOrder: 2
				},
				{
					id: 'approach_and_solution',
					headLine: 'Approach and Solution',
					description: <>
						<p>
							We leveraged our generative AI tools to conduct an in-depth analysis of EMS services, focusing on understanding and communicating its unique benefits. Our research indicated that EMS could deliver the same results as an 8-hour traditional gym session in just 20 minutes – a compelling advantage for potential clients.
						</p>
						<p>
							Building on this, we crafted visually striking and informative ads. Each ad was designed to capture attention and educate the audience about EMS's benefits, ensuring a high level of engagement. By incorporating both visual appeal and informational content, our ads stood out in the cluttered social media landscape.
						</p>
					</>,
					serialOrder: 3,
				},
			],
			outcomes: {
				headLine: 'Outcomes',
				description: <div className="text-gray-400 text-lg mt-5 leading-7">
					<p>The results of our revamped digital marketing strategy were significant:</p>
					<ul className="flex flex-col list-disc list-outside px-6 gap-2 mt-4">
						<li><span className={'font-bold'}>Increased Lead Generation:</span> We achieved a <span className={'text-primary'}>2x increase in leads</span> compared to the results from the previous ad agency.</li>
						<li><span className={'font-bold'}>Cost Efficiency:</span> Our campaign was executed at 1/4 the cost of the previous agency's efforts.
						</li>
						<li><span className={'font-bold'}>Rapid Execution:</span> The entire campaign was rolled out within a few days, in contrast to the weeks taken by the previous agency.</li>
						<li><span className={'font-bold'}>Enhanced Client Satisfaction:</span> Our prompt response to client queries marked a stark improvement from the previous agency's delayed communication, greatly increasing client satisfaction.</li>
					</ul>
				</div>,
				outcomeData: [
					{label: 'Leads', number: {value: 4, duration: 2, from: 0, postString: 'x'}},
					{label: 'Cheaper', number: {value: 25, duration: 2, from: 0, postString: '%'}, decrease: true},
				]
			},
			clientQuote: null,
			// clientQuote: {
			// 	headLine: 'Client Quote',
			// 	description: <span>Arti AI can help me grow from <span className="text-primary">80 to 95 patients</span>, and scale my business to medium scale, thank you guys!</span>,
			// 	author: 'Greg, Midtown East Co-Owner',
			// },
			lowerSections: [
				{
					id: 'conclusion',
					headLine: 'Conclusion',
					description: 'This case study exemplifies the transformative impact of a well-strategized and executed digital marketing campaign. By focusing on the unique benefits of Amplified EMS\'s services and employing a blend of visual and informational content, we significantly enhanced their online presence and lead generation capabilities, setting a new benchmark in digital marketing efficiency and effectiveness',
					serialOrder: 2,
				},
				{
					id: 'engage_with_us',
					headLine: 'Engage with Us',
					description: 'Struggling with digital marketing for your innovative services? Connect with us to discover how our tailored, AI-driven marketing solutions can revolutionize your online presence and drive your business growth.',
					containsCta: true,
					serialOrder: 1,
				}
			],
			previews: [
				{id: '1', el: <div key={'1'} className={'w-[320px] flex-shrink-0'}>
						<FacebookAdPreview variant={brands.amplified.variant[0]} />
					</div>},
				{id: '2', el: <div key={'2'} className={'w-[320px] flex-shrink-0'}>
						<FacebookAdPreview variant={brands.amplified.variant[1]} />
					</div>},
				{id: '3', el: <div key={'3'} className={'w-[320px] flex-shrink-0'}>
						<FacebookAdPreview variant={brands.amplified.variant[2]} />
					</div>}
			]
		},
		{
			id: CaseStudy.ANT_STREET_WEAR,
			clientDetails: {
				// logoSrc: LogoImage,
				name: 'AnT - A Streetwear Revolution',
			},
			brief: {
				client_name: 'AD Revolution for an upcoming, novel streetwear brand - AnT',
				oneLiner: <span>
					Revolutionizing streetwear marketing, our innovative campaign <span className="text-primary font-bold">doubled returns</span> while <span className="text-primary font-bold">reducing costs by 25%</span>, capturing the essence of youth culture for the digital era.
				</span>,
			},
			oneLiner: 'AD Revolution for an upcoming, novel streetwear brand - AnT',
			images: {
				preview_image: antPreviewImage,
				raw: [
					// antRawImage1,
				],
				main_image: [
					antRawImage1
				]
			},
			service_info: [
				{id: '1', title: 'Service and Offer', items: ['AD creation', 'Social Media Management', 'AD Analytics', 'Strategy Planning']},
				{id: '2', title: 'Sector', items: ['Fashion']},
			],
			sections: [
				{
					id: 'introduction',
					headLine: 'Introduction',
					description: 'In the ever-evolving landscape of streetwear fashion, AnT stands as a beacon for the young and the bold. With a pulse on contemporary culture and a flair for the unconventional, AnT approached us to amplify their digital presence and connect with the spirited youth.',
					serialOrder: 1
				},
				{
					id: 'challenge',
					headLine: 'Challenge',
					description: 'The challenge was twofold: to resonate with a discerning audience that values authenticity and to navigate the competitive world of fashion e-commerce with a limited budget.',
					serialOrder: 2
				},
				{
					id: 'strategy',
					headLine: 'Strategy',
					description: 'Our strategy was a blend of cultural insight and digital prowess. We crafted a campaign that spoke the language of the streets - raw, real, and relatable. Leveraging social media platforms popular among young adults, we created visually striking and emotionally engaging content that echoed the brand\'s ethos.',
					serialOrder: 3
				},
				{
					id: 'execution',
					headLine: 'Execution',
					description: 'The execution involved a series of targeted ads, influencer collaborations, and interactive social media campaigns. We focused on highlighting the brand\'s unique identity through storytelling, tapping into the lifestyle and aspirations of our audience.',
					serialOrder: 4,
					sideContent: <div className="overflow-hidden">
						<Image className={'h-full w-full object-contain'} src={antSideImage} alt={'AnT side image'} />
					</div>
				},
			],
			outcomes: {
				headLine: 'Outcomes',
				description: <div className="text-gray-400 text-lg mt-5 leading-7">
					<p>The results of our revamped digital marketing strategy were significant:</p>
					<ul className="flex flex-col list-disc list-outside px-6 gap-2 mt-4">
						<li><span className={'font-bold text-white'}>Return on Ad Spend:</span> Achieved a <span className="text-primary font-bold">2x return</span>, effectively doubling the brand's investment.</li>
						<li><span className={'font-bold text-white'}>Cost Efficiency:</span> Managed to <span className="text-primary font-bold">reduce costs to 0.75x</span>, maximizing the impact while minimizing expenses.</li>
						<li><span className={'font-bold text-white'}>Brand Engagement:</span> Significantly increased engagement rates, with notable growth in social media followers and interactions.</li>
					</ul>
				</div>,
				outcomeData: [
					{label: 'Returns', number: {value: 2, duration: 2, from: 0, postString: 'x'}},
					{label: 'Cheaper', number: {value: 75, duration: 2, from: 0, postString: '%'}, decrease: true},
				]
			},
			// clientQuote: null,
			clientQuote: {
				headLine: 'Client Quote',
				description: <span>"AnT has always been about breaking boundaries, and with Arti AI's innovative approach, we've not only reached our audience but also sparked a movement. Their strategy was a game-changer for us."</span>,
				author: 'Michael, AnT Co-Founder',
			},
			lowerSections: [
				{
					id: 'conclusion',
					headLine: 'Conclusion',
					description: 'This collaboration is more than a case study; it\'s a testament to the power of understanding your audience and delivering content that resonates. [Your Brand Name] is not just selling clothes; they\'re selling a culture, and we\'re proud to have played a part in their journey.',
					serialOrder: 2,
				},
				{
					id: 'engage_with_us',
					headLine: 'Engage with Us',
					description: 'Ready to redefine your brand\'s digital narrative? Contact us and let\'s create a revolution together.',
					containsCta: true,
					serialOrder: 1,
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
