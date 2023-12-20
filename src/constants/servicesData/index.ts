import {ChatGPTRole} from '@/interfaces/IArtiBot';
import MacSVG from '@/assets/icons/MacSVG';
import IphoneSVG from '@/assets/icons/IphoneSVG';
import ScreenSVG from '@/assets/icons/ScreenSVG';
import {carouselImage1, carouselImage2, carouselImage3, carouselImage4} from '@/assets/images/carousel-images';

const a = [
	{
		id: '1',
		description: 'Revolutionizing Advertising and Strategy Planning with Artificial Intelligence. Get dynamic ad creatives with just a click of a button.',
		oneLiner: 'Fast, Accessible, for Everyone',
		src: carouselImage1
	},
	{
		id: '2',
		description: 'Bid farewell to knee pain with expert physical therapy services. Our tailored programs are designed to strengthen, heal, and enhance mobility. Embrace a life of movement and comfort—book your consultation today and take the first step towards a pain-free tomorrow!',
		oneLiner: 'Sign up Today!',
		src: carouselImage2
	},
	{
		id: '3',
		description: 'Don\'t let back pain keep you on the sidelines. Our expert physical therapists empower you to lift the burden of discomfort. With personalized care and cutting-edge techniques, we\'ll help you strengthen your back, improve flexibility, and reclaim your active lifestyle. Take control and elevate your well-being—start your journey to a stronger back today!',
		oneLiner: 'Say Goodbye to Back Pain',
		src: carouselImage3
	},
	{
		id: '4',
		description: 'Visualize the best version of yourself with just 20 minutes a week using our state-of-the-art EMS technology! We harness the power of electrical muscle stimulation to maximize your workouts, sculpting your physique efficiently and effectively. Say goodbye to endless hours at the gym and hello to rapid, visible results. Join the fitness revolution and experience the transformation with us – your journey to a fitter, stronger you awaits!',
		oneLiner: 'Unlock Your Potential: Transform with EMS Fitness!',
		src: carouselImage4
	}
]

