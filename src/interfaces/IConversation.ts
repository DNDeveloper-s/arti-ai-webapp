import {ChatGPTMessageObj, ChatGPTRole} from '@/interfaces/IArtiBot';
import {IAdCreative} from '@/interfaces/IAdCreative';
import ObjectId from 'bson-objectid';
import {ISODateString} from 'next-auth';

export interface IConversation extends MongooseModel {
	id: string;
	messages: ChatGPTMessageObj[];
	last_activity: number | string | Date;
	title: string;
	has_activity?: boolean | undefined;
	json?: string | null | boolean;
	adCreatives?: IAdCreative[];
	conversation_type: ConversationType;
	lastAdCreativeCreatedAt?: ISODateString;
	project_name: string;
	lastAdCreativeCreatedAt?: Date;
}

export enum ConversationType {
	'STRATEGY' = 'strategy',
	'AD_CREATIVE' = 'ad_creative',
}

export interface MongooseModel {
	createdAt: ISODateString,
	updatedAt: ISODateString,
}

export interface IMessageModel extends MongooseModel {
	id: string,
	role: ChatGPTRole,
	content: string | null,
	conversationId: string,
}

export interface IConversationModel extends MongooseModel {
	id: string;
	messages: IMessageModel[];
	userId: string;
	conversation_type: ConversationType;
}
