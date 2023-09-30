import {IAdCreative} from '@/interfaces/IAdCreative';
import exampleJSON from '@/database/exampleJSON';
import {AdJSONInput, ChatGPTMessageObj, ChatGPTRole} from '@/interfaces/IArtiBot';
import {REACTION} from '@/interfaces';
import {IConversation} from '@/interfaces/IConversation';
import ObjectID from 'bson-objectid';

interface Dummy {
	Ad_Creatives: IAdCreative[];
	DAd_Creatives: IAdCreative[];
	Conversations: IConversation[];
	DConversations: IConversation[];
	Messages: ChatGPTMessageObj[];
}

const json = JSON.parse(exampleJSON) as AdJSONInput;

const Ad_Creatives: IAdCreative[] = [];

const DAd_Creatives: IAdCreative[] = [{
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
}, {
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
}, {
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

const DConversations = [{
	id: '1',
	json: exampleJSON,
	title: 'Dummy Title',
	ad_creative: Ad_Creatives[0],
	last_activity: Date.now(),
	has_activity: true,
	messages: Messages
}, {
	id: '2',
	json: exampleJSON,
	title: 'Another Message',
	ad_creative: Ad_Creatives[0],
	last_activity: Date.now(),
	has_activity: true,
	messages: Messages
}, {
	id: '3',
	json: exampleJSON,
	title: 'Some Agency',
	ad_creative: Ad_Creatives[0],
	last_activity: Date.now(),
	has_activity: true,
	messages: Messages
}];
const Conversations: IConversation[] = [];

export const dummy: Dummy = {
	Ad_Creatives,
	Conversations,
	DConversations,
	DAd_Creatives,
	Messages
}
