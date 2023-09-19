import React from 'react';
import {ChatGPTMessageItem} from '@/components/ArtiBot/ArtiBot';
import {ChatGPTMessageObj, ChatGPTRole} from '@/constants/artibotData';

interface ConversationCardProps {

}

const messageItems: ChatGPTMessageObj[] = [{
	id: '1',
	content: 'What about the design and what can I expect for each platforms?',
	role: ChatGPTRole.USER,
},{
	id: '2',
	content: `Of course, I'd be happy to play a game of chess with you! I'll represent the white pieces and you can be black. To make a move, just use standard algebraic notation (e.g., e2 to e4). Let's get started!

Here's the initial board:`,
	role: ChatGPTRole.ASSISTANT,
},{
	id: '3',
	content: 'Thanks for the info. I will reach out to you in a moment.',
	role: ChatGPTRole.USER,
},{
	id: '4',
	content: 'This is a dummy message from the user.',
	role: ChatGPTRole.ASSISTANT,
},{
	id: '5',
	content: 'This is a dummy message from the user.',
	role: ChatGPTRole.USER,
},{
	id: '6',
	content: 'This is a dummy message from the user.',
	role: ChatGPTRole.ASSISTANT,
},]

const ConversationCard:React.FC<ConversationCardProps> = (props) => {

	return <div className={'w-[25rem] flex-shrink-0 h-[13rem] relative border-2 border-secondaryBackground transition-all cursor-pointer hover:border-primary rounded-xl overflow-hidden text-[9px] bg-secondaryBackground'}>
		<div className="w-full h-full absolute top-0 z-10 left-0 bg-[linear-gradient(180deg,_rgba(0,0,0,0.00)_55.23%,_rgba(0,0,0,0.61)_77%,_rgba(0,0,0,0.82)_100%)]" />
		<div className="py-3 px-3 flex items-center justify-between">
			<h2 className="text-base font-medium text-white">Doubt about the creative design</h2>
			<span>
				<span className="text-white text-opacity-30 text-[1.1em]">Last Activity:</span>
				<span className="text-primary text-[1.1em]">2 days ago</span>
			</span>
		</div>
		<div>
			{messageItems.map(messageItem => <ChatGPTMessageItem size={20} key={messageItem.id} messageItem={messageItem} />)}
		</div>
	</div>
}

export default ConversationCard;
