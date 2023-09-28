import {ChatGPTMessageObj} from '@/interfaces/IArtiBot';
import {IAdCreative} from '@/interfaces/IAdCreative';
import ObjectId from 'bson-objectid';

export interface IConversation {
	id: ObjectId | string;
	messages: ChatGPTMessageObj[];
	last_activity: number | string | Date;
	title: string;
	has_activity?: boolean | undefined;
	json?: string | null | boolean;
	ad_creative?: IAdCreative
}
