import {ChatGPTMessageObj, ChatGPTRole} from '@/interfaces/IArtiBot';
import React, {useState} from 'react';
import {IoIosCopy} from 'react-icons/io';
import Lottie from 'lottie-react';
import tickAnimation from '@/assets/lottie/tick_animation.json';
import getJSONObjectFromAString, {isValidJsonWithAdsArray} from '@/helpers';
import Image from 'next/image';
import {botData, dummyUser} from '@/constants/images';
import AdItem from '@/components/ArtiBot/MessageItems/AdItem';

export default function ChatGPTMessageItem({messageItem, disableCopy, size = 45, variantFontSize}: {messageItem: ChatGPTMessageObj, disableCopy?: boolean, size?: number, variantFontSize?: number}) {
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

	let item = (
		<div className="flex items-start">
			<p className="whitespace-pre-wrap text-[1em] text-primaryText opacity-60 flex-1">
				{messageItem.content}{messageItem.generating && <span className="w-1 inline-block -mb-1.5 h-5 bg-primary cursor-blink"/>}
			</p>
			{!disableCopy && <div className="w-[1.85em] h-[1.85em] mx-[1em] flex items-center justify-center relative">
				{!showCopyAnimation ? <IoIosCopy className="cursor-pointer justify-self-end text-primary"
				                                 onClick={() => copyTextToClipboard(messageItem.content)}/> :
					<Lottie onAnimationEnd={() => setShowCopyAnimation(false)}
					        className="absolute top-1/2 left-1/2 w-20 h-20 transform -translate-x-1/2 -translate-y-1/2"
					        animationData={tickAnimation}
					        loop={false}
					/>
				}
      </div>}
		</div>
	)

	if(messageItem.type === 'ad-json') {
		item = <AdItem messageItem={messageItem} variantFontSize={variantFontSize} />
	}

	const jsonObjectInString = getJSONObjectFromAString(messageItem.content);
	const isJson = isValidJsonWithAdsArray(jsonObjectInString, true);
	if(isJson) {
		const _messageItem = {
			...messageItem,
			json: jsonObjectInString
		}
		item = <AdItem messageItem={_messageItem} variantFontSize={variantFontSize} />
	}

	return (
		<div key={messageItem.content} className={'w-full ' + (messageItem.role === ChatGPTRole.ASSISTANT ? '' : 'bg-background bg-opacity-30')}>
			<div className="flex items-start px-[1em] py-[0.9em] w-full max-w-[800px] mx-auto">
				<Image className="rounded-lg mr-[0.3em]" width={size} height={size} src={messageItem.role === ChatGPTRole.ASSISTANT ? botData.image : dummyUser.image} alt=""/>
				<div className="ml-[0.8em] flex-1">
					{item}
				</div>
			</div>
		</div>
	)
}
