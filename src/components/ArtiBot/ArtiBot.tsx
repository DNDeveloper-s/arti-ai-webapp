'use client';

import React, {FC, useContext, useEffect, useRef, useState} from 'react';
import {colors} from '@/config/theme';
import TextareaAutosize from 'react-textarea-autosize';
import {motion} from 'framer-motion'
import getJSONObjectFromAString, {humanFileSize, isValidJsonWithAdsArray} from '@/helpers';
import {threshold} from '@/config/thresholds';
import Logo from '@/components/Logo';
import {framerContainer, framerItem} from '@/config/framer-motion';
import {useRouter} from 'next/navigation';
import {MdArrowBackIos, MdDelete} from 'react-icons/md';
import Link from 'next/link';
import MessageContainer from '@/components/ArtiBot/MessageContainer';
import {HandleChunkArgs, ChatGPTMessageObj, ChatGPTRole, FileObject, IAdVariant, MessageObj} from '@/interfaces/IArtiBot';
import {MessageService} from '@/services/Message';
import {SnackbarContext} from '@/context/SnackbarContext';
import {freeTierLimit} from '@/constants';
import RightPane from '@/components/ArtiBot/RIghtPane/RightPane';
import exampleJSON from '@/database/exampleJSON';
import {IConversation} from '@/interfaces/IConversation';
import {dummy} from '@/constants/dummy';
import ObjectId from 'bson-objectid';
import GetAdButton from '@/components/ArtiBot/GetAdButton';
import FileItem from '@/components/ArtiBot/MessageItems/FileItem';
import axios, {isAxiosError} from 'axios';
import Image from 'next/image';
import {updateVariantImage, useConversation} from '@/context/ConversationContext';

export const dummyJSONMessage: MessageObj = {
	id: '5',
	is_ai_response: true,
	message: 'Hello there, Tell me something more about it.',
	timestamp: new Date().toISOString(),
	type: 'ad-json',
	json: exampleJSON
}

interface ArtiBotProps {
	containerClassName?: string;
	miniVersion?: boolean;
	conversation?: IConversation;
}

