'use client';

import React, {FC, useRef} from 'react';
import {NumberCard, numbersData} from '@/constants/landingPageData';
import useMousePos from '@/hooks/useMousePos';

const NumberCard = ({card} : {card: NumberCard}) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const mousePos = useMousePos(containerRef);

	return (
		<div ref={containerRef} className="arti-card h-52 rounded" style={{'--mouse-x': `${mousePos.x}px`, '--mouse-y': `${mousePos.y}px`}}>
			<div className="p-3 flex flex-col gap-6 items-center justify-center relative h-full bg-gray-950 w-full rounded-[inherit] z-20 overflow-hidden scale-100 font-diatype group">
				<div className="w-12 h-12">
					<card.icon className={"w-full h-full text-primary fill-primary stroke-primary"} />
				</div>
				<div className={'text-center'}>
					<span className={'text-base font-medium max-w-[200px] block leading-tight'}>{card.headLine}</span>
					{card.subHeadLine && <span className={'text-xs leading-tight'}>{card.subHeadLine}</span>}
				</div>
			</div>
		</div>
	)
}

interface NumbersProps {

}
const Numbers: FC<NumbersProps> = (props) => {
	return (
		<div id="numbers" className="landing-page-section py-40 flex flex-col gap-10 justify-center md:flex-row">
			<div className="flex flex-col gap-5 justify-center flex-1">
				<h2 className="text-4xl font-medium font-diatype max-w-[400px]">{numbersData.headLine}</h2>
				<p className="text-base font-light font-diatype text-gray-400 max-w-[400px]">{numbersData.subHeadLine}</p>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
				{numbersData.items.map((card: NumberCard) => (
					<NumberCard key={card.id} card={card} />
				))}
			</div>
		</div>
	);
};

export default Numbers;
