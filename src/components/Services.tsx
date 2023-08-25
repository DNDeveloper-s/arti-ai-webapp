import React from 'react';
import Image, {StaticImageData} from 'next/image';
import Dummy from '@/assets/images/dummy.webp';
import {servicesData} from '@/constants/pageData/services';

interface Props {
	imageSrc: StaticImageData;
	title: string;
	description: string;
}
const ServiceCard: React.FC<Props> = ({imageSrc, title, description}) => {

	return (
		<div className="shadow-2xl shadow-blueGray-800 rounded-xl overflow-hidden bg-opacity-20 bg-secondaryText">
			<Image src={imageSrc} alt={'Service'} />
			<div className="px-6 py-4">
				<h2 className="font-medium text-lg mb-1 font-diatype">{title}</h2>
				<p className="font-diatype text-sm opacity-50 leading-[1.5em]">{description}</p>
				<p className="text-xs mt-4 text-blue-500 cursor-pointer font-diatype">Learn more {' >'} </p>
			</div>
		</div>
	)
}
export default function Services() {

	return (
		<div id="product-overview" className="landing-page-section">
			<h2 className="text-3xl mb-10">Product Overview</h2>
			<div className="grid grid-cols-2 gap-10">
				{servicesData.cards.map(serviceItem => <ServiceCard
					key={serviceItem.id}
					imageSrc={serviceItem.image}
					title={serviceItem.title}
					description={serviceItem.overview}
				/>)}
			</div>
		</div>
	)
}
