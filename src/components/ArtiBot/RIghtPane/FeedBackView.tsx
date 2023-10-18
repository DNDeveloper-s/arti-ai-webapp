'use client';

import {artiBotData, FeedBackKey} from '@/constants/artibotData';
import React, {FC, useEffect, useState} from 'react';
import {motion} from 'framer-motion';
import {wait} from '@/helpers';
import TextArea from '@/components/TextArea';
import ReactionIcon from '@/components/ArtiBot/ReactionIcon';
import {AdCreativeVariant, Feedback} from '@/interfaces/IAdCreative';
import {REACTION} from '@/interfaces';
import {BiCommentDetail} from 'react-icons/bi';

interface FeedBackKeyItemProps {
	feedBackKey: FeedBackKey;
	feedback?: Feedback
}

const FeedBackKeyItem: FC<FeedBackKeyItemProps> = ({feedBackKey, feedback}) => {
	const [expand, setExpand] = useState(false);
	const [reactionState, setReactionState] = useState<REACTION>(REACTION.NEUTRAL);
	const [feedbackMessage, setFeedbackMessage] = useState<string>(() => {
		return feedback?.feedback_message ?? ''
	});

	const hasFeedbackValue = feedbackMessage.trim().length > 0;

	async function handleSave(val: string) {
		await wait(1000);
		setFeedbackMessage(val);
	}

	useEffect(() => {
		setReactionState(feedback?.reaction ?? REACTION.NEUTRAL);
		setFeedbackMessage(feedback?.feedback_message ?? '');
	}, [feedback])

	function handleLike() {
		setReactionState(c => c === REACTION.LIKED ? REACTION.NEUTRAL : REACTION.LIKED);
	}

	function handleDislike() {
		setReactionState(c => c === REACTION.DISLIKED ? REACTION.NEUTRAL : REACTION.DISLIKED);
	}

	return (
		<>
			<div className="flex justify-between items-center py-3 first:py-3" key={feedBackKey.id}>
				<p className="text-white text-sm">{feedBackKey.label}</p>
				<div className="flex items-center">
					<ReactionIcon reacted={reactionState === REACTION.LIKED} onClick={handleLike} />
					{/*<AiFillLike className="mr-[0.5em] hover:scale-[1.1] transition-all text-[1.2em] cursor-pointer text-secondaryText" />*/}
					<ReactionIcon reacted={reactionState === REACTION.DISLIKED} onClick={handleDislike} isDislike />
					<BiCommentDetail onClick={() => setExpand(c => !c)} className={'text-[1.2em] hover:scale-[1.1] transition-all cursor-pointer ' + (hasFeedbackValue ? ' text-primary' : 'text-secondaryText')} />
				</div>
			</div>
			<motion.div animate={{height: expand ? '100%' : '0'}} className={"overflow-hidden relative"}>
				<TextArea value={feedback?.feedback_message ?? ''} handleSave={handleSave} />
			</motion.div>
		</>
	)
}

interface FeedBackViewProps {
	feedbackData: AdCreativeVariant['feedback']
}

const FeedBackView: FC<FeedBackViewProps> = (props) => {

	console.log('props.feedbackData - ', props.feedbackData);

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
						<FeedBackKeyItem key={feedBackKey.id} feedback={props.feedbackData ? props.feedbackData[feedBackKey.id] : undefined} feedBackKey={feedBackKey} />
					))}
				</div>
				{/*<label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your*/}
				{/*	feedback</label>*/}
				<TextArea value={props.feedbackData?.overall?.feedback_message ?? ''} placeholder="Write your overall feedback here..." handleSave={handleSave} rows={5} />
			</div>
		</>
	)
}

export default FeedBackView;
