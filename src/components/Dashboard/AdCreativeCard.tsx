'use client'

import React, {MouseEventHandler} from 'react';
import AdVariant from '@/components/ArtiBot/AdVariant';
import {IAdCreative} from '@/interfaces/IAdCreative';
import FacebookAdVariant, {
	FacebookAdVariantMini,
	FacebookAdVariantShimmer
} from '@/components/ArtiBot/FacebookAdVariant';
import {timeSince} from '@/helpers';
import {IConversation} from '@/interfaces/IConversation';
import {useConversation} from '@/context/ConversationContext';

interface AdCreativeCardProps {
	onClick: (val: IAdCreative) => void;
	adCreatives: IAdCreative[];
	conversationId?: IConversation['id'];
}

export const AdCreativeCardShimmer = () => {
	return <div className={'animate-pulse w-[25rem] flex-shrink-0 pb-4  relative border-2 border-secondaryBackground transition-all rounded-xl overflow-hidden text-[9px] bg-secondaryBackground'}>
		<div className="pointer-events-none w-full h-full absolute top-0 z-10 left-0 bg-[linear-gradient(90deg,_rgba(0,0,0,0.00)_55.23%,_rgba(0,0,0,0.61)_77%,_rgba(0,0,0,0.82)_100%)]" />
		<div className="py-3 px-3 relative flex items-center justify-between z-20">
			<h2 className="app-shimmer whitespace-nowrap w-full overflow-hidden overflow-ellipsis mr-5 text-base font-medium text-primary">This is a normal object where you can have some other things to adjust</h2>
			<span className="whitespace-nowrap">
				<span className="text-white text-opacity-0 text-[1.1em]">Generated:</span>
				<span className="app-shimmer text-primary text-[1.1em]">2 sec ago</span>
			</span>
		</div>
		<div className={"flex items-start gap-3 px-3"}>
			{/*{adCreative.variants.map(currentAdVariant => (*/}
			{/*	<FacebookAdVariant style={{zoom: 0.3, fontSize: '10px'}} key={currentAdVariant.id} noExpand={true} adVariant={currentAdVariant} className="flex-shrink-0 p-[3.8em] border border-gray-800 bg-secondaryBackground rounded max-w-[30%]"/>*/}
			{/*))}*/}
			<FacebookAdVariantShimmer style={{zoom: 0.3, fontSize: '9px'}} className="flex-shrink-0 p-[3.8em] border border-gray-800 bg-secondaryBackground rounded max-w-[30%]" />
			<FacebookAdVariantShimmer style={{zoom: 0.3, fontSize: '9px'}} className="flex-shrink-0 p-[3.8em] border border-gray-800 bg-secondaryBackground rounded max-w-[30%]" />
			<FacebookAdVariantShimmer style={{zoom: 0.3, fontSize: '9px'}} className="flex-shrink-0 p-[3.8em] border border-gray-800 bg-secondaryBackground rounded max-w-[30%]" />
		</div>
	</div>
}

const AdCreativeCard:React.FC<AdCreativeCardProps> = ({conversationId, adCreatives, onClick}) => {
	const {state} = useConversation();

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

	const lastUpdated = state.conversation.map[conversationId ?? '']?.lastAdCreativeCreatedAt ?? state.conversation.map[conversationId ?? '']?.updatedAt ?? adCreative.updatedAt;

	return <div data-conversationId={conversationId} onClick={() => onClick(adCreative)} className={'w-[25rem] flex-shrink-0 pb-4  relative border-2 border-secondaryBackground transition-all cursor-pointer hover:border-primary rounded-xl overflow-hidden text-[9px] bg-secondaryBackground'}>
		<div className="pointer-events-none w-full h-full absolute top-0 z-10 left-0 bg-[linear-gradient(90deg,_rgba(0,0,0,0.00)_55.23%,_rgba(0,0,0,0.61)_77%,_rgba(0,0,0,0.82)_100%)]" />
		<div className="py-3 px-3 relative flex items-center justify-between z-20">
			<h2 className="whitespace-nowrap w-full overflow-hidden overflow-ellipsis mr-5 text-base font-medium text-primary">{adCreative.adObjective}</h2>
			<span className="whitespace-nowrap">
				<span className="text-white text-opacity-30 text-[1.1em]">Generated:</span>
				<span className="text-primary text-[1.1em]">{timeSince(lastUpdated) + ' ago'}</span>
			</span>
		</div>
		<div className={"flex items-start gap-3 px-3"}>
			{adCreative.variants.sort((a, b) => {
				if(a.id > b.id) return -1;
				if(a.id < b.id) return 1;
				return 0;
			}).map(currentAdVariant => (
				<FacebookAdVariantMini style={{zoom: 0.3, fontSize: '9px'}} key={currentAdVariant.id} noExpand={true} adVariant={currentAdVariant} className="flex-shrink-0 p-[3.8em] border border-gray-800 bg-secondaryBackground rounded max-w-[30%]"/>
			))}
		</div>
	</div>
}

export default AdCreativeCard;