const ArtiBot: FC<ArtiBotProps> = ({containerClassName = '', miniVersion = false, conversation}) => {
	const areaRef = useRef<HTMLTextAreaElement>(null);
	const [inputValue, setInputValue] = useState('');
	const [messages, setMessages] = useState<ChatGPTMessageObj[]>(conversation?.messages ?? []);
	const [areaHeight, setAreaHeight] = useState(0);
	const [isGenerating, setIsGenerating] = useState(false);
	const [files, setFiles] = useState<File[] | null>(null);
	const [selectedFiles, setSelectedFiles] = useState<FileObject[] | null>(null);
	const [exhausted, setExhausted] = useState(false);
	const router = useRouter();
	const [, setSnackBarData] = useContext(SnackbarContext).snackBarData;
	const chunksRef = useRef('');
	const doneRef = useRef(false);
	const [msg, setMsg] = useState('');
	const [adCreative, setAdCreative] = useState(conversation?.ad_creative ?? null);
	const {state, dispatch} = useConversation()

	useEffect(() => {
		// console.log('freeTierLimit - ', freeTierLimit);
		if(messages.length >= freeTierLimit && miniVersion) {
			setExhausted(true);
		}
	}, [messages, miniVersion]);

	console.log('state - ', state);

	useEffect(() => {
		setMessages(conversation?.messages ?? []);
	}, [conversation])

	useEffect(() => {
		miniVersion && setMessages(JSON.parse(localStorage.getItem('messages') ?? '[]'));
	}, [miniVersion])

	useEffect(() => {
		// Check if the messages array contains generating key as true
		const isGenerating = messages.find(m => m.generating);
		if(isGenerating) return;

		miniVersion && localStorage.setItem('messages', JSON.stringify(messages));

		// Update conversation messages
		const currentConversation = dummy.Conversations.find(c => c.id === conversation?.id);
		// Also check if the messages does not contain generating key as true
		console.log('messages - ', messages);
		if(currentConversation && !messages.find(m => m.generating)) {
			currentConversation.messages = messages;
		}

		// Check if the messages contain the message as our ad type json with the helper isValidJSON
		const jsonMessage = messages.find(c => {
			const jsonObjectInString = getJSONObjectFromAString(c.content);
			return isValidJsonWithAdsArray(jsonObjectInString, true);
		});
		if(jsonMessage) {
			// Update the IAdCreative in IConversation
			const currentConversation = dummy.Conversations.find(c => c.id === conversation?.id);
			if(currentConversation) {
				const json = getJSONObjectFromAString(jsonMessage.content);
				const variants = JSON.parse(json).Ads.map((c: IAdVariant) => ({...c, feedback: {}}))
				// Push to the IAdCreative
				const ad_creative = {
					id: ObjectId(),
					variants: variants,
					json: json
				};
				currentConversation.ad_creative = ad_creative;
				setAdCreative(ad_creative);

				// Create the text-to-image API request
				fetchImageForVariants(variants);

				// const _res = await axios.post('/api/text-to-image')
				// console.log('response - ', _res);

			}
		}


	} , [conversation?.id, messages, miniVersion]);

	async function fetchImageForVariants(variants: IAdVariant[]) {
		// variants.map(async (variant) => {
		// 	const _res = await axios.post('/api/text-to-image', {text: variant['One liner']});
		// 	console.log('_res - ', _res);
		// })

		for await(let variant of variants) {
			const _res = await axios.post('/api/text-to-image', {text: variant['Image']});

			// variant
			if(_res.data.ok) {
				await updateVariantImage(dispatch, variant['One liner'], 'data:image/jpeg;charset=utf-8;base64,' + _res.data.data.artifacts[0].base64);
			}
		}
	}

	useEffect(() => {
		if(!files) return setSelectedFiles(null);
		const _fs: FileObject[] = [];
		files.map((file, index) => {
			const url = URL.createObjectURL(file);
			_fs.push({id: index, url, type: file.type, size: file.size, name: file.name});
		})
		setSelectedFiles(_fs.length > 0 ? _fs : null);
	}, [files]);

	function handleJsonResponse(json: string) {
		const id = Date.now().toString();
		setMessages(c => [...c, {
			id,
			role: ChatGPTRole.ASSISTANT,
			content: json,
			generating: false,
			type: 'ad-json',
			json: json
		}]);
	}

	function handleMessageResponse(args: HandleChunkArgs) {
		console.log('args - ', args);
		if(!args?.is_ad_json && args.done !== undefined && args.index !== undefined) {
			// if the response is not ad json
			handleChunk(args.chunk, args.done, args.index);
			return;
		}

		if(args.json) handleJsonResponse(args.json);
	}

	function handleChunk(chunk: string | undefined, done: boolean, index: number) {
		if(index === 0) {
			const id = Date.now().toString();
			chunksRef.current = '';
			setMessages(c => [...c, {content: chunksRef.current, role: ChatGPTRole.ASSISTANT, id}]);
			let i = 0;
			let lastChunk = chunksRef.current.slice(0, i);
			const intervalId = setInterval(() => {

				setMessages((c) => {
					return c.map(a => {
						if(a.id === id) {
							return {
								...a,
								generating: !(doneRef.current && i > chunksRef.current.length),
								content: chunksRef.current.slice(0, i)
							}
						}
						return a;
					});
				})

				lastChunk = chunksRef.current.slice(0, i + 1);
				// setMsg(chunksRef.current.slice(0, i));
				if(lastChunk !== chunksRef.current || i < chunksRef.current.length) i++;

				if(doneRef.current && i >= chunksRef.current.length) {
					clearInterval(intervalId);
					setMessages((c) => {
						return c.map(a => {
							if(a.id === id) {
								return {
									...a,
									generating: false
								}
							}
							return a;
						});
					})
				}

			}, 10)
		}

		if(chunk) chunksRef.current = chunksRef.current + chunk;
		doneRef.current = done;
	}

	async function handleSubmitMessage(generate_ad?: boolean) {
		if(!generate_ad && (exhausted || (!selectedFiles && inputValue.trim().length === 0))) return;
		const currentConversation = dummy.Conversations.find(c => c.id === conversation?.id);
		if(currentConversation) {
			// set conversation has_activity to true
			currentConversation.has_activity = true;
		}
		setInputValue('');
		setIsGenerating(true);
		const _messages: ChatGPTMessageObj[] = [...messages];

		if(!generate_ad) {
			_messages.push({
				id: Date.now().toString(),
				role: ChatGPTRole.USER,
				content: inputValue.trim()
			})
			setMessages(_messages);
		}


		const transformedMessages = _messages.map(c => ({role: c.role, content: c.content}));

		const messageService = new MessageService();
		const response = await messageService.send(transformedMessages, handleMessageResponse, generate_ad);

		console.log('response - ', response);

		if(response && !response.ok) setSnackBarData({message: 'We are unable to process the request right now!', status: 'error'});
		setIsGenerating(false);

		// if(response.data && response.data.choices) {
		// 	const responseMessage = response.data.choices[0].message;
		// 	setMessages(c => [...c, {...responseMessage, id: Date.now().toString()}])
		// }

		// console.log('!(response.limitLeft > 0) - ', !(response.limitLeft > 0));
		// if(!(response.limitLeft > 0)) return setExhausted(true);
		//

		return;
	}

	const showGetAdNowButton = messages.length >= threshold.getAdNowButtonAfter;

	return (
		<div className={`flex h-full overflow-hidden`}>
			<div className={'bg-secondaryBackground flex-1 relative flex flex-col font-diatype overflow-hidden ' + (containerClassName)}>
				<>
					<div className="flex justify-between h-16 py-2 px-6 box-border items-center bg-secondaryBackground shadow-[0px_1px_1px_0px_#000]">
						{!miniVersion && <div className="flex items-center cursor-pointer" onClick={() => router.push('/')}>
							<MdArrowBackIos style={{fontSize: '21px'}}/>
							<span className="ml-0.5 -mb-0.5 text-white text-opacity-60">Dashboard</span>
						</div>}
						<Link href="/" className="flex justify-center items-center">
							<Logo width={35} className="mr-2" height={35} />
							<h3 className="text-lg">Arti AI</h3>
						</Link>
						{!miniVersion && <div className="flex items-center opacity-0 pointer-events-none">
							<MdArrowBackIos/>
							<span className="text-white text-opacity-50">Dashboard</span>
						</div>}
					</div>
					<MessageContainer msg={msg} messages={messages} showGetAdNowButton={showGetAdNowButton} miniVersion={miniVersion} isGenerating={isGenerating} />
					<div className="flex w-full max-w-[900px] mx-auto h-[4.5rem] relative items-end pb-2 px-3 bg-secondaryBackground" style={{height: selectedFiles ? "220px" : areaHeight > 0 ? `calc(4.5rem + ${areaHeight}px)` : '4.5rem'}}>
						{(showGetAdNowButton) && <GetAdButton
							adGenerated={Boolean(adCreative)}
							onClick={async (setLoading) => {
								await handleSubmitMessage(true);
								setLoading(false);
							}}
						/>}
						{/*<label htmlFor="file" className="cursor-pointer mr-2 mb-[1.15rem]">*/}
						{/*	<input onChange={e => {*/}
						{/*		const files = e.currentTarget.files;*/}
						{/*		setFiles(c => {*/}
						{/*			if(!files) return c;*/}
						{/*			console.log('Array.from(e.currentTarget.files) - ', Array.from(files));*/}
						{/*			const filesArr = Array.from(files);*/}
						{/*			if(!c) return filesArr;*/}
						{/*			// @ts-ignore*/}
						{/*			return [...c, ...filesArr];*/}
						{/*		});*/}
						{/*	}} type="file" multiple accept="image/*, .pdf, .docx, .doc, .txt" id="file" className="hidden"/>*/}
						{/*	<AiFillPlusCircle className="text-primary text-2xl" />*/}
						{/*</label>*/}
						{/*<div className="relative mb-[1.25rem]">*/}
						{/*	<input type="file" className="absolute w-full h-full z-10 cursor-pointer" hidden/>*/}
						{/*	<BsFillFileEarmarkFill className="text-xl" />*/}
						{/*</div>*/}
						<div className="flex-1 relative rounded-xl bg-background h-[70%] mb-1 mx-3">
							{selectedFiles ? <div className="w-full h-[200px] p-3 px-6 flex absolute bottom-0 bg-background rounded-xl overflow-x-auto">
									{selectedFiles.map(fileObj => (
										<FileItem key={fileObj.id} setFiles={setFiles} fileObj={fileObj} />
									))}
								</div> :
								<TextareaAutosize
									ref={areaRef}
									value={inputValue}
									onChange={(e) => {
										areaRef.current && areaRef.current.scrollTo({top: areaRef.current.scrollTop + 10, left: 0});
										setInputValue(e.target.value);
									}}
									onKeyDown={e => {
										if(e.key === 'Enter' && !e.shiftKey) {
											e.preventDefault();
											handleSubmitMessage();
										}
										if(e.key === 'Enter' && e.shiftKey) {
											areaRef.current && areaRef.current.scrollTo({top: areaRef.current.scrollTop + 10, left: 0});
										}
									}}
									onHeightChange={e => {
										// 48 is default height of textarea
										setAreaHeight(e - 48);
									}}
									minRows={1}
									maxRows={3}
									placeholder="Type here..."
									className="outline-none caret-primary placeholder-gray-500 resize-none whitespace-pre-wrap active:outline-none placeholder-gray-200 bg-background rounded-xl w-full h-full p-3 px-6 absolute bottom-0"
								/>
								// <input type="text" className="outline-none active:outline-none bg-transparent w-full h-full p-3 px-6" placeholder="Type here..."/>
							}
						</div>
						<svg
							onClick={() => handleSubmitMessage()}
							xmlns="http://www.w3.org/2000/svg"
							width={19}
							height={19}
							fill={colors.primary}
							className="mb-[1.25rem] cursor-pointer"
						>
							<path
								d="M18.57 8.793 1.174.083A.79.79 0 0 0 .32.18.792.792 0 0 0 .059.97l2.095 7.736h8.944v1.584H2.153L.027 18.002A.793.793 0 0 0 .818 19c.124-.001.246-.031.356-.088l17.396-8.71a.791.791 0 0 0 0-1.409Z"
							/>
						</svg>
					</div>
				</>
				{exhausted && <motion.div variants={framerContainer} initial={'hidden'} animate={'show'} className="flex z-10 px-4 w-full absolute h-full flex-col items-center justify-center bg-background bg-opacity-80">
          {/*<Logo width={60} height={60} fill={colors.primaryText}/>*/}
          <Logo width={60} height={60}/>
          <motion.p variants={framerItem()} className="text-3xl font-medium text-white font-giasyr">Arti</motion.p>
          <motion.p variants={framerItem(.5)} className="text-md my-4">Discover the Arti Difference</motion.p>
          <motion.p variants={framerItem()} className="text-sm max-w-lg text-yellow-500 text-center">You have exhausted the free tier limit. Please register to get the full access</motion.p>
          <motion.button variants={framerItem()} className="my-4 cta-button" onClick={() => router.push('#contact')}>Contact us for a Demo</motion.button>
        </motion.div>}
			</div>

			{!miniVersion && adCreative && <RightPane adCreative={adCreative} />}
		</div>
	)
}

export default ArtiBot;
