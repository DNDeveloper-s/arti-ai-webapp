import {ChatGPTMessageObj} from '@/constants/artibotData';
import {AdCreative} from '@/interfaces/AdCreative';
import ObjectId from 'bson-objectid';

export interface Conversation {
	id: ObjectId | string;
	messages: ChatGPTMessageObj[];
	last_activity: number | string | Date;
	title: string;
	has_activity?: boolean | undefined;
	json?: string | null | boolean;
	ad_creative?: AdCreative
}
