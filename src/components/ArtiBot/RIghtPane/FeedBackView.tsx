import {artiBotData} from '@/constants/artibotData';
import React from 'react';
import {AiFillDislike, AiFillLike} from 'react-icons/ai';

export default function FeedBackView() {

	return (
		<>
			<div className="w-[80%] mt-6">
				<label htmlFor="message" className="block text-sm font-light font-medium text-white text-opacity-70">Please provide us some
					feedback</label>
				<div className="mb-6 divide-y divide-gray-800 bg-secondaryBackground p-5 py-1 mt-3 rounded-lg">
					{artiBotData.feedBackKeys.map(feedBackKey => (
						<div className="flex justify-between items-center py-3 first:py-3" key={feedBackKey.id}>
							<p className="text-primary text-sm">{feedBackKey.label}</p>
							<div className="flex items-center">
								<AiFillLike className="mr-[0.8em] hover:scale-[1.1] transition-all text-[1.2em] cursor-pointer text-secondaryText" />
								<AiFillDislike className="text-[1.2em] hover:scale-[1.1] transition-all cursor-pointer text-secondaryText" />
							</div>
						</div>
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
