'use client';

import React, {useEffect, useRef, useState} from 'react';
import Image from 'next/image';
import {SlOptionsVertical} from 'react-icons/sl';
import {AiFillCloseCircle, AiFillFileExclamation, AiFillFileText, AiFillPlusCircle} from 'react-icons/ai';
import {BsCloudDownloadFill, BsFillFileEarmarkPdfFill} from 'react-icons/bs';
import {colors} from '@/config/theme';
import TextareaAutosize from 'react-textarea-autosize';
import {botData, dummyUser} from '@/constants/images';
import Lottie from 'lottie-react';
import tickAnimation from '@/assets/lottie/tick_animation.json';
import typingAnimation from '@/assets/lottie/typing.json';
import {IoIosCopy} from 'react-icons/io';
import {motion} from 'framer-motion'
import {render} from 'react-dom';
import {humanFileSize} from '@/helpers';
import {threshold} from '@/config/thresholds';
import Logo from '@/components/Logo';
import {framerContainer, framerItem} from '@/config/framer-motion';
import {useRouter} from 'next/navigation';
import {LuDownload} from 'react-icons/lu';
import CTAButton from '@/components/CTAButton';
import {MdDelete} from 'react-icons/md';

interface MessageObj {
	id: string;
	is_ai_response: boolean;
	message: string;
	timestamp: string;
	type: 'text' | 'attachment';
	attachments?: FileObject[];
}

const dummyMessages: MessageObj[] = [
	{
		id: '3',
		is_ai_response: false,
		message: '',
		type: 'attachment',
		timestamp: new Date().toISOString(),
		attachments: [
			{
				id: 23,
				name: 'TJk12sdjf',
				size: 2344,
				url: 'https://images.unsplash.com/photo-1543373014-cfe4f4bc1cdf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aGlnaCUyMHJlc29sdXRpb258ZW58MHx8MHx8fDA%3D&w=1000&q=80',
				type: 'image/jpg'
			},
			{
				id: 24,
				name: 'TJks45djf',
				size: 23144,
				url: 'https://images.unsplash.com/photo-1543373014-cfe4f4bc1cdf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aGlnaCUyMHJlc29sdXRpb258ZW58MHx8MHx8fDA%3D&w=1000&q=80',
				type: 'image/jpg'
			},
			{
				id: 25,
				name: 'TJk31sdjf',
				size: 23244,
				url: 'https://images.unsplash.com/photo-1543373014-cfe4f4bc1cdf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aGlnaCUyMHJlc29sdXRpb258ZW58MHx8MHx8fDA%3D&w=1000&q=80',
				type: 'image/jpg'
			},
			{
				id: 26,
				name: 'T2Jksdjf',
				size: 23344,
				url: 'https://images.unsplash.com/photo-1543373014-cfe4f4bc1cdf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aGlnaCUyMHJlc29sdXRpb258ZW58MHx8MHx8fDA%3D&w=1000&q=80',
				type: 'image/jpg'
			}
		]
	},
	{
		id: '1',
		is_ai_response: true,
		message: 'The chat will support a conversation between a user and an AI powered chatbot. For each user message sent, we make an API call to the chatbot to generate the response. At a high level, the chat should support following functionalities:',
		timestamp: new Date().toISOString(),
		type: 'text'
	},
	{
		id: '2',
		is_ai_response: false,
		message: 'Hello there, Tell me something more about it.',
		timestamp: new Date().toISOString(),
		type: 'text'
	}
];

