import {AdCreative} from '@/interfaces/AdCreative';
import exampleJSON from '@/database/exampleJSON';
import {AdJSONInput, ChatGPTMessageObj, ChatGPTRole} from '@/constants/artibotData';
import {REACTION} from '@/interfaces';
import {Conversation} from '@/interfaces/Conversation';

interface Dummy {
	Ad_Creatives: AdCreative[];
	Conversations: Conversation[];
	Messages: ChatGPTMessageObj[];
}

const json = JSON.parse(exampleJSON) as AdJSONInput;

const Ad_Creatives: AdCreative[] = [{
	json: exampleJSON,
	variants: [{
		...json.Ads[0],
		feedback: {
			overall: {
				feedback_message: 'This is a dummy overall feedback message.',
				reaction: REACTION.LIKED
			},
			one_liner: {
				feedback_message: 'This is a dummy one_liner feedback message.',
				reaction: REACTION.DISLIKED
			},
			rationale: {
				feedback_message: 'This is a dummy rationale feedback message.',
				reaction: REACTION.LIKED
			},
			image_description: {
				feedback_message: 'This is a dummy image_description feedback message.',
				reaction: REACTION.LIKED
			},
			image_text: {
				feedback_message: 'This is a dummy image_text feedback message.',
				reaction: REACTION.DISLIKED
			}
		}
	}, {
		...json.Ads[1],
		feedback: {
			overall: {
				feedback_message: 'This is a dummy overall feedback message for json 2.',
				reaction: REACTION.LIKED
			},
			image_description: {
				feedback_message: 'This is a dummy image_description feedback message.',
				reaction: REACTION.LIKED
			},
			image_text: {
				feedback_message: 'This is a dummy image_text feedback message.',
				reaction: REACTION.DISLIKED
			}
		}
	}]
}];

const Messages = [{
	id: '1',
	role: ChatGPTRole.USER,
	content: 'Hey there?'
}, {
	id: '2',
	role: ChatGPTRole.ASSISTANT,
	content: 'Hello! How can I assist you today'
},{
	id: '3',
	content: 'What about the design and what can I expect for each platforms?',
	role: ChatGPTRole.USER,
},{
	id: '4',
	content: `Of course, I'd be happy to play a game of chess with you! I'll represent the white pieces and you can be black. To make a move, just use standard algebraic notation (e.g., e2 to e4). Let's get started!

Here's the initial board:`,
	role: ChatGPTRole.ASSISTANT,
},{
	id: '5',
	content: 'Thanks for the info. I will reach out to you in a moment.',
	role: ChatGPTRole.USER,
},]

const Conversations = [{
	id: '1',
	json: exampleJSON,
	title: 'Dummy Title',
	ad_creative: Ad_Creatives[0],
	last_activity: Date.now(),
	messages: Messages
}];

export const dummy: Dummy = {
	Ad_Creatives,
	Conversations,
	Messages
}
