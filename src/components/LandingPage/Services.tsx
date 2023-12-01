'use client';

import React, {FC, SetStateAction, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {servicesData} from '@/constants/landingPageData/services';
import Link from 'next/link';
import Logo from '@/components/Logo';
import TextareaAutosize from 'react-textarea-autosize';
import {colors} from '@/config/theme';
import {AnimatePresence, motion} from 'framer-motion';
import {framerContainer, framerItem} from '@/config/framer-motion';
import Image from 'next/image';
import WavingHand from '@/assets/images/waving-hand.webp';
import {waitWithCleanup} from '@/helpers';
import {ChatGPTMessageObj, ChatGPTRole} from '@/interfaces/IArtiBot';
import ChatGPTMessageItem, {
	ChatGPTMessageCreatingAd,
	ChatGPTMessageGeneratingAnimation
} from '@/components/ArtiBot/MessageItems/ChatGPTMessageItem';
import ObjectId from 'bson-objectid';
import MacImage from '@/assets/images/mac.png';
import RightPane from '@/components/ArtiBot/RIghtPane/RightPane';
import {IAdCreative} from '@/interfaces/IAdCreative';
import useMounted from '@/hooks/useMounted';
import GetAdButton from '@/components/ArtiBot/GetAdButton';

interface Props {
	id: number | string;
	title: string;
	description: string;
	style?: any;
	handleIdInView?: (id: Props['id']) => void;
}

const mock = {
	messages: [
		{
			"id": "654ef9679a32290763394bcc",
			"role": ChatGPTRole.ASSISTANT,
			"content": "Hi, I'm Arti, your AI assistant. I can help you create ads for your business. What would you like to do today?",
			"createdAt": "2023-11-11T03:51:04.148Z",
			"updatedAt": "2023-11-11T03:51:04.148Z"
		},
		{
			"id": "654ef9679a32290763394bcd",
			"role": ChatGPTRole.USER,
			"content": "I need to create an ad for my business",
			"createdAt": "2023-11-11T03:51:04.148Z",
			"updatedAt": "2023-11-11T03:51:04.148Z"
		},
		{
			"id": "654ef9679a32290763394bce",
			"role": ChatGPTRole.ASSISTANT,
			"content": "Great! Let's get started. What is your business about?",
			"createdAt": "2023-11-11T03:51:04.148Z",
			"updatedAt": "2023-11-11T03:51:04.148Z"
		},
		{
			"id": "654ef9679a32290763394bcf",
			"role": ChatGPTRole.USER,
			"content": "I sell shoes",
			"createdAt": "2023-11-11T03:51:04.148Z",
			"updatedAt": "2023-11-11T03:51:04.148Z"
		},
		{
			"id": "654ef9679a32290763394bd0",
			"role": ChatGPTRole.ASSISTANT,
			"content": "What is your target audience?",
			"createdAt": "2023-11-11T03:51:04.148Z",
			"updatedAt": "2023-11-11T03:51:04.148Z"
		},
		{
			"id": "654ef9679a32290763394bd1",
			"role": ChatGPTRole.USER,
			"content": "Millennials",
			"createdAt": "2023-11-11T03:51:04.148Z",
			"updatedAt": "2023-11-11T03:51:04.148Z"
		},
		{
			"id": "654ef9679a32290763394bd2",
			"role": ChatGPTRole.ASSISTANT,
			"content": "What is your ad objective?",
			"createdAt": "2023-11-11T03:51:04.148Z",
			"updatedAt": "2023-11-11T03:51:04.148Z"
		},
		{
			"id": "654ef9679a32290763394bd3",
			"role": ChatGPTRole.USER,
			"content": "Increase brand awareness and generate leads",
			"createdAt": "2023-11-11T03:51:04.148Z",
			"updatedAt": "2023-11-11T03:51:04.148Z"
		},
		{
			"id": "654ef9679a32290763394bd4",
			"role": ChatGPTRole.ASSISTANT,
			"content": "What is your company name?",
			"createdAt": "2023-11-11T03:51:04.148Z",
			"updatedAt": "2023-11-11T03:51:04.148Z"
		}
	],
	adCreativeMessages: [
		{
			"id": "65642c9db3a0408e7192e91a",
			"content": "Hi there?",
			"role": "user",
			"conversationId": "65642c87c68343014ba202c3",
			"createdAt": "2023-11-27T05:43:57.412Z",
			"updatedAt": "2023-11-27T05:43:57.412Z",
			"adCreatives": []
		},
		{
			"id": "65642c9eb3a0408e7192e91b",
			"content": "Hello! I'm Arti, an AI with a background in advertising. How can I assist you today? Please start by telling me your name, role, the type of ad you wish to create, and where you intend to display these ads.",
			"role": "assistant",
			"conversationId": "65642c87c68343014ba202c3",
			"createdAt": "2023-11-27T05:43:58.191Z",
			"updatedAt": "2023-11-27T05:43:58.191Z",
			"adCreatives": []
		},
		{
			"id": "65642cb1b3a0408e7192e91c",
			"content": "My business name is EcoHarvest Solutions",
			"role": "user",
			"conversationId": "65642c87c68343014ba202c3",
			"createdAt": "2023-11-27T05:44:17.451Z",
			"updatedAt": "2023-11-27T05:44:17.451Z",
			"adCreatives": []
		},
		{
			"id": "65642cb2b3a0408e7192e91d",
			"content": "Great to meet you, EcoHarvest Solutions! Could you please let me know what your role is and provide some details about the type of ad you would like to create? Also, where are you planning to display these ads?",
			"role": "assistant",
			"conversationId": "65642c87c68343014ba202c3",
			"createdAt": "2023-11-27T05:44:18.201Z",
			"updatedAt": "2023-11-27T05:44:18.201Z",
			"adCreatives": []
		},
		{
			"id": "65642cc0b3a0408e7192e91e",
			"content": "It EcoHarvest Solutions specializes in sustainable and eco-friendly agricultural technologies. The company aims to provide innovative solutions for farmers to enhance crop yield while minimizing environmental impact. This could include developing smart irrigation systems, organic fertilizers, and precision farming technologies.",
			"role": "user",
			"conversationId": "65642c87c68343014ba202c3",
			"createdAt": "2023-11-27T05:44:32.245Z",
			"updatedAt": "2023-11-27T05:44:32.245Z",
			"adCreatives": []
		},
		{
			"id": "65642ce9b3a0408e7192e921",
			"content": "Thank you for providing such detailed information, EcoHarvest Solutions! I now have a better understanding of your business, target audience, goals, and competitors.",
			"role": "assistant",
			"conversationId": "65642c87c68343014ba202c3",
			"createdAt": "2023-11-27T05:45:13.611Z",
			"updatedAt": "2023-11-27T05:45:13.611Z",
			"adCreatives": []
		},
		{
			"id": "65642ff2b3a0408e7192e931",
			"content": "{\n  \"summary\": \"EcoHarvest Solutions specializes in sustainable and eco-friendly agricultural technologies, aiming to provide innovative solutions for farmers to enhance crop yield while minimizing environmental impact. \",\n  \"variants\": [\n    {\n      \"confidence\": \"85%\",\n      \"adType\": \"Facebook Ad\",\n      \"variantNo\": \"1\",\n      \"imageUrl\": \"https://www.example.com/image1.jpg\",\n      \"oneLiner\": \"Maximize Crop Yield with Smart Irrigation\",\n      \"imageDescription\": \"The image showcases a thriving farm field with smart irrigation technology in action. The frame highlights the lush crops and the innovative irrigation system. The style is fresh and vibrant, capturing the essence of sustainable and efficient agriculture.\",\n      \"adOrientation\": \"Horizontal layout with a modern and clean theme.\",\n      \"rationale\": \"This ad emphasizes the benefits of EcoHarvest Solutions' smart irrigation systems, promoting higher crop yield, water efficiency, and environmental consciousness in a visually appealing manner.\",\n      \"text\": \"Unlock the full potential of your crops with our smart irrigation systems. Optimize water usage, enhance crop health, and achieve maximum yield. Visit our website to learn more!\"\n    },\n    {\n      \"confidence\": \"90%\",\n      \"adType\": \"Digital Banner Ad\",\n      \"variantNo\": \"2\",\n      \"imageUrl\": \"https://www.example.com/image2.jpg\",\n      \"oneLiner\": \"Empower Your Farming with Precision Technology\",\n      \"imageDescription\": \"The image features a farmer using advanced precision farming technologies amidst healthy crops. The frame captures the precision and sophistication of the technology while showcasing the successful results in the field. The style is dynamic and captivating, conveying innovation and progressiveness.\",\n      \"adOrientation\": \"Vertical layout with an energetic and futuristic theme.\",\n      \"rationale\": \"This ad highlights EcoHarvest Solutions' precision farming technologies, fostering a sense of excitement and progress in the farming community. It emphasizes the opportunities for increased productivity, resource optimization, and sustainable practices.\",\n      \"text\": \"Revolutionize your farming practices with our precision farming technologies. Experience enhanced crop management, precise resource allocation, and improved productivity. Contact us now to embark on your sustainable farming journey!\"\n    }\n  ],\n  \"disclaimer\": \"The ads are designed and created by EcoHarvest Solutions to promote their sustainable agricultural technologies and services.\",\n  \"companyName\": \"EcoHarvest Solutions\",\n  \"adObjective\": \"Increase brand awareness and generate leads for sustainable agricultural technologies.\"\n}",
			"role": "assistant",
			"conversationId": "65642c87c68343014ba202c3",
			"createdAt": "2023-11-27T05:58:10.710Z",
			"updatedAt": "2023-11-27T05:58:10.710Z",
			"adCreatives": [
				{
					"id": "65642ff3b3a0408e7192e932",
					"conversationId": "65642c87c68343014ba202c3",
					"adObjective": "Increase brand awareness and generate leads for sustainable agricultural technologies.",
					"json": "{\n  \"summary\": \"EcoHarvest Solutions specializes in sustainable and eco-friendly agricultural technologies, aiming to provide innovative solutions for farmers to enhance crop yield while minimizing environmental impact. The proposed ads focus on showcasing their smart irrigation systems and precision farming technologies. Targeted at farmers and agricultural businesses, the ads aim to increase brand awareness and generate leads. The competitors in the sustainable agriculture industry include AgriTech Solutions Inc., GreenHarvest Innovations, and EarthSmart Agriculture Technologies. The ads will be displayed on digital platforms like Facebook and through participation in agricultural conferences/exhibitions. The first ad variant is a Facebook ad highlighting the benefits of smart irrigation systems, while the second variant is a digital banner ad promoting precision farming technologies.\",\n  \"variants\": [\n    {\n      \"confidence\": \"85%\",\n      \"adType\": \"Facebook Ad\",\n      \"variantNo\": \"1\",\n      \"imageUrl\": \"https://www.example.com/image1.jpg\",\n      \"oneLiner\": \"Maximize Crop Yield with Smart Irrigation\",\n      \"imageDescription\": \"The image showcases a thriving farm field with smart irrigation technology in action. The frame highlights the lush crops and the innovative irrigation system. The style is fresh and vibrant, capturing the essence of sustainable and efficient agriculture.\",\n      \"adOrientation\": \"Horizontal layout with a modern and clean theme.\",\n      \"rationale\": \"This ad emphasizes the benefits of EcoHarvest Solutions' smart irrigation systems, promoting higher crop yield, water efficiency, and environmental consciousness in a visually appealing manner.\",\n      \"text\": \"Unlock the full potential of your crops with our smart irrigation systems. Optimize water usage, enhance crop health, and achieve maximum yield. Visit our website to learn more!\"\n    },\n    {\n      \"confidence\": \"90%\",\n      \"adType\": \"Digital Banner Ad\",\n      \"variantNo\": \"2\",\n      \"imageUrl\": \"https://www.example.com/image2.jpg\",\n      \"oneLiner\": \"Empower Your Farming with Precision Technology\",\n      \"imageDescription\": \"The image features a farmer using advanced precision farming technologies amidst healthy crops. The frame captures the precision and sophistication of the technology while showcasing the successful results in the field. The style is dynamic and captivating, conveying innovation and progressiveness.\",\n      \"adOrientation\": \"Vertical layout with an energetic and futuristic theme.\",\n      \"rationale\": \"This ad highlights EcoHarvest Solutions' precision farming technologies, fostering a sense of excitement and progress in the farming community. It emphasizes the opportunities for increased productivity, resource optimization, and sustainable practices.\",\n      \"text\": \"Revolutionize your farming practices with our precision farming technologies. Experience enhanced crop management, precise resource allocation, and improved productivity. Contact us now to embark on your sustainable farming journey!\"\n    }\n  ],\n  \"disclaimer\": \"The ads are designed and created by EcoHarvest Solutions to promote their sustainable agricultural technologies and services.\",\n  \"companyName\": \"EcoHarvest Solutions\",\n  \"adObjective\": \"Increase brand awareness and generate leads for sustainable agricultural technologies.\"\n}",
					"companyName": "EcoHarvest Solutions",
					"disclaimer": "The ads are designed and created by EcoHarvest Solutions to promote their sustainable agricultural technologies and services.",
					"summary": "EcoHarvest Solutions specializes in sustainable and eco-friendly agricultural technologies, aiming to provide innovative solutions for farmers to enhance crop yield while minimizing environmental impact. The proposed ads focus on showcasing their smart irrigation systems and precision farming technologies. Targeted at farmers and agricultural businesses, the ads aim to increase brand awareness and generate leads. The competitors in the sustainable agriculture industry include AgriTech Solutions Inc., GreenHarvest Innovations, and EarthSmart Agriculture Technologies. The ads will be displayed on digital platforms like Facebook and through participation in agricultural conferences/exhibitions. The first ad variant is a Facebook ad highlighting the benefits of smart irrigation systems, while the second variant is a digital banner ad promoting precision farming technologies.",
					"createdAt": "2023-11-27T05:58:10.710Z",
					"updatedAt": "2023-11-27T05:58:10.710Z",
					"variants": [
						{
							"id": "65642ff3b3a0408e7192e934",
							"variantNo": "2",
							"adType": "Digital Banner Ad",
							"confidence": null,
							"image": null,
							"imageUrl": "https://srs-billing-storage.s3.ap-south-1.amazonaws.com/65642ff3b3a0408e7192e934_1701064710420.png",
							"oneLiner": "Empower Your Farming with Precision Technology",
							"imageDescription": "The image features a farmer using advanced precision farming technologies amidst healthy crops. The frame captures the precision and sophistication of the technology while showcasing the successful results in the field. The style is dynamic and captivating, conveying innovation and progressiveness.",
							"adOrientation": "Vertical layout with an energetic and futuristic theme.",
							"text": "Revolutionize your farming practices with our precision farming technologies. Experience enhanced crop management, precise resource allocation, and improved productivity. Contact us now to embark on your sustainable farming journey!",
							"rationale": "This ad highlights EcoHarvest Solutions' precision farming technologies, fostering a sense of excitement and progress in the farming community. It emphasizes the opportunities for increased productivity, resource optimization, and sustainable practices.",
							"adCreativeId": "65642ff3b3a0408e7192e932",
							"createdAt": "2023-11-27T05:58:10.710Z",
							"updatedAt": "2023-11-27T05:58:10.710Z"
						},
						{
							"id": "65642ff3b3a0408e7192e933",
							"variantNo": "1",
							"adType": "Facebook Ad",
							"confidence": null,
							"image": null,
							"imageUrl": "https://srs-billing-storage.s3.ap-south-1.amazonaws.com/65642ff3b3a0408e7192e933_1701064709413.png",
							"oneLiner": "Maximize Crop Yield with Smart Irrigation",
							"imageDescription": "The image showcases a thriving farm field with smart irrigation technology in action. The frame highlights the lush crops and the innovative irrigation system. The style is fresh and vibrant, capturing the essence of sustainable and efficient agriculture.",
							"adOrientation": "Horizontal layout with a modern and clean theme.",
							"text": "Unlock the full potential of your crops with our smart irrigation systems. Optimize water usage, enhance crop health, and achieve maximum yield. Visit our website to learn more!",
							"rationale": "This ad emphasizes the benefits of EcoHarvest Solutions' smart irrigation systems, promoting higher crop yield, water efficiency, and environmental consciousness in a visually appealing manner.",
							"adCreativeId": "65642ff3b3a0408e7192e932",
							"createdAt": "2023-11-27T05:58:10.710Z",
							"updatedAt": "2023-11-27T05:58:10.710Z"
						}
					]
				}
			]
		}
	],
	adCreative: {
		"id": "65642ff3b3a0408e7192e932",
		"conversationId": "65642c87c68343014ba202c3",
		"adObjective": "Increase brand awareness and generate leads for sustainable agricultural technologies.",
		"json": "{\n  \"summary\": \"EcoHarvest Solutions specializes in sustainable and eco-friendly agricultural technologies, aiming to provide innovative solutions for farmers to enhance crop yield while minimizing environmental impact. The proposed ads focus on showcasing their smart irrigation systems and precision farming technologies. Targeted at farmers and agricultural businesses, the ads aim to increase brand awareness and generate leads. The competitors in the sustainable agriculture industry include AgriTech Solutions Inc., GreenHarvest Innovations, and EarthSmart Agriculture Technologies. The ads will be displayed on digital platforms like Facebook and through participation in agricultural conferences/exhibitions. The first ad variant is a Facebook ad highlighting the benefits of smart irrigation systems, while the second variant is a digital banner ad promoting precision farming technologies.\",\n  \"variants\": [\n    {\n      \"confidence\": \"85%\",\n      \"adType\": \"Facebook Ad\",\n      \"variantNo\": \"1\",\n      \"imageUrl\": \"https://www.example.com/image1.jpg\",\n      \"oneLiner\": \"Maximize Crop Yield with Smart Irrigation\",\n      \"imageDescription\": \"The image showcases a thriving farm field with smart irrigation technology in action. The frame highlights the lush crops and the innovative irrigation system. The style is fresh and vibrant, capturing the essence of sustainable and efficient agriculture.\",\n      \"adOrientation\": \"Horizontal layout with a modern and clean theme.\",\n      \"rationale\": \"This ad emphasizes the benefits of EcoHarvest Solutions' smart irrigation systems, promoting higher crop yield, water efficiency, and environmental consciousness in a visually appealing manner.\",\n      \"text\": \"Unlock the full potential of your crops with our smart irrigation systems. Optimize water usage, enhance crop health, and achieve maximum yield. Visit our website to learn more!\"\n    },\n    {\n      \"confidence\": \"90%\",\n      \"adType\": \"Digital Banner Ad\",\n      \"variantNo\": \"2\",\n      \"imageUrl\": \"https://www.example.com/image2.jpg\",\n      \"oneLiner\": \"Empower Your Farming with Precision Technology\",\n      \"imageDescription\": \"The image features a farmer using advanced precision farming technologies amidst healthy crops. The frame captures the precision and sophistication of the technology while showcasing the successful results in the field. The style is dynamic and captivating, conveying innovation and progressiveness.\",\n      \"adOrientation\": \"Vertical layout with an energetic and futuristic theme.\",\n      \"rationale\": \"This ad highlights EcoHarvest Solutions' precision farming technologies, fostering a sense of excitement and progress in the farming community. It emphasizes the opportunities for increased productivity, resource optimization, and sustainable practices.\",\n      \"text\": \"Revolutionize your farming practices with our precision farming technologies. Experience enhanced crop management, precise resource allocation, and improved productivity. Contact us now to embark on your sustainable farming journey!\"\n    }\n  ],\n  \"disclaimer\": \"The ads are designed and created by EcoHarvest Solutions to promote their sustainable agricultural technologies and services.\",\n  \"companyName\": \"EcoHarvest Solutions\",\n  \"adObjective\": \"Increase brand awareness and generate leads for sustainable agricultural technologies.\"\n}",
		"companyName": "EcoHarvest Solutions",
		"disclaimer": "The ads are designed and created by EcoHarvest Solutions to promote their sustainable agricultural technologies and services.",
		"summary": "EcoHarvest Solutions specializes in sustainable and eco-friendly agricultural technologies, aiming to provide innovative solutions for farmers to enhance crop yield while minimizing environmental impact. The proposed ads focus on showcasing their smart irrigation systems and precision farming technologies. Targeted at farmers and agricultural businesses, the ads aim to increase brand awareness and generate leads. The competitors in the sustainable agriculture industry include AgriTech Solutions Inc., GreenHarvest Innovations, and EarthSmart Agriculture Technologies. The ads will be displayed on digital platforms like Facebook and through participation in agricultural conferences/exhibitions. The first ad variant is a Facebook ad highlighting the benefits of smart irrigation systems, while the second variant is a digital banner ad promoting precision farming technologies.",
		"createdAt": "2023-11-27T05:58:10.710Z",
		"updatedAt": "2023-11-27T05:58:10.710Z",
		"variants": [
			{
				"id": "65642ff3b3a0408e7192e934",
				"variantNo": "2",
				"adType": "Digital Banner Ad",
				"confidence": null,
				"image": null,
				"imageUrl": "https://srs-billing-storage.s3.ap-south-1.amazonaws.com/65642ff3b3a0408e7192e934_1701064710420.png",
				"oneLiner": "Empower Your Farming with Precision Technology",
				"imageDescription": "The image features a farmer using advanced precision farming technologies amidst healthy crops. The frame captures the precision and sophistication of the technology while showcasing the successful results in the field. The style is dynamic and captivating, conveying innovation and progressiveness.",
				"adOrientation": "Vertical layout with an energetic and futuristic theme.",
				"text": "Revolutionize your farming practices with our precision farming technologies. Experience enhanced crop management, precise resource allocation, and improved productivity. Contact us now to embark on your sustainable farming journey!",
				"rationale": "This ad highlights EcoHarvest Solutions' precision farming technologies, fostering a sense of excitement and progress in the farming community. It emphasizes the opportunities for increased productivity, resource optimization, and sustainable practices.",
				"adCreativeId": "65642ff3b3a0408e7192e932",
				"createdAt": "2023-11-27T05:58:10.710Z",
				"updatedAt": "2023-11-27T05:58:10.710Z"
			},
			{
				"id": "65642ff3b3a0408e7192e933",
				"variantNo": "1",
				"adType": "Facebook Ad",
				"confidence": null,
				"image": null,
				"imageUrl": "https://srs-billing-storage.s3.ap-south-1.amazonaws.com/65642ff3b3a0408e7192e933_1701064709413.png",
				"oneLiner": "Maximize Crop Yield with Smart Irrigation",
				"imageDescription": "The image showcases a thriving farm field with smart irrigation technology in action. The frame highlights the lush crops and the innovative irrigation system. The style is fresh and vibrant, capturing the essence of sustainable and efficient agriculture.",
				"adOrientation": "Horizontal layout with a modern and clean theme.",
				"text": "Unlock the full potential of your crops with our smart irrigation systems. Optimize water usage, enhance crop health, and achieve maximum yield. Visit our website to learn more!",
				"rationale": "This ad emphasizes the benefits of EcoHarvest Solutions' smart irrigation systems, promoting higher crop yield, water efficiency, and environmental consciousness in a visually appealing manner.",
				"adCreativeId": "65642ff3b3a0408e7192e932",
				"createdAt": "2023-11-27T05:58:10.710Z",
				"updatedAt": "2023-11-27T05:58:10.710Z"
			}
		]
	}
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
				<h1 className="text-[105px] leading-[105px] font-gilroyBold tracking-[-3.15px]">{title}</h1>
				<p className="font-gilroyRegular text-[18px]">{description}</p>
			</div>
		</div>
	)
}

