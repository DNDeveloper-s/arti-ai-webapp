import {FaFacebookF, FaFacebookSquare, FaInstagramSquare, FaLinkedin, FaYoutube, FaYoutubeSquare} from 'react-icons/fa';
import {AiFillGoogleSquare, AiOutlineGoogle, AiOutlineInstagram, AiOutlineLinkedin} from 'react-icons/ai';
import {IconType} from 'react-icons';

export interface TabItem {
	id: TabId,
	label: string,
	icon: IconType,
	color: string
}

export interface FeedBackKey {
	id: number;
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

export interface JSONInput {
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
		label: 'Facebook',
		icon: FaFacebookF,
		color: '#1877F2'
	}, {
		id: 'Instagram',
		label: 'Instagram',
		icon: AiOutlineInstagram,
		color: '#fa7e1e'
	}, {
		id: 'LinkedIn',
		label: 'LinkedIn',
		icon: AiOutlineLinkedin,
		color: '#0072b1'
	}, {
		id: 'Google',
		label: 'Google',
		icon: AiOutlineGoogle,
		color: '#3369E8'
	}, {
		id: 'YouTube',
		label: 'Youtube',
		icon: FaYoutube,
		color: '#CD201F'
	}],
	feedBackKeys: [{
		id: 0,
		label: 'One Liner'
	},{
		id: 1,
		label: 'Ad Orientation'
	}, {
		id: 2,
		label: 'Image Description'
	}, {
		id: 3,
		label: 'Rationale'
	}, {
		id: 4,
		label: 'Ad Variant Image'
	}, {
		id: 5,
		label: 'Image text'
	}]
}
