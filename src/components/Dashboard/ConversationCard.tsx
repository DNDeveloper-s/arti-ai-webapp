'use client'

import React from 'react';
import {ConversationType, IConversation} from '@/interfaces/IConversation';
import {getConversationURL, timeSince} from '@/helpers';
import Link from 'next/link';
import useMounted from '@/hooks/useMounted';
import ChatGPTMessageItem from '@/components/ArtiBot/MessageItems/ChatGPTMessageItem';
import StrategyIcon from '@/components/shared/icons/StrategyIcon';
import {colors} from '@/config/theme';
import AdCreativeIcon from '@/components/shared/icons/AdCreativeIcon';

interface ConversationCardProps {
	conversation: IConversation;
}

const ConversationCard:React.FC<ConversationCardProps> = (props) => {
	const mounted = useMounted();


	return <Link href={getConversationURL(props.conversation.id, props.conversation)} >
		<div className={'w-[25rem] flex-shrink-0 h-[13rem] relative border-2 border-secondaryBackground transition-all cursor-pointer hover:border-primary rounded-xl overflow-hidden text-[9px] bg-secondaryBackground'}>
			<div className="w-full h-full absolute top-0 z-10 left-0 bg-[linear-gradient(180deg,_rgba(0,0,0,0.00)_55.23%,_rgba(0,0,0,0.61)_77%,_rgba(0,0,0,0.82)_100%)]" />
			<div className="py-3 px-3 flex items-center justify-between">
				<div className="flex items-center gap-3">
					<span className="w-4">
						{props.conversation.conversation_type === ConversationType.STRATEGY ?
							<StrategyIcon fill={colors.primary} />
							: <AdCreativeIcon fill={colors.primary} />
						}
					</span>
					<h2 className="text-base font-medium text-primary">{'New Chat'}</h2>
				</div>
				{/*<div className="flex items-center gap-3">*/}
				{/*	<h2 className="text-base font-medium text-primary">{'New Chat'}</h2>*/}
				{/*	<div className="flex gap-1 items-center">*/}
				{/*	<span className="w-3">*/}
				{/*		<AdCreativeIcon fill="white" />*/}
				{/*	</span>*/}
				{/*		<span>Ad Creative</span>*/}
				{/*	</div>*/}
				{/*</div>*/}
				<span>
				<span className="text-white text-opacity-30 text-[1.1em]">Last Activity:</span>
					{mounted && <span
						className="text-primary text-[1.1em] ml-1">{timeSince(props.conversation.updatedAt) + ' ago'}</span>}
			</span>
			</div>
			<div className="flex flex-col-reverse">
				{props.conversation.messages.map(messageItem => <ChatGPTMessageItem disableCopy size={20} key={messageItem.id} messageItem={messageItem} variantFontSize={10} />)}
			</div>
		</div>
	</Link>
}

export default ConversationCard;
