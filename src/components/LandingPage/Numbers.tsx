'use client';

import React, {FC, useRef} from 'react';
import {NumberCard, numbersData} from '@/constants/landingPageData';
import useMousePos from '@/hooks/useMousePos';
import Counter from '@/components/shared/renderers/Counter';
import CountUp from 'react-countup';

const NumberCard = ({card} : {card: NumberCard}) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const mousePos = useMousePos(containerRef);

	return (
		<div ref={containerRef} className="arti-card h-44 rounded" style={{'--mouse-x': `${mousePos.x}px`, '--mouse-y': `${mousePos.y}px`}}>
			<div className="p-3 flex gap-2 items-center justify-center relative h-full bg-gray-950 w-full rounded-[inherit] z-20 overflow-hidden scale-100 font-diatype group">
				<div className="px-4 flex justify-center items-center">
					<div className="w-12 h-12">
						<card.icon className={"w-full h-full text-gray-400 fill-gray-400 stroke-gray-400"} />
					</div>
				</div>
				<div className={'flex-1 flex flex-col items-start justify-center md:justify-start h-full py-6'}>
					<div>
						<Counter className={'text-3xl md:text-6xl font-bold text-primary'} from={0} to={card.number.value} duration={card.number.duration} />
						<span className={'text-lg md:text-2xl font-bold text-primary max-w-[200px] leading-tight'}>{card.headLine}</span>
					</div>
					{card.subHeadLine && <span className={'text-sm leading-normal'}>{card.subHeadLine}</span>}
				</div>
			</div>
		</div>
	)
}

interface NumbersProps {

}
const Numbers: FC<NumbersProps> = (props) => {
	return (
		<div id="numbers" className="landing-page-section py-40 flex flex-col gap-10 justify-center">
			<div className="flex flex-col gap-5 justify-center flex-1">
				<h2 className="landing-page-title font-diatype">{numbersData.headLine}</h2>
				<p className="text-base font-light font-diatype text-gray-400 max-w-[400px]">{numbersData.subHeadLine}</p>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
				{numbersData.items.map((card: NumberCard) => (
					<NumberCard key={card.id} card={card} />
				))}
			</div>
		</div>
	);
};

export default Numbers;
