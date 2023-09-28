import {AdJSONInput, ChatGPTMessageObj} from '@/interfaces/IArtiBot';
import AdVariant from '@/components/ArtiBot/AdVariant';
import React from 'react';

export default function AdItem({messageItem, variantFontSize}: {messageItem: ChatGPTMessageObj, variantFontSize?: number}) {

	const json = messageItem.json && JSON.parse(messageItem.json) as AdJSONInput;

	if(!json) return null;

	return (
		<div className="divide-y [&>*]:pt-6 [&>*]:mb-2 md:[&>*]:mb-3 [&>*:first-child]:pt-0 [&>*:last-child]:mb-0 divide-gray-700">
			{json.Ads.map(adVariant => (
				<AdVariant key={adVariant['One liner']} adVariant={adVariant} style={{fontSize: variantFontSize ?? '14px'}} />
			))}
		</div>
	)
}
