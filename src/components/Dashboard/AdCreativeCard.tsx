'use client'

import React, {MouseEventHandler} from 'react';
import ChatGPTMessageItem from '@/components/ArtiBot/MessageItems/ChatGPTMessageItem';
import {ChatGPTMessageObj, ChatGPTRole, AdJSONInput, IAdVariant} from '@/interfaces/IArtiBot';
import exampleJSON from '@/database/exampleJSON';
import AdVariant from '@/components/ArtiBot/AdVariant';
import {IAdCreative} from '@/interfaces/IAdCreative';
import FacebookAdVariant from '@/components/ArtiBot/FacebookAdVariant';
import {timeSince} from '@/helpers';

interface AdCreativeCardProps {
	onClick: (val: IAdCreative) => void;
	adCreatives: IAdCreative[];
}

const AdCreativeCard:React.FC<AdCreativeCardProps> = ({adCreatives, onClick}) => {

	// const json = JSON.parse(adCreative.json) as AdJSONInput;
	const adCreative: IAdCreative = adCreatives.reduce((acc: IAdCreative, current) => {
		if(!acc.updatedAt || current.updatedAt > acc.updatedAt) {
			acc = {
				...current,
				variants: [...(acc.variants ?? []), ...(current.variants ?? [])]
			}
		} else {
			acc = {
				...acc,
				variants: [...(acc.variants ?? []), ...(current.variants ?? [])]
			}
		}
		return acc;
	}, {} as IAdCreative);

	return <div onClick={() => onClick(adCreative)} className={'w-[25rem] flex-shrink-0 pb-4  relative border-2 border-secondaryBackground transition-all cursor-pointer hover:border-primary rounded-xl overflow-hidden text-[9px] bg-secondaryBackground'}>
		<div className="w-full h-full absolute top-0 z-10 left-0 bg-[linear-gradient(90deg,_rgba(0,0,0,0.00)_55.23%,_rgba(0,0,0,0.61)_77%,_rgba(0,0,0,0.82)_100%)]" />
		<div className="py-3 px-3 relative flex items-center justify-between z-20">
			<h2 className="whitespace-nowrap w-full overflow-hidden overflow-ellipsis mr-5 text-base font-medium text-primary">{adCreative.adObjective}</h2>
			<span className="whitespace-nowrap">
				<span className="text-white text-opacity-30 text-[1.1em]">Generated:</span>
				<span className="text-primary text-[1.1em]">{timeSince(adCreative.updatedAt) + ' ago'}</span>
			</span>
		</div>
		<div className={"flex gap-3 px-3"}>
			{adCreative.variants.map(currentAdVariant => (
				<FacebookAdVariant key={currentAdVariant.id} noExpand={true} adVariant={currentAdVariant} className="flex-shrink-0 p-[3.8em] border border-gray-800 bg-secondaryBackground rounded max-w-[30%]" style={{fontSize: '2px'}}/>
			))}
		</div>
	</div>
}

export default AdCreativeCard;
