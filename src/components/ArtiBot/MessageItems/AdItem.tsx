import {AdJSONInput, ChatGPTMessageObj} from '@/interfaces/IArtiBot';
import AdVariant from '@/components/ArtiBot/AdVariant';
import React from 'react';
import {IAdCreative} from '@/interfaces/IAdCreative';

export default function AdItem({messageItem, variantFontSize}: {messageItem: ChatGPTMessageObj, variantFontSize?: number}) {

	// const json = messageItem.json && JSON.parse(messageItem.json) as AdJSONInput;
	const json = messageItem.adCreatives && messageItem.adCreatives[0] as IAdCreative;

	if(!json) return null;
	console.log('messageItem - ', messageItem);

	return (
		<div className="">
			<div>
				<p className="text-white text-opacity-50 font-diatype text-[1em] leading-[1.6em] my-[0.4em]">Congratulations! We have successfully generated the ad for you. To explore different ad variants and make the best choice, simply navigate to the right pane and switch between tabs.</p>
			</div>
			<div className={"mt-[0.67em]"}>
				<span className="font-semibold text-primary text-[1.2em]">Ad Summary</span>
				<p className="text-white text-opacity-80 font-diatype text-[1em] leading-[1.6em] my-[0.55em]">{json.summary}</p>
			</div>
			<div className={"border-t border-gray-600 pt-3 mt-5"}>
				<ul className="list-disc px-4">
					<li className="text-white text-opacity-50 font-diatype text-[1em] leading-[1.6em] my-2">If you find the current advertisement unsatisfactory, please feel free to share additional information with us. This will enable us to create a better ad for you, and you can easily generate a new one by clicking the 'Regenerate Ad' button.</li>
					<li className="text-white text-opacity-50 font-diatype text-[1em] leading-[1.6em] my-2">Feel free to provide feedback on each ad variant by visiting the "Provide Feedback" section on the right-hand side of the tab.</li>
				</ul>
			</div>
			{/*{json.Ads.map(adVariant => (*/}
			{/*	<AdVariant key={adVariant['One liner']} adVariant={adVariant} style={{fontSize: variantFontSize ?? '14px'}} />*/}
			{/*))}*/}
		</div>
	)
}
