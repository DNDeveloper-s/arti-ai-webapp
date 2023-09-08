import React, {useState} from 'react';
import Image, {StaticImageData} from 'next/image';
import Dummy from '@/assets/images/dummy.webp';
import {servicesData} from '@/constants/pageData/services';
import {motion} from 'framer-motion';

interface Props {
	imageSrc: StaticImageData;
	title: string;
	description: string;
	learnMore: string;
	colSpan: number;
	style: any;
}
const ServiceCard: React.FC<Props> = ({imageSrc, title, description, learnMore, colSpan, style = {} }) => {
	const [expand, setExpand] = useState(false);

	if(colSpan) return (
		<div className={'shadow shadow-blueGray-800 flex items-center rounded-xl transition-all overflow-hidden bg-opacity-20 bg-secondaryText ' + (colSpan ? ' col-span-2' : 'col-span-1')}>
			<motion.div animate={{height: expand ? '100%' : '16rem' }} className={'w-96 min-h-64 flex-shrink-0 overflow-hidden'}>
				<Image src={imageSrc} className="object-cover w-full h-full" alt={'Service'} />
			</motion.div>
			<div className="px-10 py-10">
				<h2 className="font-medium text-lg mb-1 font-diatype">{title}</h2>
				<p className="font-diatype text-sm opacity-50 leading-[1.5em]">{description}</p>
				<motion.div animate={{height: expand ? 'auto' : 0, marginTop: expand ? '20px' : 0}} className="mt-4 overflow-hidden">
					<p className="font-diatype text-sm opacity-50 leading-[1.5em]">{learnMore}</p>
				</motion.div>
				<p onClick={() => setExpand(c => !c)} className="text-xs mt-4 text-blue-500 cursor-pointer font-diatype">{expand ? 'See Less' : 'Read more'}</p>
			</div>
		</div>
	)

	return (
		<div>
			<div className="shadow shadow-blueGray-800 rounded-xl overflow-hidden bg-opacity-20 bg-secondaryText" style={style}>
				<div className="h-48 overflow-hidden">
					<Image src={imageSrc} className="object-cover w-full h-full" alt={'Service'} />
				</div>
				<div className="px-6 py-4">
					<h2 className="font-medium text-lg mb-1 font-diatype">{title}</h2>
					<p className="font-diatype text-sm opacity-50 leading-[1.5em]">{description}</p>
					<motion.div animate={{height: expand ? 'auto' : 0, marginTop: expand ? '20px' : 0}} className="mt-4 overflow-hidden">
						<p className="font-diatype text-sm opacity-50 leading-[1.5em]">{learnMore}</p>
					</motion.div>
					<p onClick={() => setExpand(c => !c)} className="text-xs mt-4 text-blue-500 cursor-pointer font-diatype">{expand ? 'See Less' : 'Read more'}</p>
				</div>
			</div>
		</div>
	)
}
export default function Services() {

	return (
		<div id="product-overview" className="landing-page-section">
			<h2 className="text-3xl mb-10">Product Overview</h2>
			{/*<div className="grid grid-cols-1 md:grid-cols-3 gap-10">*/}
			<div className="flex justify-center items-center">
				<ServiceCard
					key={servicesData.item.id}
					imageSrc={servicesData.item.image}
					title={servicesData.item.title}
					learnMore={servicesData.item.learnMore}
					description={servicesData.item.overview}
				/>
			</div>
			<div className="grid grid-cols-2 gap-10">
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