function AttachmentItem({messageItem}: {messageItem: MessageObj}) {

	const renderImage = () => {
		const imagesAttachments = messageItem.attachments?.filter(item => item.type.includes('image/'))
			.map(image => (
				<Image width={1000} height={1000} className="w-full h-64 object-cover" key={image.name + image.size} src={image.url} alt={image.name} />
			))

		if(!imagesAttachments || imagesAttachments.length === 0) return null;

		return (
			<div className="grid grid-cols-3 rounded-xl overflow-hidden gap-1">
				{imagesAttachments}
			</div>
		)
	}

	const renderFile = () => {

		const fileAttachments = messageItem.attachments?.filter(item => !item.type.includes('image/'))
			.map(fileObj => {
				let Icon = <AiFillFileExclamation className="text-6xl text-primary" />;

				if(fileObj.type === 'application/pdf') {
					Icon = <BsFillFileEarmarkPdfFill className="text-6xl text-secondaryText" />
				} else if (fileObj.type === 'text/plain') {
					Icon = <AiFillFileText className="text-6xl text-secondaryText" />
				}

				return (
					<div key={fileObj.name + fileObj.size} className="w-auto flex items-center mb-2 p-4 pr-10 bg-secondaryBackground border border-gray-600 rounded-lg flex-shrink font-diatype">
						{Icon}
						<div className="flex-1 overflow-hidden">
							<p className="text-primary truncate">{fileObj.name}</p>
							<p className="opacity-40 text-xs mt-1">{humanFileSize(fileObj.size)}</p>
						</div>
					</div>
				)
			})

		if(!fileAttachments || fileAttachments.length === 0) return null;

		return (
			<div className="flex flex-col items-start">
				{fileAttachments}
			</div>
		)
	}

	return (
		<div key={messageItem.id} className={'w-full ' + (messageItem.is_ai_response ? '' : 'bg-background')}>
			<div className="flex items-start px-5 py-4 w-full max-w-[800px] mx-auto">
				<Image className="rounded-lg mr-1" width={45} height={45} src={messageItem.is_ai_response ? botData.image : dummyUser.image} alt=""/>
				<div className="ml-3 flex-1">
					{/*<div className="flex items-center mb-2">*/}
					{/*	<h4 className="text-lg mr-5">{messageItem.is_ai_response ? botData.name : dummyUser.name}</h4>*/}
					{/*	<span className="flex-1 text-xs text-secondaryText">10/06/2023 6:25 PM</span>*/}
					{/*	<div className="w-9 h-9 mx-5 flex items-center justify-center relative">*/}

					{/*	</div>*/}
					{/*</div>*/}
					{renderImage()}
					{renderFile()}
				</div>
			</div>
		</div>
	)
}