interface ArtiChatDemoProps {
	messages: ChatGPTMessageObj[];
	handleEnd: () => void;
	isAdCreative?: boolean;
}
const ArtiChatDemo: FC<ArtiChatDemoProps> = ({messages: _messages, isAdCreative, handleEnd}) => {
	const [inputValue, setInputValue] = useState('');
	const [messages, setMessages] = useState<ChatGPTMessageObj[]>([]);
	const [isGenerating, setIsGenerating] = useState(false);
	const chunksRef = useRef('');
	const doneRef = useRef(false);
	const [showGetAdNowButton, setShowGetAdNowButton] = useState(false);
	const [isGeneratingAd, setIsGeneratingAd] = useState(false);
	const [adCreative, setAdCreative] = useState<IAdCreative | null>(null);
	const areaRef = useRef<HTMLTextAreaElement>(null);
	const intervalIds = useRef<NodeJS.Timeout[]>([]);
	const timeoutIds = useRef<NodeJS.Timeout[]>([]);

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

	async function printAiMessage(msg: string) {
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

		await wait(2500);
	}

	const demo = useCallback(async () => {
		setMessages(isAdCreative ? [..._messages.slice(0, 6)] as any : [..._messages.slice(0, 1)]);
		setShowGetAdNowButton(false);
		for (let i = isAdCreative ? 6 : 1; i < (isAdCreative ? _messages.length - 1 : _messages.length); i++) {
			const message = _messages[i];
			if(message.role === ChatGPTRole.USER) {
				await sendUserMessage(message.content as string);
			} else {
				await printAiMessage(message.content as string);
			}
		}

		setShowGetAdNowButton(true);

		if(!isAdCreative) {
			// return;
			// return await demo();

			await wait(1000);

			return handleEnd();
		}

		await wait(1000);

		setIsGeneratingAd(true);

		await wait (2500);

		setIsGeneratingAd(false);
		setMessages(c => [
			...c,
			{
				id: ObjectId().toHexString(),
				role: ChatGPTRole.ASSISTANT,
				content: (_messages ?? mock.adCreativeMessages).at(-1).content,
			}
		]);
		setAdCreative(mock.adCreative);

		await wait(6000);

		return handleEnd();

		// return await demo();

		// setMessages(prev => {
		// 	const filtered = prev.filter(c => !c.generating);
		// 	return [...filtered, {
		// 		id: ObjectId().toHexString(),
		// 		role: ChatGPTRole.ASSISTANT,
		// 		content: chunksRef.current,
		// 		createdAt: new Date().toISOString(),
		// 		updatedAt: new Date().toISOString(),
		// 	}]
		// })
	}, [_messages, isAdCreative, wait, sendUserMessage])

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
	}, [messages])

	return (
		<div className={`flex h-full overflow-hidden`}>
			<div className={'bg-secondaryBackground flex-1 relative flex flex-col font-diatype overflow-hidden'} style={{zoom: 0.5}}>
				<>
					<div className="flex justify-between h-16 py-2 px-6 box-border items-center bg-secondaryBackground shadow-[0px_1px_1px_0px_#000]">
						<Link href="/" className="flex justify-center items-center">
							<Logo width={35} className="mr-2" height={35} />
							<h3 className="text-lg">Arti AI</h3>
						</Link>
					</div>
					<AnimatePresence mode="wait">
						<div className={'flex-1 flex flex-col-reverse overflow-auto'}>
							{/*<ChatGPTMessageCreatingAd/>*/}
							{isGeneratingAd && <ChatGPTMessageCreatingAd/>}
							{/*<div className="text-white whitespace-pre-wrap">*/}
							{/*	{msg}*/}
							{/*</div>*/}
							{isGenerating && <ChatGPTMessageGeneratingAnimation />}
							<motion.div variants={framerContainer} animate="show" initial="hidden" exit="hidden" >
								{/*{conversationType && <ChatGPTMessageWelcomeMessage type={conversationType}/>}*/}
								{/*{*/}
								{messageList.map((messageItem: ChatGPTMessageObj) => (
									<ChatGPTMessageItem
										chunksRef={chunksRef}
										doneRef={doneRef}
										isGenerating={isGenerating}
										// conversationId={params.conversation_id as string}
										isMock={true}
										key={messageItem.id}
										setMessages={setMessages}
										messageItem={messageItem}
									/>
								))}
								{/*}*/}
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
					<div className="flex w-full max-w-[900px] mx-auto h-[4.5rem] relative items-end pb-2 px-3 bg-secondaryBackground">
						{(showGetAdNowButton && !isGeneratingAd) && <GetAdButton
              adGenerated={Boolean(adCreative)}
              onClick={async (setLoading: any) => {
								// await handleGetAdNowButton();
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
						<div className={'flex-1 relative rounded-xl bg-background h-[70%] mb-1 mr-3'}>
							<TextareaAutosize
								value={inputValue}
								ref={areaRef}
								onChange={(e) => {
									areaRef.current && areaRef.current.scrollTo({top: 20000, left: 0});
									setInputValue(e.target.value);
								}}
								onKeyDown={e => {
									// if(e.key === 'Enter' && !e.shiftKey) {
										// e.preventDefault();
										// handleSubmitMessage();
									// }
									// if(e.key === 'Enter' && e.shiftKey) {
									// 	areaRef.current && areaRef.current.scrollTo({top: areaRef.current.scrollTop + 10, left: 0});
									// }
								}}
								onHeightChange={e => {
									// 48 is default height of textarea
									// setAreaHeight(e - 48);
								}}
								minRows={1}
								maxRows={4}
								placeholder="Type here..."
								className="outline-none caret-primary resize-none whitespace-pre-wrap active:outline-none placeholder-gray-200 bg-background rounded-xl w-full h-full p-3 px-4 absolute bottom-0"
							/>
						</div>
						<svg
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
			</div>
			{adCreative && <RightPane isMock={true} adCreative={adCreative} style={{zoom: 0.3, position: 'absolute'}}/>}
		</div>
	)
}

export default function Services() {
	const [idInView, setIdInView] = useState<Props['id']>(0);
	const isMounted = useMounted();
	const [keyForOne, setKeyForOne] = useState(0);
	const [keyForTwo, setKeyForTwo] = useState(9898988);

	function handleIdInView(id: Props['id']) {
		setIdInView(id);
	}

	/**
	 *     top: 20px;
	 *     left: 72px;
	 *     height: 256px;
	 *     width: 408px;
	 */

	function handleEnd(setKey: React.Dispatch<SetStateAction<number>>) {
		console.log('handling end --- ')
		setKey((c: number) => c+1);
	}

	return (
		<div className="landing-page-section relative grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-20 mt-40" id={'product-overview'}>
			<div>
				{servicesData.cards.map(serviceItem => <ServiceCard handleIdInView={handleIdInView} key={serviceItem.title} {...serviceItem} />)}
			</div>
			<div data-groupid={"landing-section"} data-section={"product_overview"} className="relative md:sticky h-screen top-0 flex justify-center items-center">
				<div className="text-left relative h-min">
					<div className={"relative w-[550px] h-auto pointer-events-none"}>
						<Image className="w-full" src={MacImage} alt="Mac Image" />
						<div className="w-[408px] h-[256px] absolute top-[20px] left-[72px] bg-white bg-opacity-10 border-gray-200 rounded">
							{isMounted && (
								<>
									{idInView === 1 && (
										<ArtiChatDemo key={keyForOne} messages={mock.messages as ChatGPTMessageObj[]} isAdCreative={false} handleEnd={() => handleEnd(setKeyForOne)}/>)}
									{idInView === 2 && (
										<ArtiChatDemo key={keyForTwo} messages={mock.adCreativeMessages as ChatGPTMessageObj[]} isAdCreative={true} handleEnd={() => handleEnd(setKeyForTwo)}/>)}
								</>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
