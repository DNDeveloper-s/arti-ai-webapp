import {ChatGPTMessageObj} from '@/constants/artibotData';
import {AdCreative} from '@/interfaces/AdCreative';

export interface Conversation {
	id: string;
	messages: ChatGPTMessageObj[];
	last_activity: number | string | Date;
	title: string;
	json?: string | null | boolean;
	ad_creative?: AdCreative
}
