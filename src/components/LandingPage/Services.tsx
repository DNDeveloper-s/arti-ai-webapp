import React, {FC} from 'react';
import {ServiceCard, servicesData} from '@/constants/landingPageData';
import Image from 'next/image';
import CTAButton from '@/components/CTAButton';

const ServiceItem = ({item, index}: {item: ServiceCard, index: number}) => {
	const isEven = (index % 2) === 0;
	return (
		<div className={'flex flex-col gap-6 ' + (isEven ? 'md:flex-row' : 'md:flex-row-reverse')}>
			<div className={'w-[80vw] h-[80vw] md:h-[400px] md:w-[400px] flex-shrink-0'}>
				<Image className="border-2 rounded border-gray-600 w-full h-full object-cover" src={item.imageSrc} alt={item.headLine} />
			</div>
			<div className={'flex flex-col justify-center gap-5 p-3 md:p-8 flex-1 ' + (isEven ? 'items-end' : 'items-start')}>
				<div>
					<div className={"divide-y divide-gray-700"}>
						<h2 className="max-w-[320px] text-white text-3xl font-medium mb-4">{item.headLine}</h2>
						<p className="max-w-[340px] text-gray-400 leading-6 text-sm pt-3">{item.description}</p>
					</div>
					<CTAButton className="py-2 px-4 text-sm rounded mt-5">EXPLORE</CTAButton>
				</div>
			</div>
		</div>
	)
}

interface ServicesProps {

}
const Services: FC<ServicesProps> = (props) => {
	return (
		<div id="services" className="landing-page-section flex flex-col gap-20">
			{servicesData.items.map((item, index) => (
				<ServiceItem key={item.id} item={item} index={index} />
			))}
		</div>
	);
};

export default Services;
