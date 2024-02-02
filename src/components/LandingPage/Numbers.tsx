'use client';

import React, {FC, useRef} from 'react';
import {NumberCard, numbersData} from '@/constants/landingPageData';
import useMousePos from '@/hooks/useMousePos';
import Counter from '@/components/shared/renderers/Counter';
import Element from '../shared/renderers/Element';

const NumberCard = ({card} : {card: NumberCard}) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const mousePos = useMousePos(containerRef);

	return (
		<div ref={containerRef} className="arti-card h-24 md:h-44 rounded" style={{'--mouse-x': `${mousePos.x}px`, '--mouse-y': `${mousePos.y}px`}}>
			<div className="p-1 md:p-3 md flex gap-2 items-center justify-center relative h-full bg-gray-950 w-full rounded-[inherit] z-20 overflow-hidden scale-100 font-diatype group">
				<div className="px-2 md:px-4 flex justify-center items-center">
					<div className="w-7 md:w-12 h-7 md:h-12">
						<card.icon className={"w-full h-full text-gray-400 fill-gray-400 stroke-gray-400"} />
					</div>
				</div>
				<div className={'flex-1 flex flex-col items-start justify-start md:justify-start h-full py-2 md:py-6'}>
					<div>
						<Counter className={'text-4xl md:text-6xl font-bold text-primary'} from={0} to={card.number.value} duration={card.number.duration} />
						<span className={'text-base md:text-2xl font-bold text-primary max-w-[200px] leading-tight'}>{card.headLine}</span>
					</div>
					{card.subHeadLine && <span className={'text-xs md:text-sm md:leading-normal'}>{card.subHeadLine}</span>}
				</div>
			</div>
		</div>
	)
}

interface NumbersProps {

}
const Numbers: FC<NumbersProps> = (props) => {
	return (
		<div id="numbers" data-groupid="landing-section" className="landing-page-section py-20 md:py-40 flex flex-col gap-10 justify-center">
			<div className="flex flex-col gap-5 justify-center items-center flex-1">
				<Element content={numbersData.headLine} type={'h2'} className="landing-page-grad-title inline-block" />
				<Element content={numbersData.subHeadLine} type={'p'} className="text-base font-light font-diatype text-gray-400 max-w-[400px]" />
			</div>
			<div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
				{numbersData.items.map((card: NumberCard) => (
					<NumberCard key={card.id} card={card} />
				))}
			</div>
		</div>
	);
};

export default Numbers;
