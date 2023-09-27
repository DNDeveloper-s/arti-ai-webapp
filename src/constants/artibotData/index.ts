import {IconType} from 'react-icons';
import {FEEDBACK, FeedBackKeyProperty} from '@/interfaces/AdCreative';

export interface TabItem {
	id: TabId,
	label: string,
	icon?: IconType,
	color: string
}

export interface FeedBackKey {
	id: FeedBackKeyProperty;
	label: string;
}

export interface FileObject {
	id: number;
	url: string;
	type: string;
	name: string;
	size: number;
}

type MessageType = 'text' | 'attachment' | 'ad-json';

export interface MessageObj {
	id: string;
	is_ai_response: boolean;
	message: string;
	timestamp: string;
	type: MessageType;
	attachments?: FileObject[];
	json?: string;
}

// export type MessageObj = ChatGPTMessageObj;
export enum ChatGPTRole {
	'USER' = 'user',
	'ASSISTANT' = 'assistant'
}

export interface ChatGPTMessageObj {
	id?: string;
	role: ChatGPTRole;
	content: string;
	generating?: boolean;
	type?: 'ad-json' | 'text' | 'attachment';
	json?: string;
}

export interface ArtiBotData {
	tabItems: TabItem[],
	feedBackKeys: FeedBackKey[]
}

export type AdType = "Instagram Story Ad" | "LinkedIn Sponsored Content" | "Google Display Ad" | "YouTube Pre-roll Ad" | "Facebook Ad";

export interface IAdVariant {
	'Variant': number;
	'Ad Type': AdType;
	'Image Url': string;
	'Text': string;
	'One Liner': string;
	'Image Description': string;
	'Ad orientation': string;
	'Rationale': string;
}

export interface AdJSONInput {
	Confidence: string;
	'Token Count': number;
	'Disclaimer': string;
	'Company Name': string;
	'Date_Time': string;
	'Ad Objective': string;
	'Summary': string;
	'Ads': IAdVariant[]
}

export type TabId = 'Facebook' | 'YouTube' | 'Google' | 'LinkedIn' | 'Instagram'

export const artiBotData: ArtiBotData = {
	tabItems: [{
		id: 'Facebook',
		label: 'Ad Variant #1',
		// icon: FaYoutube,
		color: '#CD201F'
	}, {
		id: 'YouTube',
		label: 'Ad Variant #2',
		// icon: FaYoutube,
		color: '#CD201F'
	}, {
		id: 'Google',
		label: 'Ad Variant #3',
		// icon: FaYoutube,
		color: '#CD201F'
	}, {
		id: 'LinkedIn',
		label: 'Ad Variant #4',
		// icon: FaYoutube,
		color: '#CD201F'
	}, {
		id: 'Instagram',
		label: 'Ad Variant #5',
		// icon: FaYoutube,
		color: '#CD201F'
	}],
	feedBackKeys: [{
		id: FEEDBACK.ONE_LINER,
		label: 'One Liner'
	},{
		id: FEEDBACK.AD_ORIENTATION,
		label: 'Ad Orientation'
	}, {
		id: FEEDBACK.IMAGE_DESCRIPTION,
		label: 'Image Description'
	}, {
		id: FEEDBACK.RATIONALE,
		label: 'Rationale'
	}, {
		id: FEEDBACK.AD_VARIANT_IMAGE,
		label: 'Ad Variant Image'
	}, {
		id: FEEDBACK.IMAGE_TEXT,
		label: 'Image text'
	}]
}
