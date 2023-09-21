import {StaticImageData} from 'next/image';

export type FILE_TYPE = 'pdf' | 'image' | 'txt' | 'doc' | string;

export interface AttachmentDetails {
	url: string | StaticImageData;
	type: FILE_TYPE;
	name?: string;
}

export type ModalDispatchAction<T> = T | boolean | null;

export enum REACTION {
	'LIKED' = 'liked',
	'DISLIKED' = 'disliked',
	'NEUTRAL' = 'neutral'
}

export type Reaction = REACTION;
