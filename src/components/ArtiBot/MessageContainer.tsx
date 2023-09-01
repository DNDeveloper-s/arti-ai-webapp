import React, {FC, useEffect, useRef} from 'react';
import Lottie from 'lottie-react';
import typingAnimation from '@/assets/lottie/typing.json';
import {MessageItem, MessageObj} from '@/components/ArtiBot/ArtiBot';

interface MessageContainerProps {
	miniVersion: boolean;
	showGetAdNowButton: boolean;
	messages: MessageObj[];
	isGenerating: boolean;
}

const MessageContainer: FC<MessageContainerProps> = ({miniVersion, showGetAdNowButton, messages, isGenerating}) => {
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if(messages) {
			setTimeout(() => {
				containerRef.current && console.log('scrollEnd.current.scrollHeight - ', containerRef.current.scrollHeight)
				containerRef.current && containerRef.current.scrollTo({top: containerRef.current.scrollHeight, behavior: 'smooth'});
			}, 500)
		}
	}, [messages])

	return (
		<div className={'flex-1 flex flex-col-reverse overflow-auto ' + (miniVersion ? 'min-h-[20em] max-h-[40em] ' : '') + (showGetAdNowButton ? 'pb-24' : '')} ref={containerRef}>
			{isGenerating && <div className="w-14 h-16 mx-5 flex flex-end">
        <Lottie animationData={typingAnimation} loop={true} />
      </div>}
			{
				messages.map((messageItem: MessageObj) => (
					<MessageItem key={messageItem.id} messageItem={messageItem} />
				))
			}
		</div>
	)
}

export default MessageContainer;
