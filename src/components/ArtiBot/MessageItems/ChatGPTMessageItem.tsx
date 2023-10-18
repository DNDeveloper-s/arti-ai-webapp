import {AdJSONInput, ChatGPTMessageObj, ChatGPTRole} from '@/interfaces/IArtiBot';
import React, {Dispatch, FC, useEffect, useState} from 'react';
import {IoIosCopy} from 'react-icons/io';
import Lottie from 'lottie-react';
import tickAnimation from '@/assets/lottie/tick_animation.json';
import getJSONObjectFromAString, {isValidJsonWithAdsArray} from '@/helpers';
import Image from 'next/image';
import {botData, dummyUser} from '@/constants/images';
import AdItem from '@/components/ArtiBot/MessageItems/AdItem';
import {addAdCreatives, useConversation} from '@/context/ConversationContext';
import {IAdCreative} from '@/interfaces/IAdCreative';
import {dummyEssay} from '@/constants/dummy';

interface ChatGPTMessageItemProps {
	messageItem: ChatGPTMessageObj;
	isGenerating: boolean;
	disableCopy?: boolean;
	size?: number;
	variantFontSize?: number;
	conversationId?: string;
	chunksRef?: React.MutableRefObject<string>;
	doneRef?: React.MutableRefObject<boolean>
	setMessages: Dispatch<React.SetStateAction<ChatGPTMessageObj[]>>
}


function GeneratingMessageItem({setMessages, messageItem, chunksRef, doneRef}: {messageItem: ChatGPTMessageObj, setMessages: Dispatch<React.SetStateAction<ChatGPTMessageObj[]>>, chunksRef?: React.MutableRefObject<string>, doneRef?: React.MutableRefObject<boolean>}) {
	const [item, setItem] = useState('');

	useEffect(() => {
		if(!doneRef || !chunksRef || !messageItem || !setMessages) return;

		let j = 0;
		const interval = setInterval(() => {
			const message = chunksRef.current.slice(0, j);
			setItem(c => message);

			// Shift the cursor to next index when the chunks array has more chunks
			if(chunksRef.current.length >= j) {
				j++;
			}

			// Clear the interval when the chunks array is done and the message is fully typed
			if(doneRef.current && chunksRef.current.length < j) {
				clearInterval(interval);
				setMessages(_messages => {
					const messages = [..._messages];
					const index = messages.findIndex(m => m.id === messageItem.id);
					messages[index] = {
						...messageItem,
						generating: false,
						content: message
					}
					return messages;
				})
			}
		}, 5);

		return () => {
			clearInterval(interval);
		}
	}, [chunksRef, doneRef, messageItem, setMessages]);

	return (
		<div className="flex items-start">
			<p className="whitespace-pre-wrap text-[1em] text-primaryText text-opacity-60 flex-1">
				{item}
				<span className="w-1 inline-block -mb-1.5 h-5 bg-primary cursor-blink"/>
			</p>
			<div className="w-[1.85em] h-[1.85em] mx-[1em] flex items-center justify-center relative">
				<IoIosCopy className="cursor-pointer opacity-0 pointer-events-none justify-self-end text-primary" />
			</div>
		</div>
	);
}


const ChatGPTMessageItem: FC<ChatGPTMessageItemProps> = ({setMessages, messageItem: _messageItem, doneRef, chunksRef, isGenerating, disableCopy, size = 45, variantFontSize, conversationId})  =>{
	const [showCopyAnimation, setShowCopyAnimation] = useState(false);
	const [messageItem, setMessageItem] = useState<ChatGPTMessageObj>(_messageItem);
	const {state, dispatch} = useConversation();

	useEffect(() => {
		setMessageItem(_messageItem);
	}, [_messageItem]);

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
				                                 onClick={() => messageItem && messageItem.content && copyTextToClipboard(messageItem.content)}/> :
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

	if(messageItem.adCreatives?.length > 0) {
		item = <AdItem messageItem={messageItem} variantFontSize={variantFontSize} />
	}

	if(messageItem.content && conversationId && !isGenerating) {
		const jsonObjectInString = getJSONObjectFromAString(messageItem.content);
		const isJson = isValidJsonWithAdsArray(jsonObjectInString);

		if(isJson) {
			const json = JSON.parse(jsonObjectInString) as AdJSONInput;
			const adCreatives: IAdCreative[] = [{
				id: Date.now().toString(),
				createdAt: new Date(),
				updatedAt: new Date(),
				json: jsonObjectInString,
				variants: json.variants,
				disclaimer: json.disclaimer,
				summary: json.summary,
				companyName: json.companyName,
				adObjective: json.adObjective,
				conversationId: conversationId,
			}];
			const msgItem = {
				...messageItem,
				json: jsonObjectInString,
				content: null,
				adCreatives
			}
			setMessageItem(msgItem);
			// addAdCreatives(dispatch, adCreatives);
			item = <AdItem messageItem={msgItem} variantFontSize={variantFontSize} />
		}
	}

	if(messageItem.generating) {
		item = <GeneratingMessageItem setMessages={setMessages} messageItem={messageItem} chunksRef={chunksRef} doneRef={doneRef} />
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

export default ChatGPTMessageItem;
