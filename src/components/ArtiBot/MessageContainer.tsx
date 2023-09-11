import React, {FC, useEffect, useMemo, useRef} from 'react';
import Lottie from 'lottie-react';
import typingAnimation from '@/assets/lottie/typing.json';
import {ChatGPTMessageItem, MessageItem} from '@/components/ArtiBot/ArtiBot';
import {ChatGPTMessageObj} from '@/constants/artibotData';
import WavingHand from '@/assets/images/waving-hand.png';
import Image from 'next/image';

interface MessageContainerProps {
	miniVersion: boolean;
	showGetAdNowButton: boolean;
	// messages: MessageObj[];
	messages: ChatGPTMessageObj[];
	isGenerating: boolean;
	msg: string;
}

const MessageContainer: FC<MessageContainerProps> = ({msg, miniVersion, showGetAdNowButton, messages, isGenerating}) => {
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if(messages) {
			setTimeout(() => {
				containerRef.current && console.log('scrollEnd.current.scrollHeight - ', containerRef.current.scrollHeight)
				containerRef.current && containerRef.current.scrollTo({top: containerRef.current.scrollHeight, behavior: 'smooth'});
			}, 500)
		}
	}, [messages])

	const reversedMessages = useMemo(() => {
		if(!messages) return [];
		const sorted = messages.sort((a, b) => +a?.id - +b?.id);
		// console.log('sorted - ', sorted);
		return sorted.reverse();
	}, [messages])

	return (
		<div className={'flex-1 flex flex-col-reverse overflow-auto ' + (miniVersion ? ' min-h-[15em] md:min-h-[35em] max-h-[20em] md:max-h-[40em] ' : '') + (showGetAdNowButton ? ' pb-14 md:pb-24' : '')} ref={containerRef}>
			<div className="text-white whitespace-pre-wrap">
				{msg}
			</div>
			{isGenerating && <div className="w-full max-w-[900px] h-10 px-3 mx-auto flex flex-end">
        <Lottie animationData={typingAnimation} loop={true} />
      </div>}
			{
				reversedMessages.map((messageItem: ChatGPTMessageObj) => (
					<ChatGPTMessageItem key={messageItem.id} messageItem={messageItem} />
				))
			}
			<div className="w-full max-w-[900px] mx-auto px-3 flex justify-center items-center mb-3">
				<div className="h-0.5 mr-5 flex-1 bg-gray-800" />
				<div className="flex justify-center items-center font-light text-sm font-diatype text-white text-opacity-50">
					<span>Hey</span>
					<Image width={20} height={20} src={WavingHand} alt="Arti AI welcomes you"/>
					<span>, How can Arti Ai help you?</span>
				</div>
				<div className="h-0.5 ml-5 flex-1 bg-gray-800" />
			</div>
		</div>
	)
}

export default MessageContainer;
