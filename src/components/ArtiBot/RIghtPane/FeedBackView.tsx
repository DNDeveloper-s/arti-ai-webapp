import {artiBotData, FeedBackKey} from '@/constants/artibotData';
import React, {FC, useState} from 'react';
import {AiFillDislike, AiFillLike} from 'react-icons/ai';
import {MdFeedback} from 'react-icons/md';
import {motion} from 'framer-motion';
import LikeIcon from '@/components/ArtiBot/LikeIcon';

interface FeedBackKeyItemProps {
	feedBackKey: FeedBackKey;
}
const FeedBackKeyItem: FC<FeedBackKeyItemProps> = ({feedBackKey}) => {
	const [expand, setExpand] = useState(false);
	return (
		<>
			<div className="flex justify-between items-center py-3 first:py-3" key={feedBackKey.id}>
				<p className="text-primary text-sm">{feedBackKey.label}</p>
				<div className="flex items-center">
					<LikeIcon />
					{/*<AiFillLike className="mr-[0.5em] hover:scale-[1.1] transition-all text-[1.2em] cursor-pointer text-secondaryText" />*/}
					<AiFillDislike className="mr-[0.5em] text-[1.2em] hover:scale-[1.1] transition-all cursor-pointer text-secondaryText" />
					<MdFeedback onClick={() => setExpand(c => !c)} className="text-[1.2em] hover:scale-[1.1] transition-all cursor-pointer text-secondaryText" />
				</div>
			</div>
			<motion.div animate={{height: expand ? '100%' : '0'}} className={"overflow-hidden"}>
				<textarea
					id="message"
					rows={8}
					className="block p-2.5 focus:outline-none w-full text-sm text-back bg-secondaryBackground rounded-lg border border-gray-800 focus:border-primary placeholder-gray-500 dark:text-white"
					placeholder="Write your feedback here..."
				/>
			</motion.div>
		</>
	)
}

export default function FeedBackView() {

	return (
		<>
			<div className="w-[80%] mt-6">
				<label htmlFor="message" className="block text-sm font-light font-medium text-white text-opacity-70">Please provide us some
					feedback</label>
				<div className="mb-6 divide-y divide-gray-800 bg-secondaryBackground p-5 py-1 mt-3 rounded-lg">
					{artiBotData.feedBackKeys.map(feedBackKey => (
						<FeedBackKeyItem key={feedBackKey.id} feedBackKey={feedBackKey} />
					))}
				</div>
				{/*<label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your*/}
				{/*	feedback</label>*/}
				<textarea
					id="message"
          rows={8}
          className="block p-2.5 focus:outline-none w-full text-sm text-back bg-secondaryBackground rounded-lg border border-gray-800 focus:border-primary placeholder-gray-500 dark:text-white"
          placeholder="Write your feedback here..."
				/>
			</div>
		</>
	)
}
