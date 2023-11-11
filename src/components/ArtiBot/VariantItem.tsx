import React, {FC, useEffect, useRef, useState} from 'react';
import FacebookAdVariant from '@/components/ArtiBot/FacebookAdVariant';
import FeedBackView from '@/components/ArtiBot/RIghtPane/FeedBackView';
import {AdCreativeVariant} from '@/interfaces/IAdCreative';
import {timeSince} from '@/helpers';

interface VariantTabProps {
	activeVariant: AdCreativeVariant;
	width: number;
}

const VariantItem: FC<VariantTabProps> = ({width, activeVariant}) => {
	const variantRef = useRef<HTMLDivElement>(null);
	const [fontSize, setFontSize] = useState<number>(8.5);

	console.log('activeVariant - ', activeVariant);

	useEffect(() => {
		if(!variantRef.current) return;
		let newHeight = (356 * width) / 340;
		//
		const maxWidth = 340 * (innerHeight / 1.5) / 356;
		variantRef.current.style.maxWidth = maxWidth + 'px';
		if(newHeight > (innerHeight / 1.5)) return;


		// console.log('newHeight - ', newHeight / 57);
		setFontSize(newHeight / 57);
	}, [width])

	return (
		<>
			{activeVariant && (
				<>
					<div className="flex w-[80%] justify-between items-center mt-4">
						<label htmlFor="message" className="block text-sm font-light text-white text-opacity-50 text-left">Ad Preview</label>
						{activeVariant.updatedAt && <span className="whitespace-nowrap">
							<span className="text-white text-opacity-30 text-xs">Generated: </span>
							<span className="text-primary text-xs">{timeSince(activeVariant.updatedAt) + ' ago'}</span>
						</span>}
					</div>
					<div ref={variantRef} className={"mt-2 w-[80%]"}>
						<FacebookAdVariant adVariant={activeVariant} className="p-3 !w-full !max-w-unset border border-gray-800 h-full bg-secondaryBackground rounded-lg" style={{fontSize: (fontSize) + 'px'}}/>
					</div>
				</>
			)}

			{activeVariant && <FeedBackView variant={activeVariant}/>}
		</>
	);
};

export default VariantItem;
