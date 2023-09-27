'use client';

import React, {useState} from 'react';
import Image, {StaticImageData} from 'next/image';
import Dummy from '@/assets/images/dummy.webp';
import {servicesData} from '@/constants/landingPageData/services';
import {motion} from 'framer-motion';

interface Props {
	imageSrc: StaticImageData;
	title: string;
	description: string;
	learnMore: string;
	style?: any;
}
const ServiceCard: React.FC<Props> = ({imageSrc, title, description, learnMore, style = {} }) => {
	const [expand, setExpand] = useState(false);

	return (
		<div className={"relative shadow shadow-blueGray-800 rounded-md md:rounded-lg flex min-h-[20rem] md:min-h-[30rem] h-auto flex-col overflow-hidden bg-opacity-20 bg-secondaryText"} style={style}>
			<div className="absolute h-full w-full overflow-hidden rounded-lg">
				<Image src={imageSrc} className="object-cover w-full h-full" alt={'Service'} />
			</div>
			<div className="absolute bottom-0 h-full w-full bg-[linear-gradient(178deg,_rgba(0,0,0,0.00)_1.54%,_#0C0C0C_87.27%)]" />
			<div className="z-20 h-full min-h-[10rem] md:min-h-[20rem]" />
			<div className="px-4 md:px-6 py-3 md:py-4 w-full z-10">
				<h2 className="font-bold text-lg md:text-xl mb-1 md:mb-2 font-diatype">{title}</h2>
				<p className="font-diatype text-sm md:text-base opacity-80 leading-[1.5em]">{description}</p>
				<motion.div animate={{height: expand ? 'auto' : 0, marginTop: expand ? '20px' : 0}} className="mt-4 overflow-hidden">
					<p className="font-diatype text-sm md:text-base opacity-80 leading-[1.5em]">{learnMore}</p>
				</motion.div>
				<p onClick={() => setExpand(c => !c)} className="text-xs mt-2 md:mt-4 text-blue-500 cursor-pointer font-diatype">{expand ? 'See Less' : 'Read more'}</p>
			</div>
		</div>
	)
}
export default function Services() {

	return (
		<div id="product-overview" className="landing-page-section">
			<h2 className="text-3xl mb-10">Product Overview</h2>
			{/*<div className="grid grid-cols-1 md:grid-cols-3 gap-10">*/}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-20">
				{servicesData.cards.map(serviceItem => <ServiceCard
					key={serviceItem.id}
					imageSrc={serviceItem.image}
					title={serviceItem.title}
					learnMore={serviceItem.learnMore}
					description={serviceItem.overview}
				/>)}
			</div>
		</div>
	)
}
