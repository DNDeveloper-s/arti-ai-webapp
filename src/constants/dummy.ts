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

export const dummyEssay = `
The Cow: A Sacred and Essential Animal

The cow, scientifically known as Bos taurus, holds a unique and revered place in the world's cultural, economic, and ecological landscape. This remarkable animal has been domesticated for thousands of years and plays a crucial role in various aspects of human life, from agriculture to spirituality. In this essay, we will explore the multifaceted significance of cows in our society, delving into their historical importance, economic contributions, cultural and religious symbolism, and environmental impact.

Cows have been a part of human civilization for millennia. Their domestication dates back to around 10,000 years ago, making them one of the earliest animals to be tamed by humans. This historical connection is a testament to the significance of the cow in our development as a species. They provided early human societies with sustenance in the form of meat and milk, along with leather and bones for tools and clothing. The bond formed with cows during this period set the stage for a deep and enduring relationship between humans and cattle.

One of the most obvious and substantial contributions of cows to human society is their role in agriculture. These gentle herbivores are adept at converting plant materials, often inedible to humans, into valuable resources. Their primary product, milk, is a staple in many diets worldwide and serves as a vital source of nutrition, particularly for young children. The production of milk and dairy products has become a thriving industry, and cows are central to this process. Not only do they provide milk, but they also yield meat, leather, and other byproducts that play a crucial role in the global economy.

In addition to their economic significance, cows are deeply embedded in the cultural and religious fabric of various societies. This is especially evident in countries like India, where the cow holds a sacred status. The cow is revered as a symbol of purity, motherhood, and abundance in Hinduism, and it plays a central role in various religious rituals and ceremonies. The "Gau Mata" (Mother Cow) is not only a source of sustenance but a source of spiritual nourishment for millions of people.

Similarly, in many other cultures, the cow has been a symbol of prosperity and fertility. In ancient Egyptian civilization, the goddess Hathor was often depicted with the head of a cow, symbolizing her role as the goddess of love, music, and motherhood. In Greek mythology, Io, a priestess, was transformed into a cow by Zeus to protect her from his jealous wife Hera. This mythology highlights the cow's symbolism as a protective and nurturing figure.

Furthermore, the cow has been a source of inspiration in literature, art, and folklore throughout history. Cows have appeared in numerous folktales, often representing traits like patience, nurturing, and endurance. In literature, they have featured prominently in works such as George Orwell's "Animal Farm," where they symbolize the working class and the exploited masses.

Environmental factors are another critical dimension of the cow's significance. Cattle farming, particularly in modern industrialized agriculture, has raised environmental concerns, particularly with regards to deforestation, greenhouse gas emissions, and water usage. The vast tracts of land required for cattle grazing and feed production have contributed to deforestation in various parts of the world. Additionally, cows produce methane, a potent greenhouse gas, during digestion, which contributes to global warming. Managing the environmental impact of cattle farming is a critical concern, and efforts to improve the sustainability of the industry are ongoing.

Despite these environmental concerns, cows also play a vital role in sustainable agriculture. Traditional and sustainable farming methods often involve the use of cattle in a way that minimizes negative environmental impacts. They can help fertilize fields and manage vegetation, reducing the need for synthetic fertilizers and herbicides. Additionally, their manure can be a valuable source of natural fertilizer.

The cultural and economic significance of cows extends beyond their traditional uses. In recent years, their importance has been acknowledged in various fields, including biotechnology. Cows have been used in the development of pharmaceuticals, and their milk has been genetically modified to produce substances with potential medical benefits, such as therapeutic proteins. This intersection of biotechnology and cattle farming showcases the adaptability and versatility of these animals.

In conclusion, the cow is a remarkable creature that has played an integral role in human history and continues to be essential to our lives today. From the early days of agriculture to the modern dairy and meat industries, cows have been a cornerstone of human sustenance and economic activity. They hold a revered position in numerous cultures and religions, symbolizing qualities of purity, motherhood, and abundance. While their environmental impact is a subject of concern, cows can also play a role in sustainable agriculture. The cow, as both a source of sustenance and a symbol of cultural and religious significance, continues to be a central figure in the tapestry of human existence. It is our responsibility to balance the various aspects of the cow's significance, promoting sustainable practices that respect both the animal and the environment.
`

export const dummySuggestions = [
	'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don\'t look even slightly believable.',
	'Despite these environmental concerns, cows also play a vital role in sustainable agriculture. Traditional and sustainable farming methods often involve the use of cattle in a way that minimizes negative environmental impacts. They can help fertilize fields and manage vegetation',
	'If you are going to use a passage of Lorem Ipsum, you need to be sure there isn\'t anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet.'
]

export const dummy: Dummy = {
	Ad_Creatives,
	Conversations,
	DConversations,
	DAd_Creatives,
	dummySuggestions,
	Messages
}