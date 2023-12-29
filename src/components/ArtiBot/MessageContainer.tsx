import React, {FC, useEffect, Dispatch, useMemo, useRef, useState} from 'react';
import ChatGPTMessageItem, {
	ChatGPTMessageCreatingAd, ChatGPTMessageGeneratingAnimation,
	ChatGPTMessageWelcomeMessage
} from '@/components/ArtiBot/MessageItems/ChatGPTMessageItem';
import {ChatGPTMessageObj, ChatGPTRole} from '@/interfaces/IArtiBot';
import WavingHand from '@/assets/images/waving-hand.webp';
import Image from 'next/image';
import {useParams} from 'next/navigation';
import {ConversationType} from '@/interfaces/IConversation';
import {AnimatePresence, motion} from 'framer-motion';
import {framerContainer} from '@/config/framer-motion';

interface MessageContainerProps {
	miniVersion: boolean;
	showGetAdNowButton: boolean;
	// messages: MessageObj[];
	messages: ChatGPTMessageObj[];
	setMessages: Dispatch<React.SetStateAction<MessageContainerProps['messages']>>
	isGenerating: boolean;
	isGeneratingAd: boolean;
	msg: string;
	conversationType?: ConversationType;
	chunksRef?: React.MutableRefObject<string>;
	doneRef?: React.MutableRefObject<boolean>
}

const MessageContainer: FC<MessageContainerProps> = ({isGeneratingAd, conversationType, msg, setMessages, miniVersion, showGetAdNowButton, messages, isGenerating, chunksRef, doneRef}) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const params = useParams();

	useEffect(() => {
		// if(messages) {
		// 	setTimeout(() => {
		// 		containerRef.current && console.log('scrollEnd.current.scrollHeight - ', containerRef.current.scrollHeight)
		// 		containerRef.current && containerRef.current.scrollTo({top: containerRef.current.scrollHeight, behavior: 'smooth'});
		// 	}, 500)
		// }
	}, [messages])

	const reversedMessages = useMemo(() => {
		if(!messages) return [];
		return messages.sort((a, b) => {
			if(a.updatedAt > b.updatedAt) return 1;
			if(a.updatedAt < b.updatedAt) return -1;
			return 0;
		});
	}, [messages])

	return (
		<AnimatePresence mode="wait">
			<div className={'flex-1 flex flex-col-reverse overflow-auto ' + (miniVersion ? ' min-h-[50vh] md:min-h-[50vh] max-h-[60vh] md:max-h-[60vh] ' : '') + (showGetAdNowButton ? ' pb-9 md:pb-14' : '')} ref={containerRef}>
				{/*<ChatGPTMessageCreatingAd/>*/}
				{isGeneratingAd && <ChatGPTMessageCreatingAd/>}
				<div className="text-white whitespace-pre-wrap">
					{msg}
				</div>
				{isGenerating && <ChatGPTMessageGeneratingAnimation />}
				<motion.div variants={framerContainer} animate="show" initial="hidden" exit="hidden" >
					{conversationType && <ChatGPTMessageWelcomeMessage type={conversationType}/>}
					{
						reversedMessages.map((messageItem: ChatGPTMessageObj) => (
							<ChatGPTMessageItem
								chunksRef={chunksRef}
								doneRef={doneRef}
								isGenerating={isGenerating}
								conversationId={params.conversation_id as string}
								key={messageItem.id}
								setMessages={setMessages}
								messageItem={messageItem}
							/>
						))
					}
				</motion.div>
				<div className="w-full max-w-[900px] mx-auto px-3 flex justify-center items-center my-3">
					<div className="h-0.5 mr-5 flex-1 bg-gray-800" />
					<div className="flex justify-center items-center font-light text-sm font-diatype text-white text-opacity-50">
						<span>Hey</span>
						<Image width={20} height={20} src={WavingHand} alt="Arti AI welcomes you"/>
						<span>, How can Arti Ai help you?</span>
					</div>
					<div className="h-0.5 ml-5 flex-1 bg-gray-800" />
				</div>
			</div>
		</AnimatePresence>
	)
}

export default MessageContainer;