export const mockProductOverviewData = {
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
		"id": "656ec8a786966c0bc5d4373c",
		"conversationId": "656ec68f03b0997ed7c52c06",
		"adObjective": "To attract new customers and promote Baskin' Coffee's nitro blends",
		"json": "{\n  \"summary\": \"Baskin' Coffee is a new coffee chain specializing in nitro blends. The nitro blends offer a smooth texture, creamy mouthfeel, and visually appealing frothy head. The target audience includes coffee drinkers in general, with a special focus on the Gen Z crowd. Baskin' Coffee offers a membership program where customers can earn a free drink after purchasing 10 drinks. The objective of the Facebook ads is to attract new customers and promote Baskin' Coffee's nitro blends.\",\n  \"variants\": [\n    {\n      \"confidence\": \"95%\",\n      \"adType\": \"Facebook Ad\",\n      \"variantNo\": \"1\",\n      \"imageUrl\": \"https://example.com/image1.jpg\",\n      \"oneLiner\": \"Escape the Ordinary\",\n      \"imageDescription\": \"The ad features a vibrant and eye-catching image of a cup of Baskin' Coffee's nitro blend with cascading swirls of creaminess. The style is modern and captivating, engaging viewers to experience the extraordinary flavor.\",\n      \"adOrientation\": \"Modern and captivating visuals that stand out.\",\n      \"rationale\": \"This ad makes sense because it showcases the unique qualities of Baskin' Coffee's nitro blends in an engaging and visually appealing manner. The one-liner 'Escape the Ordinary' evokes curiosity and invites viewers to try something extraordinary.\",\n      \"text\": \"Step into a world of extraordinary flavors at Baskin' Coffee. Our nitro blends offer a smooth and creamy mouthfeel that will take your coffee experience to new heights. Join our membership program and earn a free drink after 10 purchases. Visit us in SoHo and escape the ordinary!\"\n    },\n    {\n      \"confidence\": \"90%\",\n      \"adType\": \"Facebook Ad\",\n      \"variantNo\": \"2\",\n      \"imageUrl\": \"https://example.com/image2.jpg\",\n      \"oneLiner\": \"Fuel Your Day with Nitro Magic\",\n      \"imageDescription\": \"The ad features a captivating image of Baskin' Coffee's nitro blend pouring into a cup, creating a mesmerizing visual display. The style is enchanting and engaging, enticing viewers to experience the magic of our nitro blend.\",\n      \"adOrientation\": \"Enchanting visuals that captivate the audience.\",\n      \"rationale\": \"This ad makes sense because it creates a sense of enchantment and magic around Baskin' Coffee's nitro blends. The one-liner 'Fuel Your Day with Nitro Magic' invites viewers to start their day with a powerful and extraordinary coffee experience.\",\n      \"text\": \"Start your day with a touch of magic at Baskin' Coffee. Our nitro blends offer a smooth and powerful kick to fuel your day. Join our membership program and earn a free drink after 10 purchases. Find us in SoHo and experience the magic of Baskin' Coffee!\"\n    }\n  ],\n  \"disclaimer\": \"Disclaimer: The content of these ads is randomly generated and does not reflect any specific information about Baskin' Coffee or its products.\",\n  \"companyName\": \"Baskin' Coffee\",\n  \"adObjective\": \"To attract new customers and promote Baskin' Coffee's nitro blends\"\n}",
		"companyName": "Baskin' Coffee",
		"disclaimer": "Disclaimer: The content of these ads is randomly generated and does not reflect any specific information about Baskin' Coffee or its products.",
		"summary": "Baskin' Coffee is a new coffee chain specializing in nitro blends. The nitro blends offer a smooth texture, creamy mouthfeel, and visually appealing frothy head. The target audience includes coffee drinkers in general, with a special focus on the Gen Z crowd. Baskin' Coffee offers a membership program where customers can earn a free drink after purchasing 10 drinks. The objective of the Facebook ads is to attract new customers and promote Baskin' Coffee's nitro blends.",
		"createdAt": "2023-12-05T06:52:22.621Z",
		"updatedAt": "2023-12-05T06:52:22.621Z",
		"variants": [
			{
				"id": "656ec8a786966c0bc5d4373d",
				"variantNo": "1",
				"adType": "Facebook Ad",
				"confidence": null,
				"image": null,
				"imageUrl": carouselImage1,
				"oneLiner": "Fast, Accessible, for Everyone",
				"imageDescription": "The ad features a vibrant and eye-catching image of a cup of Baskin' Coffee's nitro blend with cascading swirls of creaminess. The style is modern and captivating, engaging viewers to experience the extraordinary flavor.",
				"adOrientation": "Modern and captivating visuals that stand out.",
				"text": "Revolutionizing Advertising and Strategy Planning with Artificial Intelligence. Get dynamic ad creatives with just a click of a button.",
				"rationale": "This ad makes sense because it showcases the unique qualities of Baskin' Coffee's nitro blends in an engaging and visually appealing manner. The one-liner 'Escape the Ordinary' evokes curiosity and invites viewers to try something extraordinary.",
				"adCreativeId": "656ec8a786966c0bc5d4373c",
				"createdAt": "2023-12-05T06:52:22.621Z",
				"updatedAt": "2023-12-05T06:52:22.621Z"
			},
			{
				"id": "656ec8a786966c0bc5d4373e",
				"variantNo": "2",
				"adType": "Instagram Ad",
				"confidence": null,
				"image": null,
				"imageUrl": carouselImage2,
				"oneLiner": "Sign up Today!",
				"imageDescription": "The ad features a vibrant and eye-catching image of a cup of Baskin' Coffee's nitro blend with cascading swirls of creaminess. The style is modern and captivating, engaging viewers to experience the extraordinary flavor.",
				"adOrientation": "Modern and captivating visuals that stand out.",
				"text": "Bid farewell to knee pain with expert physical therapy services. Our tailored programs are designed to strengthen, heal, and enhance mobility. Embrace a life of movement and comfort—book your consultation today and take the first step towards a pain-free tomorrow!",
				"rationale": "This ad makes sense because it showcases the unique qualities of Baskin' Coffee's nitro blends in an engaging and visually appealing manner. The one-liner 'Escape the Ordinary' evokes curiosity and invites viewers to try something extraordinary.",
				"adCreativeId": "656ec8a786966c0bc5d4373c",
				"createdAt": "2023-12-05T06:52:22.621Z",
				"updatedAt": "2023-12-05T06:52:22.621Z"
			},
			{
				"id": "656ec8a786966c0bc5d4373f",
				"variantNo": "3",
				"adType": "Linkedin Ad",
				"confidence": null,
				"image": null,
				"imageUrl": carouselImage3,
				"oneLiner": "Say Goodbye to Back Pain",
				"imageDescription": "The ad features a vibrant and eye-catching image of a cup of Baskin' Coffee's nitro blend with cascading swirls of creaminess. The style is modern and captivating, engaging viewers to experience the extraordinary flavor.",
				"adOrientation": "Modern and captivating visuals that stand out.",
				"text": "Don\'t let back pain keep you on the sidelines. Our expert physical therapists empower you to lift the burden of discomfort. With personalized care and cutting-edge techniques, we\'ll help you strengthen your back, improve flexibility, and reclaim your active lifestyle. Take control and elevate your well-being—start your journey to a stronger back today!",
				"rationale": "This ad makes sense because it showcases the unique qualities of Baskin' Coffee's nitro blends in an engaging and visually appealing manner. The one-liner 'Escape the Ordinary' evokes curiosity and invites viewers to try something extraordinary.",
				"adCreativeId": "656ec8a786966c0bc5d4373c",
				"createdAt": "2023-12-05T06:52:22.621Z",
				"updatedAt": "2023-12-05T06:52:22.621Z"
			},
			{
				"id": "656ec8a786966c0bc5d4373g",
				"variantNo": "4",
				"adType": "Youtube Ad",
				"confidence": null,
				"image": null,
				"imageUrl": carouselImage4,
				"oneLiner": "Unlock Your Potential: Transform with EMS Fitness!",
				"imageDescription": "The ad features a vibrant and eye-catching image of a cup of Baskin' Coffee's nitro blend with cascading swirls of creaminess. The style is modern and captivating, engaging viewers to experience the extraordinary flavor.",
				"adOrientation": "Modern and captivating visuals that stand out.",
				"text": "Visualize the best version of yourself with just 20 minutes a week using our state-of-the-art EMS technology! We harness the power of electrical muscle stimulation to maximize your workouts, sculpting your physique efficiently and effectively. Say goodbye to endless hours at the gym and hello to rapid, visible results. Join the fitness revolution and experience the transformation with us – your journey to a fitter, stronger you awaits!",
				"rationale": "This ad makes sense because it showcases the unique qualities of Baskin' Coffee's nitro blends in an engaging and visually appealing manner. The one-liner 'Escape the Ordinary' evokes curiosity and invites viewers to try something extraordinary.",
				"adCreativeId": "656ec8a786966c0bc5d4373c",
				"createdAt": "2023-12-05T06:52:22.621Z",
				"updatedAt": "2023-12-05T06:52:22.621Z"
			},
		]
	},
	updatedMessages: [
		{
			"id": "656ec82886966c0bc5d43736",
			"content": "Thanks for providing the additional details, James! I have a clear understanding of your requirements now. Based on the information you've shared, I'm confident in designing engaging Facebook ads for Baskin' Coffee. Here's a summary of our conversation so far:\n\nSummary:\nBaskin' Coffee is a new coffee chain specializing in nitro blends, located in Manhattan. The nitro blends are known for their smooth texture, creamy mouthfeel, and visually appealing frothy head. The unique selling point is the enhanced sweetness and reduced acidity achieved through the infusion of high-quality cold brew coffee with nitrogen gas. The target audience includes coffee drinkers in general, with a special focus on the Gen Z crowd who are more inclined towards cold drinks. Baskin' Coffee has no existing brand logo and is looking to attract customers from surrounding coffee shops in the SoHo area. They offer a membership program where customers can earn a free drink after purchasing 10 drinks.",
			"role": "assistant",
			"conversationId": "656ec68f03b0997ed7c52c06",
			"createdAt": "2023-12-05T06:50:16.053Z",
			"updatedAt": "2023-12-05T06:50:16.053Z",
			"adCreatives": [],
			"serialOrder": 6
		},
		{
			"id": "656ec82786966c0bc5d43735",
			"content": "6. Our nitro blends stand out due to their exceptionally smooth texture and creamy mouthfeel, achieved by infusing high-quality cold brew coffee with nitrogen gas. This process not only enhances the coffee's natural sweetness and reduces its acidity but also creates a visually appealing, frothy head, offering a unique and indulgent coffee experience without the need for added sugar or cream.\n\n7. We offer membership to our shops, where after purchase of 10 drinks, you get the next one free.\n\n8. Anything that will help me get more customers to my coffee shop\n\n9. No\n\n10. I want to run them indefinitely so that I can always get new customers.",
			"role": "user",
			"conversationId": "656ec68f03b0997ed7c52c06",
			"createdAt": "2023-12-05T06:50:15.271Z",
			"updatedAt": "2023-12-05T06:50:15.271Z",
			"adCreatives": [],
			"serialOrder": 5
		},
		{
			"id": "656ec76a86966c0bc5d43734",
			"content": "Thanks for providing the information, James! I now have a better understanding of your needs. Let's dive deeper into your requirements to create captivating Facebook ads for Baskin' Coffee. Here are a few more questions:\n\n6. Could you provide some insights on the unique selling points of your nitro blends? What makes them stand out from your competitors?\n7. Are there any specific promotions or discounts you'd like to highlight in these Facebook ads to attract customers?\n8. Could you share any specific preferences for the ad layout and theme? For example, do you prefer a minimalist design or a vibrant and colorful ad?\n9. Do you have any specific dimensions or specifications in mind for the Facebook ads? For example, do you want them to be in square or rectangular format?\n10. How long do you want these ads to run on Facebook? Are there any specific dates or events you'd like to align them with?\n\nI'll eagerly wait for your responses to these questions. Once I have all the necessary details, I'll be able to design the perfect Facebook ads for Baskin' Coffee.",
			"role": "assistant",
			"conversationId": "656ec68f03b0997ed7c52c06",
			"createdAt": "2023-12-05T06:47:06.649Z",
			"updatedAt": "2023-12-05T06:47:06.649Z",
			"adCreatives": [],
			"serialOrder": 4
		},
		{
			"id": "656ec76a86966c0bc5d43733",
			"content": "Sure, here is the information you asked for:\n\n1. Baskin' Coffee is a new coffee chain started in Manhattan, we specialize in nitro blends. I am the owner of the company.\n2. We serve all the classics like latte, mocha etc. but as I mentioned we special in nitro blends.\n3. Our target audience is all coffee drinkers with special focus on Gen Z crowd as they prefer cold drinks.\n4. No existing brand logo.\n5. All surrounding coffee shops in the SoHo area are our competitors.",
			"role": "user",
			"conversationId": "656ec68f03b0997ed7c52c06",
			"createdAt": "2023-12-05T06:47:05.887Z",
			"updatedAt": "2023-12-05T06:47:05.887Z",
			"adCreatives": [],
			"serialOrder": 3
		},
		{
			"id": "656ec69f86966c0bc5d43732",
			"content": "Hi James! I'm Arti, an AI with a background in advertising. Nice to meet you! I'd love to assist you in creating captivating Facebook ads for your business, Baskin' Coffee. To get started, could you please provide me with some more information?\n\n1. Can you tell me a bit about your role at Baskin' Coffee? Are you the owner, marketing manager, or in another position?\n2. What products or services does Baskin' Coffee offer?\n3. Who is your target audience? Are there any specific demographics or customer segments you would like to target with these Facebook ads?\n4. Do you have any existing branding or design elements that should be incorporated into these ads?\n5. Can you tell me a bit about your competitors in the coffee industry? Are there any particular strengths or weaknesses that you would like to highlight or overcome with these ads?\n\nPlease take your time to answer these questions. The more details you provide, the better I can assist you in designing the perfect ad.",
			"role": "assistant",
			"conversationId": "656ec68f03b0997ed7c52c06",
			"createdAt": "2023-12-05T06:43:43.554Z",
			"updatedAt": "2023-12-05T06:43:43.554Z",
			"adCreatives": [],
			"serialOrder": 2
		},
		{
			"id": "656ec69e86966c0bc5d43731",
			"content": "I am James, owner of Baskin' Coffee. I want to create Facebook ADs for my business.",
			"role": "user",
			"conversationId": "656ec68f03b0997ed7c52c06",
			"createdAt": "2023-12-05T06:43:42.790Z",
			"updatedAt": "2023-12-05T06:43:42.790Z",
			"adCreatives": [],
			"serialOrder": 1
		}
	],
	updatedAdCreativeMessages: [
		{
			"id": "656ec8a686966c0bc5d4373b",
			"content": "{\n  \"summary\": \"Baskin' Coffee is a new coffee chain specializing in nitro blends. The nitro blends offer a smooth texture, creamy mouthfeel, and visually appealing frothy head. The target audience includes coffee drinkers in general, with a special focus on the Gen Z crowd. Baskin' Coffee offers a membership program where customers can earn a free drink after purchasing 10 drinks. The objective of the Facebook ads is to attract new customers and promote Baskin' Coffee's nitro blends.\",\n  \"variants\": [\n    {\n      \"confidence\": \"95%\",\n      \"adType\": \"Facebook Ad\",\n      \"variantNo\": \"1\",\n      \"imageUrl\": \"https://example.com/image1.jpg\",\n      \"oneLiner\": \"Escape the Ordinary\",\n      \"imageDescription\": \"The ad features a vibrant and eye-catching image of a cup of Baskin' Coffee's nitro blend with cascading swirls of creaminess. The style is modern and captivating, engaging viewers to experience the extraordinary flavor.\",\n      \"adOrientation\": \"Modern and captivating visuals that stand out.\",\n      \"rationale\": \"This ad makes sense because it showcases the unique qualities of Baskin' Coffee's nitro blends in an engaging and visually appealing manner. The one-liner 'Escape the Ordinary' evokes curiosity and invites viewers to try something extraordinary.\",\n      \"text\": \"Step into a world of extraordinary flavors at Baskin' Coffee. Our nitro blends offer a smooth and creamy mouthfeel that will take your coffee experience to new heights. Join our membership program and earn a free drink after 10 purchases. Visit us in SoHo and escape the ordinary!\"\n    },\n    {\n      \"confidence\": \"90%\",\n      \"adType\": \"Facebook Ad\",\n      \"variantNo\": \"2\",\n      \"imageUrl\": \"https://example.com/image2.jpg\",\n      \"oneLiner\": \"Fuel Your Day with Nitro Magic\",\n      \"imageDescription\": \"The ad features a captivating image of Baskin' Coffee's nitro blend pouring into a cup, creating a mesmerizing visual display. The style is enchanting and engaging, enticing viewers to experience the magic of our nitro blend.\",\n      \"adOrientation\": \"Enchanting visuals that captivate the audience.\",\n      \"rationale\": \"This ad makes sense because it creates a sense of enchantment and magic around Baskin' Coffee's nitro blends. The one-liner 'Fuel Your Day with Nitro Magic' invites viewers to start their day with a powerful and extraordinary coffee experience.\",\n      \"text\": \"Start your day with a touch of magic at Baskin' Coffee. Our nitro blends offer a smooth and powerful kick to fuel your day. Join our membership program and earn a free drink after 10 purchases. Find us in SoHo and experience the magic of Baskin' Coffee!\"\n    }\n  ],\n  \"disclaimer\": \"Disclaimer: The content of these ads is randomly generated and does not reflect any specific information about Baskin' Coffee or its products.\",\n  \"companyName\": \"Baskin' Coffee\",\n  \"adObjective\": \"To attract new customers and promote Baskin' Coffee's nitro blends\"\n}",
			"role": "assistant",
			"conversationId": "656ec68f03b0997ed7c52c06",
			"createdAt": "2023-12-05T06:52:22.621Z",
			"updatedAt": "2023-12-05T06:52:22.621Z",
			"adCreatives": [
				{
					"id": "656ec8a786966c0bc5d4373c",
					"conversationId": "656ec68f03b0997ed7c52c06",
					"adObjective": "To attract new customers and promote Baskin' Coffee's nitro blends",
					"json": "{\n  \"summary\": \"Baskin' Coffee is a new coffee chain specializing in nitro blends. The nitro blends offer a smooth texture, creamy mouthfeel, and visually appealing frothy head. The target audience includes coffee drinkers in general, with a special focus on the Gen Z crowd. Baskin' Coffee offers a membership program where customers can earn a free drink after purchasing 10 drinks. The objective of the Facebook ads is to attract new customers and promote Baskin' Coffee's nitro blends.\",\n  \"variants\": [\n    {\n      \"confidence\": \"95%\",\n      \"adType\": \"Facebook Ad\",\n      \"variantNo\": \"1\",\n      \"imageUrl\": \"https://example.com/image1.jpg\",\n      \"oneLiner\": \"Escape the Ordinary\",\n      \"imageDescription\": \"The ad features a vibrant and eye-catching image of a cup of Baskin' Coffee's nitro blend with cascading swirls of creaminess. The style is modern and captivating, engaging viewers to experience the extraordinary flavor.\",\n      \"adOrientation\": \"Modern and captivating visuals that stand out.\",\n      \"rationale\": \"This ad makes sense because it showcases the unique qualities of Baskin' Coffee's nitro blends in an engaging and visually appealing manner. The one-liner 'Escape the Ordinary' evokes curiosity and invites viewers to try something extraordinary.\",\n      \"text\": \"Step into a world of extraordinary flavors at Baskin' Coffee. Our nitro blends offer a smooth and creamy mouthfeel that will take your coffee experience to new heights. Join our membership program and earn a free drink after 10 purchases. Visit us in SoHo and escape the ordinary!\"\n    },\n    {\n      \"confidence\": \"90%\",\n      \"adType\": \"Facebook Ad\",\n      \"variantNo\": \"2\",\n      \"imageUrl\": \"https://example.com/image2.jpg\",\n      \"oneLiner\": \"Fuel Your Day with Nitro Magic\",\n      \"imageDescription\": \"The ad features a captivating image of Baskin' Coffee's nitro blend pouring into a cup, creating a mesmerizing visual display. The style is enchanting and engaging, enticing viewers to experience the magic of our nitro blend.\",\n      \"adOrientation\": \"Enchanting visuals that captivate the audience.\",\n      \"rationale\": \"This ad makes sense because it creates a sense of enchantment and magic around Baskin' Coffee's nitro blends. The one-liner 'Fuel Your Day with Nitro Magic' invites viewers to start their day with a powerful and extraordinary coffee experience.\",\n      \"text\": \"Start your day with a touch of magic at Baskin' Coffee. Our nitro blends offer a smooth and powerful kick to fuel your day. Join our membership program and earn a free drink after 10 purchases. Find us in SoHo and experience the magic of Baskin' Coffee!\"\n    }\n  ],\n  \"disclaimer\": \"Disclaimer: The content of these ads is randomly generated and does not reflect any specific information about Baskin' Coffee or its products.\",\n  \"companyName\": \"Baskin' Coffee\",\n  \"adObjective\": \"To attract new customers and promote Baskin' Coffee's nitro blends\"\n}",
					"companyName": "Baskin' Coffee",
					"disclaimer": "Disclaimer: The content of these ads is randomly generated and does not reflect any specific information about Baskin' Coffee or its products.",
					"summary": "Baskin' Coffee is a new coffee chain specializing in nitro blends. The nitro blends offer a smooth texture, creamy mouthfeel, and visually appealing frothy head. The target audience includes coffee drinkers in general, with a special focus on the Gen Z crowd. Baskin' Coffee offers a membership program where customers can earn a free drink after purchasing 10 drinks. The objective of the Facebook ads is to attract new customers and promote Baskin' Coffee's nitro blends.",
					"createdAt": "2023-12-05T06:52:22.621Z",
					"updatedAt": "2023-12-05T06:52:22.621Z",
					"variants": [
						{
							"id": "656ec8a786966c0bc5d4373d",
							"variantNo": "1",
							"adType": "Facebook Ad",
							"confidence": null,
							"image": null,
							"imageUrl": "https://i.ibb.co/P1whHDb/Whats-App-Image-2023-12-05-at-12-38-22-PM.jpg",
							"oneLiner": "Escape the Ordinary",
							"imageDescription": "The ad features a vibrant and eye-catching image of a cup of Baskin' Coffee's nitro blend with cascading swirls of creaminess. The style is modern and captivating, engaging viewers to experience the extraordinary flavor.",
							"adOrientation": "Modern and captivating visuals that stand out.",
							"text": "Step into a world of extraordinary flavors at Baskin' Coffee. Our nitro blends offer a smooth and creamy mouthfeel that will take your coffee experience to new heights. Join our membership program and earn a free drink after 10 purchases. Visit us in SoHo and escape the ordinary!",
							"rationale": "This ad makes sense because it showcases the unique qualities of Baskin' Coffee's nitro blends in an engaging and visually appealing manner. The one-liner 'Escape the Ordinary' evokes curiosity and invites viewers to try something extraordinary.",
							"adCreativeId": "656ec8a786966c0bc5d4373c",
							"createdAt": "2023-12-05T06:52:22.621Z",
							"updatedAt": "2023-12-05T06:52:22.621Z"
						},
						{
							"id": "656ec8a786966c0bc5d4373e",
							"variantNo": "2",
							"adType": "Facebook Ad",
							"confidence": null,
							"image": null,
							"imageUrl": "https://srs-billing-storage.s3.ap-south-1.amazonaws.com/656ec8a786966c0bc5d4373e_1701759160697.png",
							"oneLiner": "Fuel Your Day with Nitro Magic",
							"imageDescription": "The ad features a captivating image of Baskin' Coffee's nitro blend pouring into a cup, creating a mesmerizing visual display. The style is enchanting and engaging, enticing viewers to experience the magic of our nitro blend.",
							"adOrientation": "Enchanting visuals that captivate the audience.",
							"text": "Start your day with a touch of magic at Baskin' Coffee. Our nitro blends offer a smooth and powerful kick to fuel your day. Join our membership program and earn a free drink after 10 purchases. Find us in SoHo and experience the magic of Baskin' Coffee!",
							"rationale": "This ad makes sense because it creates a sense of enchantment and magic around Baskin' Coffee's nitro blends. The one-liner 'Fuel Your Day with Nitro Magic' invites viewers to start their day with a powerful and extraordinary coffee experience.",
							"adCreativeId": "656ec8a786966c0bc5d4373c",
							"createdAt": "2023-12-05T06:52:22.621Z",
							"updatedAt": "2023-12-05T06:52:22.621Z"
						}
					]
				}
			],
			"serialOrder": 8
		},
		{
			"id": "656ec82886966c0bc5d43736",
			"content": "Thanks for providing the additional details, James! I have a clear understanding of your requirements now. Based on the information you've shared, I'm confident in designing engaging Facebook ads for Baskin' Coffee. Here's a summary of our conversation so far:\n\nSummary:\nBaskin' Coffee is a new coffee chain specializing in nitro blends, located in Manhattan. The nitro blends are known for their smooth texture, creamy mouthfeel, and visually appealing frothy head. The unique selling point is the enhanced sweetness and reduced acidity achieved through the infusion of high-quality cold brew coffee with nitrogen gas. The target audience includes coffee drinkers in general, with a special focus on the Gen Z crowd who are more inclined towards cold drinks. Baskin' Coffee has no existing brand logo and is looking to attract customers from surrounding coffee shops in the SoHo area. They offer a membership program where customers can earn a free drink after purchasing 10 drinks.\n\nTo design captivating Facebook ads, I'd like to present two variants for you:\n\nVariant 1:\n- Confidence: 95%\n- Ad Type: Facebook Ad\n- Variant Number: 1\n- Image URL: {Image URL}\n- Catchy phrase: \"Indulge in the Creamiest Nitro Blends!\"\n- Image description: The ad features a close-up of a frothy nitro coffee with a smooth texture and a creamy mouthfeel, visually highlighting the unique selling point of Baskin' Coffee's nitro blends. The style is vibrant and eye-catching, inviting viewers to experience a delightful coffee moment.\n- Ad layout and theme: Vibrant and captivating visuals showcasing the signature nitro blends.\n- Ad copy:\n\"Discover a new coffee experience at Baskin' Coffee! Our nitro blends are specially crafted to provide a smooth and creamy mouthfeel. Enjoy the rich flavors and visually stunning frothy head. Join our membership program and earn a free drink after 10 purchases. Visit us in SoHo and indulge in the creamiest nitro blends!\"\n\nVariant 2:\n- Confidence: 90%\n- Ad Type: Facebook Ad\n- Variant Number: 2\n- Image URL: {Image URL}\n- Catchy phrase: \"Unlock the Nitro Bliss!\"\n- Image description: The ad features a group of enthusiastic Gen Z coffee lovers enjoying Baskin' Coffee's nitro blends in a cozy and trendy coffee shop atmosphere. The frame captures the joy and excitement of the coffee-drinking experience, while the subject showcases the frothy nitro blends in the hands of happy customers.\n- Ad layout and theme: Cozy and trendy coffee shop ambiance evoking a sense of community and enjoyment.\n- Ad copy:\n\"Calling all coffee enthusiasts! Experience the bliss of our signature nitro blends at Baskin' Coffee. Sip on the smoothest, creamiest coffee you've ever tasted. Join our membership program and earn a free drink after 10 purchases. Find us in SoHo and unlock the nitro bliss!\"\n\nDisclaimer: The content of these ads is based on the information provided by James, the owner of Baskin' Coffee. The aim is to engage the target audience and promote the unique qualities of Baskin' Coffee's nitro blends.\n\nCompany Name: Baskin' Coffee\nAd Objective: To attract new customers and promote Baskin' Coffee's nitro blends\n\nPlease note that the image URLs will need to be provided by you. Let me know if you have any further questions or if there's anything else I can assist you with!",
			"role": "assistant",
			"conversationId": "656ec68f03b0997ed7c52c06",
			"createdAt": "2023-12-05T06:50:16.053Z",
			"updatedAt": "2023-12-05T06:50:16.053Z",
			"adCreatives": [],
			"serialOrder": 6
		},
		{
			"id": "656ec82786966c0bc5d43735",
			"content": "6. Our nitro blends stand out due to their exceptionally smooth texture and creamy mouthfeel, achieved by infusing high-quality cold brew coffee with nitrogen gas. This process not only enhances the coffee's natural sweetness and reduces its acidity but also creates a visually appealing, frothy head, offering a unique and indulgent coffee experience without the need for added sugar or cream.\n\n7. We offer membership to our shops, where after purchase of 10 drinks, you get the next one free.\n\n8. Anything that will help me get more customers to my coffee shop\n\n9. No\n\n10. I want to run them indefinitely so that I can always get new customers.",
			"role": "user",
			"conversationId": "656ec68f03b0997ed7c52c06",
			"createdAt": "2023-12-05T06:50:15.271Z",
			"updatedAt": "2023-12-05T06:50:15.271Z",
			"adCreatives": [],
			"serialOrder": 5
		},
		{
			"id": "656ec76a86966c0bc5d43734",
			"content": "Thanks for providing the information, James! I now have a better understanding of your needs. Let's dive deeper into your requirements to create captivating Facebook ads for Baskin' Coffee. Here are a few more questions:\n\n6. Could you provide some insights on the unique selling points of your nitro blends? What makes them stand out from your competitors?\n7. Are there any specific promotions or discounts you'd like to highlight in these Facebook ads to attract customers?\n8. Could you share any specific preferences for the ad layout and theme? For example, do you prefer a minimalist design or a vibrant and colorful ad?\n9. Do you have any specific dimensions or specifications in mind for the Facebook ads? For example, do you want them to be in square or rectangular format?\n10. How long do you want these ads to run on Facebook? Are there any specific dates or events you'd like to align them with?\n\nI'll eagerly wait for your responses to these questions. Once I have all the necessary details, I'll be able to design the perfect Facebook ads for Baskin' Coffee.",
			"role": "assistant",
			"conversationId": "656ec68f03b0997ed7c52c06",
			"createdAt": "2023-12-05T06:47:06.649Z",
			"updatedAt": "2023-12-05T06:47:06.649Z",
			"adCreatives": [],
			"serialOrder": 4
		},
		{
			"id": "656ec76a86966c0bc5d43733",
			"content": "Sure, here is the information you asked for:\n\n1. Baskin' Coffee is a new coffee chain started in Manhattan, we specialize in nitro blends. I am the owner of the company.\n2. We serve all the classics like latte, mocha etc. but as I mentioned we special in nitro blends.\n3. Our target audience is all coffee drinkers with special focus on Gen Z crowd as they prefer cold drinks.\n4. No existing brand logo.\n5. All surrounding coffee shops in the SoHo area are our competitors.",
			"role": "user",
			"conversationId": "656ec68f03b0997ed7c52c06",
			"createdAt": "2023-12-05T06:47:05.887Z",
			"updatedAt": "2023-12-05T06:47:05.887Z",
			"adCreatives": [],
			"serialOrder": 3
		},
		{
			"id": "656ec69f86966c0bc5d43732",
			"content": "Hi James! I'm Arti, an AI with a background in advertising. Nice to meet you! I'd love to assist you in creating captivating Facebook ads for your business, Baskin' Coffee. To get started, could you please provide me with some more information?\n\n1. Can you tell me a bit about your role at Baskin' Coffee? Are you the owner, marketing manager, or in another position?\n2. What products or services does Baskin' Coffee offer?\n3. Who is your target audience? Are there any specific demographics or customer segments you would like to target with these Facebook ads?\n4. Do you have any existing branding or design elements that should be incorporated into these ads?\n5. Can you tell me a bit about your competitors in the coffee industry? Are there any particular strengths or weaknesses that you would like to highlight or overcome with these ads?\n\nPlease take your time to answer these questions. The more details you provide, the better I can assist you in designing the perfect ad.",
			"role": "assistant",
			"conversationId": "656ec68f03b0997ed7c52c06",
			"createdAt": "2023-12-05T06:43:43.554Z",
			"updatedAt": "2023-12-05T06:43:43.554Z",
			"adCreatives": [],
			"serialOrder": 2
		},
	]
}

export enum ViewScreen {
	LAPTOP = 'laptop',
	MOBILE = 'mobile',
	SCREEN = 'screen'
}

export const screens = [
	{id: '1', label: 'Laptop', value: ViewScreen.LAPTOP, Icon: MacSVG},
	{id: '2', label: 'Mobile', value: ViewScreen.MOBILE, Icon: IphoneSVG},
	{id: '3', label: 'Desktop', value: ViewScreen.SCREEN, Icon: ScreenSVG},
]

type ScreenView = ViewScreen | undefined | null;
export class Mock {
	private readonly screenView: ScreenView;

	get isLaptop() {
		return this.screenView === ViewScreen.LAPTOP;
	}

	get isMobile() {
		return this.screenView === ViewScreen.MOBILE;
	}

	get isScreen() {
		return this.screenView === ViewScreen.SCREEN;
	}

	get is() {
		return this.screenView !== null && this.screenView !== undefined;
	}

	constructor(screenView?: ScreenView) {
		this.screenView = screenView;
	}
}
