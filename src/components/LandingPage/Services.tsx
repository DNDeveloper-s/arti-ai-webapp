import React, {FC} from 'react';
import {ServiceCard, servicesData} from '@/constants/landingPageData';
import Image from 'next/image';
import CTAButton from '@/components/CTAButton';

const ServiceItem = ({item, index}: {item: ServiceCard, index: number}) => {
	const isEven = (index % 2) === 0;
	return (
		<div className={`w-full relative before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-[--before-bg] py-5 md:py-20`} style={{
			// backgroundImage: `url(${item.theme.bgUrl})`,
			// backgroundSize: 'cover',
			// '--before-bg': item.theme.backgroundColor
		}}>
			<div className={'landing-page-section bg-transparent flex flex-col gap-6 relative z-20 ' + (isEven ? 'md:flex-row' : 'md:flex-row-reverse')}>
				<div className={'w-[80vw] h-auto md:h-[400px] md:w-auto flex-shrink-0'}>
					<Image className="w-full h-full" src={item.imageSrc} alt={item.headLine} />
				</div>
				<div className={'flex flex-col justify-center gap-5 p-3 md:p-8 flex-1 ' + (isEven ? 'items-end' : 'items-start')}>
					<div>
						<div className={"divide-y divide-gray-700"}>
							<h2 className="max-w-[320px] landing-page-title mb-4">{item.headLine}</h2>
							<p className="max-w-[340px] text-gray-400 leading-6 text-sm md:text-base pt-3">{item.description}</p>
						</div>
						<CTAButton className="py-2 px-4 text-sm rounded mt-5">EXPLORE</CTAButton>
					</div>
				</div>
			</div>
		</div>
	)
}

interface ServicesProps {

}
const Services: FC<ServicesProps> = (props) => {
	return (
		<div id="services" className=" flex flex-col">
			{servicesData.items.map((item, index) => (
				<ServiceItem key={item.id} item={item} index={index} />
			))}
		</div>
	);
};

export default Services;
