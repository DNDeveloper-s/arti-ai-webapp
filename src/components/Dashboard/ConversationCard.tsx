import React from 'react';
import {ChatGPTMessageItem} from '@/components/ArtiBot/ArtiBot';
import {ChatGPTMessageObj, ChatGPTRole} from '@/constants/artibotData';
import {Conversation} from '@/interfaces/Conversation';
import {timeSince} from '@/helpers';
import Link from 'next/link';

interface ConversationCardProps {
	conversation: Conversation;
}

const ConversationCard:React.FC<ConversationCardProps> = (props) => {

	return <Link href={'/artibot/' + props.conversation.id} >
		<div className={'w-[25rem] flex-shrink-0 h-[13rem] relative border-2 border-secondaryBackground transition-all cursor-pointer hover:border-primary rounded-xl overflow-hidden text-[9px] bg-secondaryBackground'}>
			<div className="w-full h-full absolute top-0 z-10 left-0 bg-[linear-gradient(180deg,_rgba(0,0,0,0.00)_55.23%,_rgba(0,0,0,0.61)_77%,_rgba(0,0,0,0.82)_100%)]" />
			<div className="py-3 px-3 flex items-center justify-between">
				<h2 className="text-base font-medium text-primary">{props.conversation.title}</h2>
				<span>
				<span className="text-white text-opacity-30 text-[1.1em]">Last Activity:</span>
				<span className="text-primary text-[1.1em] ml-1">{timeSince(props.conversation.last_activity) + ' ago'}</span>
			</span>
			</div>
			<div>
				{props.conversation.messages.map(messageItem => <ChatGPTMessageItem disableCopy size={20} key={messageItem.id} messageItem={messageItem} />)}
			</div>
		</div>
	</Link>
}

export default ConversationCard;
