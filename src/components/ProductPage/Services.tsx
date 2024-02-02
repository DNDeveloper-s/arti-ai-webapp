'use client';

import React, {FC, SetStateAction, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {servicesData} from '@/constants/productPageData/services';
import Link from 'next/link';
import Logo from '@/components/Logo';
import TextareaAutosize from 'react-textarea-autosize';
import {colors} from '@/config/theme';
import {AnimatePresence, motion} from 'framer-motion';
import {framerContainer} from '@/config/framer-motion';
import Image from 'next/image';
import WavingHand from '@/assets/images/waving-hand.webp';
import {waitWithCleanup} from '@/helpers';
import {ChatGPTMessageObj, ChatGPTRole} from '@/interfaces/IArtiBot';
import ChatGPTMessageItem, {
	ChatGPTMessageCreatingAd,
	ChatGPTMessageGeneratingAnimation
} from '@/components/ArtiBot/MessageItems/ChatGPTMessageItem';
import ObjectId from 'bson-objectid';
import LaptopImage from '@/assets/images/mac-3.png';
import MacImage from '@/assets/images/mac-1.png';
import IphoneImage from '@/assets/images/iphone_2.png';
import RightPane from '@/components/ArtiBot/RIghtPane/RightPane';
import {IAdCreative} from '@/interfaces/IAdCreative';
import useMounted from '@/hooks/useMounted';
import GetAdButton from '@/components/ArtiBot/GetAdButton';
import {Mock, mockProductOverviewData as mock, screens, ViewScreen} from '@/constants/servicesData';
import {carouselImage3} from '@/assets/images/carousel-images';
import {AiOutlineCaretDown} from 'react-icons/ai';
import CanvasJSReact from '@canvasjs/react-charts';
import CTAButton from '@/components/CTAButton';
import AppLoader from '@/components/AppLoader';
import Loader from '@/components/Loader';

const CanvasJS = CanvasJSReact.CanvasJS;
const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const options = {
	theme: 'dark1',
	animationEnabled: true,
	title:{
		// text: "Monthly Sales - 2017"
	},
	axisX: {
		valueFormatString: "MMM"
	},
	axisY: {
		gridThickness: 0,
		// title: "Sales (in USD)",
	},
	data: [{
		yValueFormatString: "$#,###",
		xValueFormatString: "MMMM",
		type: "spline",
		dataPoints: [
			{ x: new Date(2017, 0), y: 0.7 },
			{ x: new Date(2017, 1), y: 1.2 },
			{ x: new Date(2017, 2), y: 0.85 },
			{ x: new Date(2017, 3), y: 1.9 },
			{ x: new Date(2017, 4), y: 1.3 },
			{ x: new Date(2017, 5), y: 2.4 },
			{ x: new Date(2017, 6), y: 2 },
			{ x: new Date(2017, 7), y: 2.8 },
		]
	}]
}

interface Props {
	id: number | string;
	title: string;
	description: string;
	style?: any;
	handleIdInView?: (id: Props['id']) => void;
}

const ServiceCard: React.FC<Props> = ({id, title, description, handleIdInView = (id: Props['id']) => {}}) => {
	const [expand, setExpand] = useState(false);

	const nodeRef = useCallback((node: any) => {
		if(node !== null) {
			const observer = new IntersectionObserver(entries => {
				entries.forEach(entry => {
					if(entry.isIntersecting) {
						// console.log('entries - ', entries);
						handleIdInView(id)
						entry.target.classList.add('animate-fadeInUp');
						// observer.unobserve(entry.target);
					} else {
						// entry.target.classList.remove('animate-fadeInUp');
					}
				})
			}, {
				root: null,
				rootMargin: '0px',
				threshold: 0.8
			})
			observer.observe(node);
		}
	}, [])

	return (
		<div className="h-screen flex flex-col items-center justify-center">
			<div ref={nodeRef} data-id={id}>
				<h1 className="lg:text-[65px] 2xl:text-[105px] text-white lg:leading-[70px] 2xl:leading-[105px] font-gilroyBold tracking-[-1.15px]">{title}</h1>
				<p className="font-gilroyRegular text-white text-opacity-40 text-[18px]">{description}</p>
			</div>
		</div>
	)
}

interface ArtiChatDemoProps {
	messages: ChatGPTMessageObj[];
	handleEnd?: () => void;
	isAdCreative?: boolean;
	isMetric?: boolean;
	viewScreen: ViewScreen;
	isInView: boolean;
	sm?: boolean;
	dimensions: {
		width: number,
		height: number
	}
}

export const ArtiChatDemo = {
	Chat: function({viewScreen, sm, messages, dimensions, isInView}: ArtiChatDemoProps) {
		return <Legacy_ArtiChatDemo sm={sm} viewScreen={viewScreen} dimensions={dimensions} messages={messages} isAdCreative={false} isInView={isInView} handleEnd={() => {}}/>
	},
	AdCreative: function({viewScreen, sm, messages, dimensions, isInView}: ArtiChatDemoProps) {
		return <Legacy_ArtiChatDemo sm={sm} viewScreen={viewScreen} dimensions={dimensions} messages={messages} isAdCreative={true} isInView={isInView} handleEnd={() => {}}/>
	},
	Metrics: function({viewScreen, sm, messages, dimensions, isInView}: ArtiChatDemoProps) {
		return <Legacy_ArtiChatDemo sm={sm} viewScreen={viewScreen} dimensions={dimensions} messages={messages} isAdCreative={false} isMetric={true} isInView={isInView} handleEnd={() => {}}/>
	}
}

const Legacy_ArtiChatDemo: FC<ArtiChatDemoProps> = ({viewScreen, dimensions, sm, isMetric, isInView, messages: _messages, isAdCreative, handleEnd}) => {
	const [inputValue, setInputValue] = useState('');
	const [messages, setMessages] = useState<ChatGPTMessageObj[]>([..._messages.slice(0, 3)]);
	const [isGenerating, setIsGenerating] = useState(false);
	const chunksRef = useRef('');
	const doneRef = useRef(false);
	const [showGetAdNowButton, setShowGetAdNowButton] = useState(false);
	const [isGeneratingAd, setIsGeneratingAd] = useState(false);
	const [publishingAd, setPublishingAd] = useState(false);
	const [adCreative, setAdCreative] = useState<IAdCreative | null>(null);
	const areaRef = useRef<HTMLTextAreaElement>(null);
	const intervalIds = useRef<NodeJS.Timeout[]>([]);
	const timeoutIds = useRef<NodeJS.Timeout[]>([]);
	const rightPaneRef = useRef<HTMLDivElement>(null);
	const [showMetric, setShowMetric] = useState(false);
	const mounted = useMounted();
	const iphoneImageRef = useRef<HTMLImageElement>(null);

	const wait = useCallback(async (ms: number) => {
		const {timeoutId, promise} = waitWithCleanup(ms);
		timeoutId && timeoutIds.current.push(timeoutId);
		return promise;
	}, []);

	async function typeMessage(msg: string) {
		return new Promise((resolve) => {
			let i = 0;
			let intervalId: NodeJS.Timeout;
			function handleInterval() {
				areaRef.current && areaRef.current.scrollTo(0, 4000);
				i += 1;
				setInputValue(msg.slice(0, i));
				if(i >= msg.length) {
					clearInterval(intervalId);
					return resolve(true);
				}
			}
			intervalId = setInterval(handleInterval, 40);
			intervalIds.current.push(intervalId);
		})
	}

	const sendUserMessage = useCallback(async (msg: string) => {
		await typeMessage(msg);

		setInputValue('');
		setMessages((prev: any) => [...prev, {
			id: ObjectId().toHexString(),
			role: ChatGPTRole.USER,
			content: msg,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		}])
		setIsGenerating(true);
	}, [])

	const printAiMessage = useCallback(async (msg: string) => {
		await wait(1000);
		setIsGenerating(false);

		chunksRef.current = '';
		doneRef.current = false;
		setMessages((prev: any) => [...prev, {
			id: ObjectId().toHexString(),
			role: ChatGPTRole.ASSISTANT,
			content: '',
			generating: true
		}])

		chunksRef.current = msg;
		doneRef.current = true;

		await wait(18 * msg.length);
	}, [wait]);

	const demo = useCallback(async () => {
		console.log('demo called - ', isAdCreative);
		setMessages(isAdCreative ? [..._messages.slice(0, 6)] as any : []);
		setAdCreative(null);
		setShowGetAdNowButton(false);
		setIsGeneratingAd(false);
		setInputValue('');
		setIsGenerating(false);
		setShowMetric(false);
		setPublishingAd(false);

		if(isMetric) {
			setAdCreative(mock.adCreative);
			// return;
			await wait(1500);

			setPublishingAd(true);

			await wait(2000);

			setPublishingAd(false);

			setShowMetric(true);

			await wait(5000);
			// return;
			return await demo();
		}

		if(!(_messages?.length > 0)) return;


		if(!isAdCreative) {
			// return;
			// return await demo();
			for (let i = isAdCreative ? 6 : 0; i < (isAdCreative ? _messages.length - 1 : _messages.length); i++) {
				const message = _messages[i];
				if(message.role === ChatGPTRole.USER) {
					await sendUserMessage(message.content as string);
				} else {
					await printAiMessage(message.content as string);
				}
			}

			setShowGetAdNowButton(true);

			await wait(1000);

			// return handleEnd();
			// eslint-disable-next-line react-hooks/exhaustive-deps
			intervalIds.current.forEach(clearInterval);
			// eslint-disable-next-line react-hooks/exhaustive-deps
			timeoutIds.current.forEach(clearTimeout);

			return await demo();
		}

		// await wait(1000);
		//
		// setIsGeneratingAd(true);
		//
		// await wait (2500);
		//
		// setIsGeneratingAd(false);
		// setMessages(c => [
		// 	...c,
		// 	{
		// 		id: ObjectId().toHexString(),
		// 		role: ChatGPTRole.ASSISTANT,
		// 		content: (_messages ?? mock.adCreativeMessages).at(-1).content,
		// 	}
		// ]);
		setAdCreative(mock.adCreative);

		await wait(10000);

		// return handleEnd();
		// eslint-disable-next-line react-hooks/exhaustive-deps
		intervalIds.current.forEach(clearInterval);
		// eslint-disable-next-line react-hooks/exhaustive-deps
		timeoutIds.current.forEach(clearTimeout);

		return await demo();
	}, [_messages, isAdCreative, wait, sendUserMessage, printAiMessage])

	// const runRef = useRef(false);
	useEffect(() => {
		demo()

		return () => {
			// eslint-disable-next-line react-hooks/exhaustive-deps
			intervalIds.current.forEach(clearInterval);
			// eslint-disable-next-line react-hooks/exhaustive-deps
			timeoutIds.current.forEach(clearTimeout);
		}
	}, [demo])

	const messageList = useMemo(() => {
		return messages;
	}, [messages]);

	const mockState = useMemo(() => {
		return new Mock(viewScreen);
	}, [viewScreen]);

	let content = (
		<div style={{display: !isInView ? 'none' : 'flex'}}>
			{mounted && adCreative && <div className="absolute" style={{
				// width: sm ? 'calc((100% - 42px) * 0.86)' : `${(window.innerHeight - 60) * 0.8 * 0.46}px`,
				// height: sm ? 'calc(100% - 42px)' : `${(window.innerHeight - 60) * 0.8}px`,
				width: dimensions.width,
				height: dimensions.height,
				zoom: 1,
				top: '50%',
				left: '49.8%',
				borderRadius: '20px',
				overflow: 'hidden',
				border: 'none',
				// aspectRatio: 0.46,
				transform: 'translate(-50%, -50%)',
			}}>
        <div ref={rightPaneRef}><RightPane mock={mockState} adCreative={mock.adCreative} style={{position: 'relative', zoom: 1, paddingLeft: 0}}/>
        </div>
      </div>}
			{!adCreative && <div style={{
				// width: 'unset',
				// height: 'calc(100% - 42px)',
				width: dimensions.width,
				height: dimensions.height,
				zoom: 1,
				top: '50%',
				left: '49.8%',
				borderRadius: '22px',
				overflow: 'hidden',
				border: 'none',
				aspectRatio: 0.46,
				transform: 'translate(-50%, -50%)',
			}} className="w-[443px] h-[263px] absolute top-[99px] left-[53px] rounded-[3px] bg-white bg-opacity-10 border-primary border overflow-hidden">
        <div className={`flex h-full overflow-hidden`}>
          <div className={'bg-secondaryBackground flex-1 relative flex flex-col font-diatype overflow-hidden'}>
            <>
              <div
                className="flex justify-between h-auto py-2 px-6 box-border items-center bg-secondaryBackground shadow-[0px_1px_1px_0px_#000]"
              >
                <Link href="/" className="flex justify-center items-center">
                  <Logo width={35} className="mr-2" height={35}/>
                  <h3 className="text-lg">Arti AI</h3>
                </Link>
              </div>
              <AnimatePresence mode="wait">
                <div
                  className={'flex-1 flex flex-col-reverse overflow-auto' + (showGetAdNowButton ? ' pb-9 md:pb-10' : '')}>
									{/*<ChatGPTMessageCreatingAd/>*/}
									{isGeneratingAd && <ChatGPTMessageCreatingAd/>}
									{/*<div className="text-white whitespace-pre-wrap">*/}
									{/*	{msg}*/}
									{/*</div>*/}
									{isGenerating && <ChatGPTMessageGeneratingAnimation/>}
                  <motion.div variants={framerContainer} animate="show" initial="hidden" exit="hidden">
										{/*{conversationType && <ChatGPTMessageWelcomeMessage type={conversationType}/>}*/}
										{/*{*/}
										{messageList.map((messageItem: ChatGPTMessageObj) => (
											<ChatGPTMessageItem
												size={30}
												chunksRef={chunksRef}
												doneRef={doneRef}
												isGenerating={isGenerating}
												// conversationId={params.conversation_id as string}
												isMock={true}
												key={messageItem.id}
												setMessages={setMessages}
												messageItem={messageItem}
												disableCopy
											/>
										))}
										{/*}*/}
                  </motion.div>
                  <div className="w-full max-w-[900px] mx-auto px-3 flex justify-center items-center my-3">
                    <div className="h-0.5 mr-5 flex-1 bg-gray-800"/>
                    <div
                      className="flex justify-center whitespace-nowrap items-center font-light text-xs font-diatype text-white text-opacity-50">
                      <span>Hey</span>
                      <Image width={20} height={20} src={WavingHand} alt="Arti AI welcomes you"/>
                      <span>, How can Arti Ai help you?</span>
                    </div>
                    <div className="h-0.5 ml-5 flex-1 bg-gray-800"/>
                  </div>
                </div>
              </AnimatePresence>
              <div
                className="flex w-full max-w-[900px] gap-3 mx-auto h-auto relative items-end pb-2 px-3 bg-secondaryBackground">
								{(showGetAdNowButton && !isGeneratingAd) && <GetAdButton
                  adGenerated={Boolean(adCreative)}
                  onClick={async (setLoading: any) => {
										// await handleGetAdNowButton();
										setLoading(false);
									}}
                />}
                <div
                  className="flex w-full max-w-[900px] mb-[-7px] mx-auto h-auto relative items-end bg-secondaryBackground"
                >
                  <div className="w-full">
                    <TextareaAutosize
                      value={inputValue}
                      ref={areaRef}
                      onChange={(e) => {
												areaRef.current && areaRef.current.scrollTo({top: 20000, left: 0});
												setInputValue(e.target.value);
											}}
                      minRows={1}
                      maxRows={4}
                      placeholder="Type here..."
                      className="relative text-[11px] outline-none caret-primary resize-none whitespace-pre-wrap active:outline-none placeholder-gray-200 bg-background rounded-xl w-full h-full p-3 px-4 bottom-0"
                    />
                  </div>
                </div>
                <div className="h-[48px] flex justify-center items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={19}
                    height={19}
                    fill={colors.primary}
                    className="cursor-pointer"
                  >
                    <path
                      d="M18.57 8.793 1.174.083A.79.79 0 0 0 .32.18.792.792 0 0 0 .059.97l2.095 7.736h8.944v1.584H2.153L.027 18.002A.793.793 0 0 0 .818 19c.124-.001.246-.031.356-.088l17.396-8.71a.791.791 0 0 0 0-1.409Z"
                    />
                  </svg>
                </div>
              </div>
            </>
          </div>
        </div>
      </div>}
		</div>
	)

	/** Metric View **/
	if (isMetric) {
		content = (
			<div style={{display: !isInView ? 'none' : 'flex'}}>
				{mounted && !showMetric && adCreative && <div className="absolute" style={{
					// width: sm ? 'calc((100% - 42px) * 0.86)' : `${(window.innerHeight - 60) * 0.8 * 0.46}px`,
					// height: sm ? 'calc(100% - 42px)' : `${(window.innerHeight - 60) * 0.8}px`,
					width: dimensions.width,
					height: dimensions.height,
					zoom: 1,
					top: '50%',
					left: '49.8%',
					borderRadius: '20px',
					overflow: 'hidden',
					border: 'none',
					// aspectRatio: 0.46,
					transform: 'translate(-50%, -50%)',
				}}>
          <div ref={rightPaneRef}>
            <RightPane mock={mockState} adCreative={mock.adCreative} style={{opacity: publishingAd ? 0.3 : 1, filter: `blur(${publishingAd ? 1 : 0}px)`, position: 'relative', zoom: 1, paddingLeft: 0}}/>
            <div className={'w-full flex justify-center items-center absolute bottom-2 left-1/2 -translate-x-1/2 z-10'}>
              <CTAButton className={'px-0 py-0 flex justify-center items-center h-8 w-36 gap-3 rounded-lg'}>
								{publishingAd ? <>
									<Loader className={'w-5 h-5'} />
									<span className={'text-[12px]'}>Publishing Ad...</span>
								</> : <>
									<span className={'text-[12px]'}>Publish Ad</span>
								</>}
              </CTAButton>
            </div>
          </div>
        </div>}
				{showMetric && <div style={{
					// width: 'unset',
					// height: 'calc(100% - 42px)',
					width: dimensions.width,
					height: dimensions.height,
					zoom: 1,
					top: '50%',
					left: '49.8%',
					borderRadius: '22px',
					overflow: 'hidden',
					border: 'none',
					aspectRatio: 0.46,
					transform: 'translate(-50%, -50%)',
				}} className="w-[443px] h-[263px] absolute top-[99px] left-[53px] rounded-[3px] bg-white bg-opacity-10 border-primary border overflow-hidden">
          <div className={`flex h-full overflow-hidden`}>
            <div className={'bg-secondaryBackground flex-1 relative flex flex-col font-diatype overflow-hidden'}>
              <div className={'flex px-3 items-center py-2'}>
                <h2 className="text-xl font-medium font-diatype">Campaign</h2>
              </div>

							{/* Campaign Title */}
              <div className={'flex px-3 py-1.5 gap-2.5 items-center'}>
                <div className={'w-14 h-14 rounded flex justify-center items-center border-2 border-white border-opacity-25'}>
                  <Image className={'object-cover w-full h-full rounded'} src={carouselImage3} alt="Carousel Image" />
                </div>
                <div className={'flex flex-col justify-center gap-1'}>
                  <h3 className={'text-[13px] font-semibold text-primary'}>Say Goodbye to Back Pain</h3>
                  <div className={'flex items-center gap-2'}>
                    <div className={'w-1 h-1 rounded-full bg-green-300'} />
                    <span className={'text-[9px]'}>Active</span>
                  </div>
                </div>
              </div>

							{/*Separator*/}
              <div className={'w-full h-1 bg-black my-1'} />

							{/*Campaign Meta Data*/}
              <div className={'px-3.5 pb-2'}>
                <h4 className={'text-[15px] font-semibold mb-2 text-white'}>Results</h4>

                <div className={'flex flex-col'}>
                  <div className={'flex justify-between items-center'}>
                    <div>
                      <span className={'text-[10px]'}>Link Clicks</span>
                    </div>
                    <div>
                      <span className={'text-[10px]'}>1,025</span>
                    </div>
                  </div>
                  <div className={'flex justify-between items-center'}>
                    <div>
                      <span className={'text-[10px]'}>Cost per Link Click</span>
                    </div>
                    <div>
                      <span className={'text-[10px]'}>$0.79</span>
                    </div>
                  </div>
                  <div className={'flex justify-between items-center'}>
                    <div>
                      <span className={'text-[10px]'}>Amount spent</span>
                    </div>
                    <div>
                      <span className={'text-[10px]'}>$812.74</span>
                    </div>
                  </div>
                </div>

                <div className={'flex flex-col mt-2'}>
                  <div className={'flex justify-between items-center'}>
                    <div>
                      <span className={'text-[10px]'}>Reach</span>
                    </div>
                    <div>
                      <span className={'text-[10px]'}>31,038</span>
                    </div>
                  </div>
                  <div className={'flex justify-between items-center'}>
                    <div>
                      <span className={'text-[10px]'}>Impressions</span>
                    </div>
                    <div>
                      <span className={'text-[10px]'}>129,073</span>
                    </div>
                  </div>
                </div>

                <div className={'mt-2 flex justify-center items-center gap-1'}>
                  <AiOutlineCaretDown />
                  <span className={'text-[10px]'}>Show more</span>
                </div>

              </div>

							{/*Separator*/}
              <div className={'w-full h-2 bg-black my-1'} />

							{/*Graph*/}
              <div className={'px-2 flex flex-1 justify-evenly flex-col gap-2'}>
                <h4 className={'text-[12px]'}>Cost per result is 14% lower than similar ad sets from peers</h4>
                <div>
                  <CanvasJSChart
                    options={options}
                    containerProps={{height: '100px'}}
                  />
                </div>
              </div>

            </div>
          </div>
        </div>}
			</div>
		)
	}

	return content;
	// return (
	// 	// <div className={"absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] md:w-[550px] flex justify-center items-center" + (sm ? ' h-[70vh]' : ' h-[80vh]')} style={{display: !isInView ? 'none' : 'flex', opacity: viewScreen === ViewScreen.MOBILE ? 1 : 0}}>
	// 	// 	<Image className="w-auto h-full max-w-none" src={IphoneImage} ref={iphoneImageRef} alt="Iphone Image" />
	// 		content
	// 	// </div>
	// )

	// return (
	// 	<>
	// 		<div className={"absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] md:w-[550px] h-auto"} style={{display: !isInView ? 'none' : 'block', opacity: viewScreen === ViewScreen.LAPTOP ? 1 : 0}}>
	// 			<Image src={MacImage} alt="Iphone Image" />
	// 			<div className="w-[427px] h-[285px] absolute top-[29px] left-[61px] rounded-[12px_12px_0_0] bg-white bg-opacity-10 border-primary border overflow-hidden">
	// 				<div className={`flex h-full overflow-hidden`}>
	// 					<div className={'bg-secondaryBackground flex-1 relative flex flex-col font-diatype overflow-hidden'}>
	// 						<>
	// 							<div
	// 								className="flex justify-between h-auto py-2 px-6 box-border items-center bg-secondaryBackground shadow-[0px_1px_1px_0px_#000]"
	// 								style={{zoom: 0.5}}
	// 							>
	// 								<Link href="/" className="flex justify-center items-center">
	// 									<Logo width={35} className="mr-2" height={35}/>
	// 									<h3 className="text-lg">Arti AI</h3>
	// 								</Link>
	// 							</div>
	// 							<AnimatePresence mode="wait">
	// 								<div
	// 									style={{zoom: 0.5}}
	// 									className={'flex-1 flex flex-col-reverse overflow-auto' + (showGetAdNowButton ? ' pb-9 md:pb-10' : '')}>
	// 									{/*<ChatGPTMessageCreatingAd/>*/}
	// 									{isGeneratingAd && <ChatGPTMessageCreatingAd/>}
	// 									{/*<div className="text-white whitespace-pre-wrap">*/}
	// 									{/*	{msg}*/}
	// 									{/*</div>*/}
	// 									{isGenerating && <div className="w-16 h-8">
	// 										<ChatGPTMessageGeneratingAnimation mock={mockState}/>
	// 									</div>}
	// 									{/*{isGenerating && <ChatGPTMessageGeneratingAnimation mock={mockState}/>}*/}
	// 									<motion.div variants={framerContainer} animate="show" initial="hidden" exit="hidden">
	// 										{/*{conversationType && <ChatGPTMessageWelcomeMessage type={conversationType}/>}*/}
	// 										{/*{*/}
	// 										{messageList.map((messageItem: ChatGPTMessageObj) => (
	// 											<ChatGPTMessageItem
	// 												chunksRef={chunksRef}
	// 												doneRef={doneRef}
	// 												isGenerating={isGenerating}
	// 												// conversationId={params.conversation_id as string}
	// 												isMock={true}
	// 												key={messageItem.id}
	// 												setMessages={setMessages}
	// 												messageItem={messageItem}
	// 												disableCopy
	// 											/>
	// 										))}
	// 										{/*}*/}
	// 									</motion.div>
	// 									<div className="w-full max-w-[900px] mx-auto px-3 flex justify-center items-center my-3">
	// 										<div className="h-0.5 mr-5 flex-1 bg-gray-800"/>
	// 										<div
	// 											className="flex justify-center items-center font-light text-sm font-diatype text-white text-opacity-50">
	// 											<span>Hey</span>
	// 											<Image width={20} height={20} src={WavingHand} alt="Arti AI welcomes you"/>
	// 											<span>, How can Arti Ai help you?</span>
	// 										</div>
	// 										<div className="h-0.5 ml-5 flex-1 bg-gray-800"/>
	// 									</div>
	// 								</div>
	// 							</AnimatePresence>
	// 							<div
	// 								style={{zoom: 0.5}}
	// 								className="flex w-full max-w-[900px] mx-auto h-auto pt-2 relative items-end pb-2 px-3 bg-secondaryBackground">
	// 								{/*{(showGetAdNowButton && !isGeneratingAd) && <GetAdButton*/}
	// 								{/*{(<GetAdButton*/}
	// 								{/*	mock={mockState}*/}
  //                 {/*  adGenerated={Boolean(adCreative)}*/}
  //                 {/*  onClick={async (setLoading: any) => {*/}
	// 								{/*		// await handleGetAdNowButton();*/}
	// 								{/*		setLoading(false);*/}
	// 								{/*	}}*/}
  //                 {/*/>)}*/}
	// 								<div className={'flex-1 relative rounded-xl bg-background h-[70%] mb-1 mr-3'}>
	// 									<TextareaAutosize
	// 										value={inputValue}
	// 										ref={areaRef}
	// 										onChange={(e) => {
	// 											areaRef.current && areaRef.current.scrollTo({top: 20000, left: 0});
	// 											setInputValue(e.target.value);
	// 										}}
	// 										minRows={1}
	// 										maxRows={4}
	// 										placeholder="Type here..."
	// 										className="outline-none caret-primary resize-none whitespace-pre-wrap active:outline-none placeholder-gray-200 bg-background rounded-xl w-full h-full p-3 px-4 absolute bottom-0"
	// 									/>
	// 								</div>
	// 								<svg
	// 									xmlns="http://www.w3.org/2000/svg"
	// 									width={19}
	// 									height={19}
	// 									fill={colors.primary}
	// 									className="mb-[1.25rem] cursor-pointer"
	// 								>
	// 									<path
	// 										d="M18.57 8.793 1.174.083A.79.79 0 0 0 .32.18.792.792 0 0 0 .059.97l2.095 7.736h8.944v1.584H2.153L.027 18.002A.793.793 0 0 0 .818 19c.124-.001.246-.031.356-.088l17.396-8.71a.791.791 0 0 0 0-1.409Z"
	// 									/>
	// 								</svg>
	// 							</div>
	// 						</>
	// 					</div>
	// 					{adCreative && <div ref={rightPaneRef}><RightPane mock={mockState} adCreative={adCreative} style={{zoom: 0.41, position: 'relative'}}/></div>}
	// 				</div>
	// 			</div>
	// 		</div>
	// 		<div className={"absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] md:w-[550px] h-auto"} style={{display: !isInView ? 'none' : 'block', opacity: viewScreen === ViewScreen.SCREEN ? 1 : 0}}>
	// 			<Image src={LaptopImage} alt="Iphone Image" />
	// 			<div className="w-[443px] h-[263px] absolute top-[99px] left-[53px] rounded-[3px] bg-white bg-opacity-10 border-primary border overflow-hidden">
	// 				<div className={`flex h-full overflow-hidden`}>
	// 					<div className={'bg-secondaryBackground flex-1 relative flex flex-col font-diatype overflow-hidden'}
	// 					     // style={{zoom: 0.55}}
	// 					>
	// 						<>
	// 							<div
	// 								className="flex justify-between h-auto py-2 px-6 box-border items-center bg-secondaryBackground shadow-[0px_1px_1px_0px_#000]"
	// 								style={{zoom: 0.5}}
	// 							>
	// 								<Link href="/" className="flex justify-center items-center">
	// 									<Logo width={35} className="mr-2" height={35}/>
	// 									<h3 className="text-lg">Arti AI</h3>
	// 								</Link>
	// 							</div>
	// 							<AnimatePresence mode="wait">
	// 								<div
	// 									style={{zoom: 0.5}}
	// 									className={'flex-1 flex flex-col-reverse overflow-auto' + (showGetAdNowButton ? ' pb-9 md:pb-10' : '')}>
	// 									{/*<ChatGPTMessageCreatingAd/>*/}
	// 									{isGeneratingAd && <ChatGPTMessageCreatingAd/>}
	// 									{/*<div className="text-white whitespace-pre-wrap">*/}
	// 									{/*	{msg}*/}
	// 									{/*</div>*/}
	// 									{isGenerating && <ChatGPTMessageGeneratingAnimation/>}
	// 									<motion.div variants={framerContainer} animate="show" initial="hidden" exit="hidden">
	// 										{/*{conversationType && <ChatGPTMessageWelcomeMessage type={conversationType}/>}*/}
	// 										{/*{*/}
	// 										{messageList.map((messageItem: ChatGPTMessageObj) => (
	// 											<ChatGPTMessageItem
	// 												chunksRef={chunksRef}
	// 												doneRef={doneRef}
	// 												isGenerating={isGenerating}
	// 												// conversationId={params.conversation_id as string}
	// 												isMock={true}
	// 												key={messageItem.id}
	// 												setMessages={setMessages}
	// 												messageItem={messageItem}
	// 												disableCopy
	// 											/>
	// 										))}
	// 										{/*}*/}
	// 									</motion.div>
	// 									<div className="w-full max-w-[900px] mx-auto px-3 flex justify-center items-center my-3">
	// 										<div className="h-0.5 mr-5 flex-1 bg-gray-800"/>
	// 										<div
	// 											className="flex justify-center items-center font-light text-sm font-diatype text-white text-opacity-50">
	// 											<span>Hey</span>
	// 											<Image width={20} height={20} src={WavingHand} alt="Arti AI welcomes you"/>
	// 											<span>, How can Arti Ai help you?</span>
	// 										</div>
	// 										<div className="h-0.5 ml-5 flex-1 bg-gray-800"/>
	// 									</div>
	// 								</div>
	// 							</AnimatePresence>
	// 							<div
	// 								style={{zoom: 0.5}}
	// 								className="flex w-full max-w-[900px] mx-auto h-[4.5rem] relative items-end pb-2 px-3 bg-secondaryBackground">
	// 								{(showGetAdNowButton && !isGeneratingAd) && <GetAdButton
  //                   adGenerated={Boolean(adCreative)}
  //                   onClick={async (setLoading: any) => {
	// 										// await handleGetAdNowButton();
	// 										setLoading(false);
	// 									}}
  //                 />}
	// 								{/*<label htmlFor="file" className="cursor-pointer mr-2 mb-[1.15rem]">*/}
	// 								{/*	<input onChange={e => {*/}
	// 								{/*		const files = e.currentTarget.files;*/}
	// 								{/*		setFiles(c => {*/}
	// 								{/*			if(!files) return c;*/}
	// 								{/*			console.log('Array.from(e.currentTarget.files) - ', Array.from(files));*/}
	// 								{/*			const filesArr = Array.from(files);*/}
	// 								{/*			if(!c) return filesArr;*/}
	// 								{/*			// @ts-ignore*/}
	// 								{/*			return [...c, ...filesArr];*/}
	// 								{/*		});*/}
	// 								{/*	}} type="file" multiple accept="image/*, .pdf, .docx, .doc, .txt" id="file" className="hidden"/>*/}
	// 								{/*	<AiFillPlusCircle className="text-primary text-2xl" />*/}
	// 								{/*</label>*/}
	// 								{/*<div className="relative mb-[1.25rem]">*/}
	// 								{/*	<input type="file" className="absolute w-full h-full z-10 cursor-pointer" hidden/>*/}
	// 								{/*	<BsFillFileEarmarkFill className="text-xl" />*/}
	// 								{/*</div>*/}
	// 								<div
	// 								     className="flex w-full max-w-[900px] mx-auto h-auto pt-2 relative items-end pb-2 px-3 bg-secondaryBackground">
	// 									<TextareaAutosize
	// 										value={inputValue}
	// 										ref={areaRef}
	// 										onChange={(e) => {
	// 											areaRef.current && areaRef.current.scrollTo({top: 20000, left: 0});
	// 											setInputValue(e.target.value);
	// 										}}
	// 										onKeyDown={e => {
	// 											// if(e.key === 'Enter' && !e.shiftKey) {
	// 											// e.preventDefault();
	// 											// handleSubmitMessage();
	// 											// }
	// 											// if(e.key === 'Enter' && e.shiftKey) {
	// 											// 	areaRef.current && areaRef.current.scrollTo({top: areaRef.current.scrollTop + 10, left: 0});
	// 											// }
	// 										}}
	// 										onHeightChange={e => {
	// 											// 48 is default height of textarea
	// 											// setAreaHeight(e - 48);
	// 										}}
	// 										minRows={1}
	// 										maxRows={4}
	// 										placeholder="Type here..."
	// 										className="outline-none caret-primary resize-none whitespace-pre-wrap active:outline-none placeholder-gray-200 bg-background rounded-xl w-full h-full p-3 px-4 absolute bottom-0"
	// 									/>
	// 								</div>
	// 								<svg
	// 									xmlns="http://www.w3.org/2000/svg"
	// 									width={19}
	// 									height={19}
	// 									fill={colors.primary}
	// 									className="mb-[1.25rem] cursor-pointer"
	// 								>
	// 									<path
	// 										d="M18.57 8.793 1.174.083A.79.79 0 0 0 .32.18.792.792 0 0 0 .059.97l2.095 7.736h8.944v1.584H2.153L.027 18.002A.793.793 0 0 0 .818 19c.124-.001.246-.031.356-.088l17.396-8.71a.791.791 0 0 0 0-1.409Z"
	// 									/>
	// 								</svg>
	// 							</div>
	// 						</>
	// 					</div>
	// 					{adCreative && <div ref={rightPaneRef}><RightPane mock={mockState} adCreative={adCreative} style={{zoom: 0.41, position: 'relative'}}/></div>}
	// 				</div>
	// 			</div>
	// 		</div>
	// 		<div className={"absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] md:w-[550px] h-[80vh] flex justify-center items-center"} style={{display: !isInView ? 'none' : 'flex', opacity: viewScreen === ViewScreen.MOBILE ? 1 : 0}}>
	// 			<Image className="w-auto h-full max-w-none" src={IphoneImage} alt="Iphone Image" />
	// 			{adCreative && <div className="absolute" style={{
	// 				width: 'unset',
	// 				height: 'calc(100% - 42px)',
	// 				zoom: 1,
	// 				top: '50%',
	// 				left: '49.8%',
	// 				borderRadius: '20px',
	// 				overflow: 'auto',
	// 				border: 'none',
	// 				aspectRatio: 0.46,
	// 				transform: 'translate(-50%, -50%)',
	// 			}}>
  //         <div ref={rightPaneRef}><RightPane mock={mockState} adCreative={mock.adCreative} style={{position: 'relative', zoom: 0.85, paddingLeft: 0}}/>
  //         </div>
  //       </div>}
	// 			{!adCreative && <div style={{
	// 				width: 'unset',
	// 				height: 'calc(100% - 42px)',
	// 				zoom: 1,
	// 				top: '50%',
	// 				left: '49.8%',
	// 				borderRadius: '18px',
	// 				overflow: 'hidden',
	// 				border: 'none',
	// 				aspectRatio: 0.46,
	// 				transform: 'translate(-50%, -50%)',
	// 			}} className="w-[443px] h-[263px] absolute top-[99px] left-[53px] rounded-[3px] bg-white bg-opacity-10 border-primary border overflow-hidden">
  //         <div className={`flex h-full overflow-hidden`}>
  //           <div className={'bg-secondaryBackground flex-1 relative flex flex-col font-diatype overflow-hidden'}>
  //             <>
  //               <div
  //                 className="flex justify-between h-auto py-2 px-6 box-border items-center bg-secondaryBackground shadow-[0px_1px_1px_0px_#000]"
  //                 style={{zoom: 0.5}}
  //               >
  //                 <Link href="/" className="flex justify-center items-center">
  //                   <Logo width={35} className="mr-2" height={35}/>
  //                   <h3 className="text-lg">Arti AI</h3>
  //                 </Link>
  //               </div>
  //               <AnimatePresence mode="wait">
  //                 <div
  //                   style={{zoom: 0.5}}
  //                   className={'flex-1 flex flex-col-reverse overflow-auto' + (showGetAdNowButton ? ' pb-9 md:pb-10' : '')}>
	// 									{/*<ChatGPTMessageCreatingAd/>*/}
	// 									{isGeneratingAd && <ChatGPTMessageCreatingAd/>}
	// 									{/*<div className="text-white whitespace-pre-wrap">*/}
	// 									{/*	{msg}*/}
	// 									{/*</div>*/}
	// 									{isGenerating && <ChatGPTMessageGeneratingAnimation/>}
  //                   <motion.div variants={framerContainer} animate="show" initial="hidden" exit="hidden">
	// 										{/*{conversationType && <ChatGPTMessageWelcomeMessage type={conversationType}/>}*/}
	// 										{/*{*/}
	// 										{messageList.map((messageItem: ChatGPTMessageObj) => (
	// 											<ChatGPTMessageItem
	// 												chunksRef={chunksRef}
	// 												doneRef={doneRef}
	// 												isGenerating={isGenerating}
	// 												// conversationId={params.conversation_id as string}
	// 												isMock={true}
	// 												key={messageItem.id}
	// 												setMessages={setMessages}
	// 												messageItem={messageItem}
	// 												disableCopy
	// 											/>
	// 										))}
	// 										{/*}*/}
  //                   </motion.div>
  //                   <div className="w-full max-w-[900px] mx-auto px-3 flex justify-center items-center my-3">
  //                     <div className="h-0.5 mr-5 flex-1 bg-gray-800"/>
  //                     <div
  //                       className="flex justify-center whitespace-nowrap items-center font-light text-sm font-diatype text-white text-opacity-50">
  //                       <span>Hey</span>
  //                       <Image width={20} height={20} src={WavingHand} alt="Arti AI welcomes you"/>
  //                       <span>, How can Arti Ai help you?</span>
  //                     </div>
  //                     <div className="h-0.5 ml-5 flex-1 bg-gray-800"/>
  //                   </div>
  //                 </div>
  //               </AnimatePresence>
  //               <div
  //                 style={{zoom: 0.5}}
  //                 className="flex w-full max-w-[900px] mx-auto h-[4.5rem] relative items-end pb-2 px-3 bg-secondaryBackground">
	// 								{(showGetAdNowButton && !isGeneratingAd) && <GetAdButton
  //                   adGenerated={Boolean(adCreative)}
  //                   onClick={async (setLoading: any) => {
	// 										// await handleGetAdNowButton();
	// 										setLoading(false);
	// 									}}
  //                 />}
  //                 <div
  //                   className="flex w-full max-w-[900px] mx-auto h-auto pt-2 relative items-end pb-2 px-3 bg-secondaryBackground"
  //                 >
  //                   <TextareaAutosize
  //                     value={inputValue}
  //                     ref={areaRef}
  //                     onChange={(e) => {
	// 											areaRef.current && areaRef.current.scrollTo({top: 20000, left: 0});
	// 											setInputValue(e.target.value);
	// 										}}
  //                     minRows={1}
  //                     maxRows={4}
  //                     placeholder="Type here..."
  //                     className="outline-none caret-primary resize-none whitespace-pre-wrap active:outline-none placeholder-gray-200 bg-background rounded-xl w-full h-full p-3 px-4 absolute bottom-0"
  //                   />
  //                 </div>
  //                 <svg
  //                   xmlns="http://www.w3.org/2000/svg"
  //                   width={19}
  //                   height={19}
  //                   fill={colors.primary}
  //                   className="mb-[1.25rem] cursor-pointer"
  //                 >
  //                   <path
  //                     d="M18.57 8.793 1.174.083A.79.79 0 0 0 .32.18.792.792 0 0 0 .059.97l2.095 7.736h8.944v1.584H2.153L.027 18.002A.793.793 0 0 0 .818 19c.124-.001.246-.031.356-.088l17.396-8.71a.791.791 0 0 0 0-1.409Z"
  //                   />
  //                 </svg>
  //               </div>
  //             </>
  //           </div>
  //         </div>
  //       </div>}
	// 		</div>
	// 	</>
	// )
}

export default function Services() {
	const [idInView, setIdInView] = useState<Props['id']>(0);
	const isMounted = useMounted();
	const [viewScreen, setViewScreen] = useState(ViewScreen.MOBILE);
	const mounted = useMounted();
	const iphoneImageRef = useRef<HTMLImageElement>(null);

	function handleIdInView(id: Props['id']) {
		setIdInView(id);
	}

	function handleEnd(setKey: React.Dispatch<SetStateAction<number>>) {
		// console.log('handling end --- ')
		setKey((c: number) => c+1);
	}

	const mockMessages = useMemo(() => {
		return mock.messages.sort((a,b) => a.serialOrder - b.serialOrder);
	}, []);

	const mockAdCreativeMessages = useMemo(() => {
		return mock.adCreativeMessages.sort((a,b) => a.serialOrder - b.serialOrder);
	}, []);

	/**
	 *     width: 446px;
	 *     height: 278.4px;
	 *     top: 84px;
	 *     left: 52px;
	 *     border-radius: 11px 11px 0 0;
	 */

	const messages = (
		idInView === 1 ? mockMessages as ChatGPTMessageObj[] :
			idInView === 2 ? mockAdCreativeMessages as ChatGPTMessageObj[] :
				[]
	)

	const handleChangeScreen = useCallback((screen: ViewScreen) => {
		setViewScreen(screen);
	}, []);

	const dimensions = useMemo(() => {
		if(!mounted) return {
			width: 100,
			height: 100
		}

		if(!iphoneImageRef?.current) return {
			width: 100,
			height: 100
		}

		const rect = iphoneImageRef.current.getBoundingClientRect();

		return {
			width: rect.width - 30,
			height: rect.height - 30
		}
	}, [mounted]);

	return (
		<div className="landing-page-section relative grid grid-cols-1 md:grid-cols-[1fr_1fr] lg:gap-10 xl:gap-20 mt-40" id={'services'}>
			<div>
				{servicesData.cards.map(serviceItem => <ServiceCard handleIdInView={handleIdInView} key={serviceItem.title} {...serviceItem} />)}
			</div>
			<div data-groupid={"landing-section"} data-section={"product_overview"} className="relative md:sticky h-screen top-0 flex flex-col gap-3 justify-center items-center">
				{/*<div className="flex gap-2 opacity-0">*/}
				{/*	<div className="flex flex-col items-center justify-center">*/}
				{/*		<div className="w-14 h-14">*/}
				{/*			<MacSVG fill="#aaa" />*/}
				{/*		</div>*/}
				{/*		<span className="text-xs text-gray-400">Laptop</span>*/}
				{/*	</div>*/}
				{/*	<div className="flex flex-col items-center justify-center">*/}
				{/*		<div className="w-14 h-14">*/}
				{/*			<IphoneSVG fill="#aaa" />*/}
				{/*		</div>*/}
				{/*		<span className="text-xs text-gray-400">Laptop</span>*/}
				{/*	</div>*/}
				{/*	<div className="flex flex-col items-center justify-center">*/}
				{/*		<div className="w-14 h-14">*/}
				{/*			<ScreenSVG fill="#aaa" />*/}
				{/*		</div>*/}
				{/*		<span className="text-xs text-gray-400">Laptop</span>*/}
				{/*	</div>*/}
				{/*</div>*/}
				<div className="text-left w-[90vw] md:w-[550px] h-[80vh] flex items-center justify-center relative">
          <div className={"absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] md:w-[550px] flex justify-center items-center h-[80vh]"}>
            <Image className="w-auto h-full max-w-none" src={IphoneImage} ref={iphoneImageRef} alt="Iphone Image" />
            <ArtiChatDemo.Chat dimensions={dimensions} messages={mockMessages} viewScreen={viewScreen} isInView={idInView === 1} />
            <ArtiChatDemo.AdCreative dimensions={dimensions} messages={mockAdCreativeMessages} viewScreen={viewScreen} isInView={idInView === 2} />
            <ArtiChatDemo.Metrics dimensions={dimensions} messages={mockAdCreativeMessages} viewScreen={viewScreen} isInView={idInView === 3} />
          </div>
				</div>
				{/*<div className="flex gap-2" style={{zoom: 0.8}}>*/}
				{/*	{screens.map(screen => (*/}
				{/*		<div key={screen.id} className="flex flex-col items-center justify-center cursor-pointer" onClick={() => handleChangeScreen(screen.value)}>*/}
				{/*			<div className="w-14 h-14 flex justify-center items-center">*/}
				{/*				<screen.Icon fill={viewScreen === screen.value ? colors.primary : '#aaa'} />*/}
				{/*			</div>*/}
				{/*			<span className={'text-xs ' + (viewScreen === screen.value ? 'text-primary' : 'text-gray-400')}>{screen.label}</span>*/}
				{/*		</div>*/}
				{/*	))}*/}
				{/*</div>*/}
			</div>
		</div>
	)
}
