import {ChatGPTMessageObj, ChatGPTRole} from '@/interfaces/IArtiBot';
import React, {useState} from 'react';
import {IoIosCopy} from 'react-icons/io';
import Lottie from 'lottie-react';
import tickAnimation from '@/assets/lottie/tick_animation.json';
import Image from 'next/image';
import {botData, dummyUser} from '@/constants/images';
import AttachmentItem from '@/components/ArtiBot/MessageItems/AttachmentItem';
import AdItem from '@/components/ArtiBot/MessageItems/AdItem';

export default function MessageItem({messageItem}: {messageItem: ChatGPTMessageObj}) {
	const [showCopyAnimation, setShowCopyAnimation] = useState(false);

	async function copyTextToClipboard(text: string) {
		if ('clipboard' in navigator) {
			await navigator.clipboard.writeText(text);
		} else {
			document.execCommand('copy', true, text);
		}
		setShowCopyAnimation(true);
		setTimeout(() => {
			setShowCopyAnimation(false);
		}, 2000)
		return;
	}

	let item;

	if(messageItem.type === 'attachment') {
		// item = <AttachmentItem messageItem={messageItem} />
	}
	if(messageItem.type === 'text') {
		item = (
			<div className="flex items-start">
				<p className="whitespace-pre-wrap text-md text-primaryText opacity-60 flex-1">
					{messageItem.content}
				</p>
				<div className="w-9 h-9 mx-5 flex items-center justify-center relative">
					{!showCopyAnimation ? <IoIosCopy className="cursor-pointer justify-self-end text-primary" onClick={() => copyTextToClipboard(messageItem.content)}/> :
						<Lottie onAnimationEnd={() => setShowCopyAnimation(false)}
						        className="absolute top-1/2 left-1/2 w-20 h-20 transform -translate-x-1/2 -translate-y-1/2"
						        animationData={tickAnimation}
						        loop={false}
						/>
					}
				</div>
			</div>
		)
	}
	if(messageItem.type === 'ad-json') {
		item = <AdItem messageItem={messageItem} />
	}

	return (
		<div key={messageItem.id} className={'w-full ' + (messageItem.role === ChatGPTRole.ASSISTANT ? '' : 'bg-background bg-opacity-30')}>
			<div className="flex items-start px-5 py-4 w-full max-w-[800px] mx-auto">
				<Image className="rounded-lg mr-1 bg-primary" width={45} height={45} src={messageItem.role === ChatGPTRole.ASSISTANT ? botData.image : dummyUser.image} alt=""/>
				<div className="ml-3 flex-1">
					{item}
				</div>
			</div>
		</div>
	)
}