function MessageItem({messageItem}: {messageItem: MessageObj}) {
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

	if(messageItem.type === 'attachment') {
		return <AttachmentItem messageItem={messageItem} />
	}

	return (
		<div key={messageItem.id} className={'w-full ' + (messageItem.is_ai_response ? '' : 'bg-background')}>
			<div className="flex items-start px-5 py-4 w-full max-w-[800px] mx-auto">
				<Image className="rounded-lg mr-1" width={45} height={45} src={messageItem.is_ai_response ? botData.image : dummyUser.image} alt=""/>
				<div className="ml-3 flex-1">
					{/*	<div className="flex items-center mb-2">*/}
					{/*		<h4 className="text-lg mr-5">{messageItem.is_ai_response ? botData.name : dummyUser.name}</h4>*/}
					{/*		<span className="flex-1 text-xs text-secondaryText">10/06/2023 6:25 PM</span>*/}
					{/*		<div className="w-9 h-9 mx-5 flex items-center justify-center relative">*/}
					{/*			{!showCopyAnimation ? <IoIosCopy className="cursor-pointer justify-self-end text-primary" onClick={() => copyTextToClipboard(messageItem.message)}/> :*/}
					{/*				<Lottie onAnimationEnd={() => setShowCopyAnimation(false)}*/}
					{/*				        className="absolute top-1/2 left-1/2 w-20 h-20 transform -translate-x-1/2 -translate-y-1/2"*/}
					{/*				        animationData={tickAnimation}*/}
					{/*				        loop={false}*/}
					{/*				/>*/}
					{/*			}*/}
					{/*		</div>*/}
					{/*	</div>*/}
					<div className="flex items-start">
						<p className="whitespace-pre-wrap text-md text-primaryText opacity-60 flex-1">
							{messageItem.message}
						</p>
						<div className="w-9 h-9 mx-5 flex items-center justify-center relative">
							{!showCopyAnimation ? <IoIosCopy className="cursor-pointer justify-self-end text-primary" onClick={() => copyTextToClipboard(messageItem.message)}/> :
								<Lottie onAnimationEnd={() => setShowCopyAnimation(false)}
								        className="absolute top-1/2 left-1/2 w-20 h-20 transform -translate-x-1/2 -translate-y-1/2"
								        animationData={tickAnimation}
								        loop={false}
								/>
							}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

interface FileObject {
	id: number;
	url: string;
	type: string;
	name: string;
	size: number;
}
interface FileItemProps {
	fileObj: FileObject;
	setFiles: React.Dispatch<React.SetStateAction<File[] | null>>;
}
const FileItem: React.FC<FileItemProps> = ({fileObj, setFiles}) => {
	console.log('fileObj - ', fileObj);

	if(fileObj.type.includes('image/')) {
		return (
			<div key={fileObj.id} className="h-full w-auto flex-shrink-0 mr-2 rounded-lg overflow-hidden relative border-2 border-secondaryBackground">
				<Image width={100} height={100} className="w-auto h-full" src={fileObj.url} alt="thanks"/>
				<MdDelete className="absolute top-1 right-1 text-primary cursor-pointer" onClick={() => {
					setFiles(e => {
						if(!e) return e;
						return e.filter((c) => c.name !== fileObj.name && c.size !== fileObj.size);
					})
				}}/>
			</div>
		)
	}

	let Icon = <AiFillFileExclamation className="text-6xl text-primary" />;

	if(fileObj.type === 'application/pdf') {
		Icon = <BsFillFileEarmarkPdfFill className="text-6xl text-primary" />
	} else if (fileObj.type === 'text/plain') {
		Icon = <AiFillFileText className="text-6xl text-primary" />
	}

	return (
		<div key={fileObj.id} className="h-full w-auto p-4 flex-shrink-0 flex justify-center flex-col items-center mr-2 rounded-lg overflow-hidden relative border-2 border-secondaryBackground">
			<AiFillCloseCircle className="absolute top-1 right-1 text-primary cursor-pointer" onClick={() => {
				setFiles(e => {
					if(!e) return e;
					return e.filter((c, ind) => ind !== fileObj.id);
				})
			}}/>
			<div className="flex-1 flex justify-center items-center">
				{Icon}
			</div>
			<p className="text-sm opacity-60 max-w-[10rem] text-center line-clamp-2">{fileObj.name}</p>
		</div>
	)
}

export default function ArtiBot({containerClassName = '', miniVersion = false}) {
	const areaRef = useRef<HTMLTextAreaElement>(null);
	const [inputValue, setInputValue] = useState('');
	const [messages, setMessages] = useState<MessageObj[]>(dummyMessages);
	const [areaHeight, setAreaHeight] = useState(0);
	const [isGenerating, setIsGenerating] = useState(false);
	const [files, setFiles] = useState<File[] | null>(null);
	const [selectedFiles, setSelectedFiles] = useState<FileObject[] | null>(null);
	const [exhausted, setExhausted] = useState(false);
	const router = useRouter();

	useEffect(() => {
		if(messages.length === threshold.freeTierMessageLimit && miniVersion) {
			setExhausted(true);
		}
	}, [messages, miniVersion])

	useEffect(() => {
		if(!files) return setSelectedFiles(null);
		console.log('files - ', files);
		const _fs: FileObject[] = [];
		files.map((file, index) => {
			const url = URL.createObjectURL(file);
			_fs.push({id: index, url, type: file.type, size: file.size, name: file.name});
		})
		setSelectedFiles(_fs.length > 0 ? _fs : null);
	}, [files]);
	function handleSubmitMessage() {
		if(exhausted || (!selectedFiles && inputValue.trim().length === 0)) return;

		let messageObj: MessageObj = {
			is_ai_response: false,
			id: Date.now().toString(),
			message: inputValue,
			timestamp: new Date().toISOString(),
			type: 'text'
		}

		if(selectedFiles) {
			messageObj = {
				is_ai_response: false,
				id: Date.now().toString(),
				message: '',
				timestamp: new Date().toISOString(),
				type: 'attachment',
				attachments: selectedFiles
			}
		}

		setInputValue('');
		setFiles(null);

		setMessages(c => ([messageObj, ...c]));

		// Simulating the AI response
		setTimeout(() => {
			setIsGenerating(true);
			setTimeout(() => {
				setIsGenerating(false);
				const messageObj: MessageObj = {
					is_ai_response: true,
					id: Date.now().toString(),
					message: 'This is a dummy response generated by the Arti Robot. Subscribe for more.',
					timestamp: new Date().toISOString(),
					type: 'text'
				}

				setMessages(c => ([messageObj, ...c]));
			}, 3000)
		}, 500)
	}

	return (
		<div className={'bg-secondaryBackground border-2 border-primary relative flex flex-col font-diatype overflow-hidden ' + (containerClassName)}>
			<>
				<div className="flex justify-center h-16 py-2 px-6 box-border items-center bg-secondaryBackground shadow-[0px_1px_1px_0px_#000]">
					{/*<div className="flex items-center">*/}
					{/*	<Image width={40} height={40} className="rounded-full mr-4" src="https://ui-avatars.com/api/?name=Arti+Bot&size=64&background=random&rounded=true" alt=""/>*/}
					<h3 className="text-lg">Arti AI</h3>
					{/*</div>*/}
					{/*<div>*/}
					{/*	<SlOptionsVertical />*/}
					{/*</div>*/}
				</div>
				<div className={'flex-1 flex flex-col-reverse overflow-auto ' + (miniVersion ? 'min-h-[20em] max-h-[40em]' : '')}>
					{isGenerating && <div className="w-14 h-16 mx-5 flex flex-end">
            <Lottie animationData={typingAnimation} loop={true} />
          </div>}
					{
						messages.map(messageItem => (
							<MessageItem key={messageItem.id} messageItem={messageItem} />
						))
					}
				</div>
				<div className="flex w-full max-w-[900px] mx-auto h-[4.5rem] relative items-end pb-2 px-3 bg-secondaryBackground" style={{height: selectedFiles ? "220px" : areaHeight > 0 ? `calc(4.5rem + ${areaHeight}px)` : '4.5rem'}}>
					{messages.length >= threshold.getAdNowButtonAfter && <motion.button whileHover={{
						scale: 1.05,
						transition: { duration: 0.2 },
					}} whileTap={{scale: 0.98}} initial={{y: -10, opacity: 0}} animate={{y: 0, opacity: 1}}
					                transition={{type: 'spring', damping: 10}}
					                className="cta-button absolute flex items-center text-lg font-diatype -top-20 right-20">
						<LuDownload style={{fontSize: '22px'}}/>
						<span className="ml-5">Get Ad Now</span>
					</motion.button>}
					<label htmlFor="file" className="cursor-pointer mr-2 mb-[1.15rem]">
						<input onChange={e => {
							const files = e.currentTarget.files;
							setFiles(c => {
								if(!files) return c;
								console.log('Array.from(e.currentTarget.files) - ', Array.from(files));
								const filesArr = Array.from(files);
								if(!c) return filesArr;
								// @ts-ignore
								return [...c, ...filesArr];
							});
						}} type="file" multiple accept="image/*, .pdf, .docx, .doc, .txt" id="file" className="hidden"/>
						<AiFillPlusCircle className="text-primary text-2xl" />
					</label>
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
									if(e.key === 'Enter') {
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
								className="outline-none resize-none whitespace-pre-wrap active:outline-none placeholder-gray-200 bg-background rounded-xl w-full h-full p-3 px-6 absolute bottom-0"
							/>
							// <input type="text" className="outline-none active:outline-none bg-transparent w-full h-full p-3 px-6" placeholder="Type here..."/>
						}
					</div>
					<svg
						onClick={handleSubmitMessage}
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
			{exhausted && <motion.div variants={framerContainer} initial={'hidden'} animate={'show'} className="flex z-10 w-full absolute h-full flex-col items-center justify-center bg-background bg-opacity-75">
				<Logo width={60} height={60} fill={colors.primaryText}/>
				<motion.p variants={framerItem()} className="text-3xl font-medium text-white font-giasyr">Arti</motion.p>
				<motion.p variants={framerItem(.5)} className="text-md my-4">Discover the Arti Difference</motion.p>
        <motion.p variants={framerItem()} className="text-sm max-w-lg text-yellow-500 text-center">You have exhausted the free tier limit. Please register to get the full access</motion.p>
				<motion.button variants={framerItem()} className="my-4 cta-button" onClick={() => router.push('#contact')}>Register</motion.button>
			</motion.div>}
		</div>
	)
}
