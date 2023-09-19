'use client';

import {artiBotData, FeedBackKey} from '@/constants/artibotData';
import React, {FC, useRef, useState} from 'react';
import {AiFillDislike, AiFillLike} from 'react-icons/ai';
import {MdFeedback} from 'react-icons/md';
import {motion} from 'framer-motion';
import {Simulate} from 'react-dom/test-utils';
import change = Simulate.change;
import {timeSince, wait} from '@/helpers';
import TextArea from '@/components/TextArea';
import ReactionIcon from '@/components/ArtiBot/ReactionIcon';
import reactionIcon from '@/components/ArtiBot/ReactionIcon';

interface FeedBackKeyItemProps {
	feedBackKey: FeedBackKey;
}

export enum REACTION {
	'LIKED' = 'liked',
	'DISLIKED' = 'disliked',
	'NONE' = 'none'
}

const FeedBackKeyItem: FC<FeedBackKeyItemProps> = ({feedBackKey}) => {
	const [expand, setExpand] = useState(false);
	const [reactionState, setReactionState] = useState<REACTION>();

	async function handleSave() {
		await wait(1000);
	}

	function handleLike() {
		setReactionState(c => c === REACTION.LIKED ? REACTION.NONE : REACTION.LIKED);
	}

	function handleDislike() {
		setReactionState(c => c === REACTION.DISLIKED ? REACTION.NONE : REACTION.DISLIKED);
	}

	return (
		<>
			<div className="flex justify-between items-center py-3 first:py-3" key={feedBackKey.id}>
				<p className="text-white text-sm">{feedBackKey.label}</p>
				<div className="flex items-center">
					<ReactionIcon reacted={reactionState === REACTION.LIKED} onClick={handleLike} />
					{/*<AiFillLike className="mr-[0.5em] hover:scale-[1.1] transition-all text-[1.2em] cursor-pointer text-secondaryText" />*/}
					<ReactionIcon reacted={reactionState === REACTION.DISLIKED} onClick={handleDislike} isDislike />
					<MdFeedback onClick={() => setExpand(c => !c)} className="text-[1.2em] hover:scale-[1.1] transition-all cursor-pointer text-secondaryText" />
				</div>
			</div>
			<motion.div animate={{height: expand ? '100%' : '0'}} className={"overflow-hidden relative"}>
				<TextArea handleSave={handleSave} />
			</motion.div>
		</>
	)
}

export default function FeedBackView() {

	async function handleSave() {
		await wait(1000);
	}

	return (
		<>
			<div className="w-[80%] mt-6">
				<label htmlFor="message" className="block text-sm font-light text-white text-opacity-50">Please provide us some
					feedback</label>
				<div className="mb-6 divide-y divide-gray-800 bg-secondaryBackground p-5 py-1 mt-3 rounded-lg">
					{artiBotData.feedBackKeys.map(feedBackKey => (
						<FeedBackKeyItem key={feedBackKey.id} feedBackKey={feedBackKey} />
					))}
				</div>
				{/*<label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your*/}
				{/*	feedback</label>*/}
				<TextArea placeholder="Write your overall feedback here..." handleSave={handleSave} rows={5} />
			</div>
		</>
	)
}
