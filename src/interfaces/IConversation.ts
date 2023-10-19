import {ChatGPTMessageObj, ChatGPTRole} from '@/interfaces/IArtiBot';
import {IAdCreative} from '@/interfaces/IAdCreative';
import ObjectId from 'bson-objectid';

export interface IConversation extends MongooseModel {
	id: string;
	messages: ChatGPTMessageObj[];
	last_activity: number | string | Date;
	title: string;
	has_activity?: boolean | undefined;
	json?: string | null | boolean;
	adCreatives?: IAdCreative[];
	conversation_type: ConversationType;
	project_name: string;
}

export enum ConversationType {
	'STRATEGY' = 'strategy',
	'AD_CREATIVE' = 'ad_creative',
}

export interface MongooseModel {
	createdAt?: Date,
	updatedAt?: Date,
}

export interface IMessageModel extends MongooseModel {
	id: string,
	role: ChatGPTRole,
	content: string,
	conversationId: string,
}

export interface IConversationModel extends MongooseModel {
	id: string;
	messages: IMessageModel[];
	userId: string;
	conversation_type: ConversationType;
}
