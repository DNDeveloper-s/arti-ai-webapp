import {AdJSONInput, ChatGPTMessageObj} from '@/interfaces/IArtiBot';
import AdVariant from '@/components/ArtiBot/AdVariant';
import React from 'react';

export default function AdItem({messageItem, variantFontSize}: {messageItem: ChatGPTMessageObj, variantFontSize?: number}) {

	const json = messageItem.json && JSON.parse(messageItem.json) as AdJSONInput;

	if(!json) return null;
	console.log('messageItem - ', messageItem);

	return (
		<div className="">
			<div>
				<p className="text-white text-opacity-50 font-diatype text-base leading-[1.6em] my-2">Congratulations! We have successfully generated the ad for you. To explore different ad variants and make the best choice, simply navigate to the right pane and switch between tabs.</p>
			</div>
			<div className={"mt-3"}>
				<span className="font-semibold text-primary text-lg">Ad Summary</span>
				<p className="text-white text-opacity-80 font-diatype text-base leading-[1.6em] my-2">{json.Summary}</p>
			</div>
			<div className={"border-t border-gray-600 pt-3 mt-5"}>
				<ul className="list-disc px-4">
					<li className="text-white text-opacity-50 font-diatype text-base leading-[1.6em] my-2">If you&apos;re not satisfied with the current ad, you can easily regenerate it by clicking the "Regenerate Ad" button.</li>
					<li className="text-white text-opacity-50 font-diatype text-base leading-[1.6em] my-2">Feel free to provide feedback on each ad variant by visiting the "Provide Feedback" section on the right-hand side of the tab.</li>
				</ul>
			</div>
			{/*{json.Ads.map(adVariant => (*/}
			{/*	<AdVariant key={adVariant['One liner']} adVariant={adVariant} style={{fontSize: variantFontSize ?? '14px'}} />*/}
			{/*))}*/}
		</div>
	)
}
