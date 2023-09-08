import React, {FC, useEffect, useMemo, useRef, useState} from 'react';
import TabView from '@/components/ArtiBot/RIghtPane/TabView';
import FeedBackView from '@/components/ArtiBot/RIghtPane/FeedBackView';
import AdVariant from '@/components/ArtiBot/AdVariant';
import {dummyMessages} from '@/components/ArtiBot/ArtiBot';
import {JSONInput, MessageObj, TabId} from '@/constants/artibotData';

interface RightPaneProps {
	adGenerated: MessageObj;
}

const RightPane: FC<RightPaneProps> = ({adGenerated}) => {
	const [activeAdTab, setActiveAdTab] = useState<TabId>('Facebook');
	const sliderRef = useRef(null);

	const json = (adGenerated.json && JSON.parse(adGenerated.json)) as JSONInput;

	const currentAdVariant = useMemo(() => {
		if(!json) return null;
		return json.Ads.find(c => c['Ad Type'].includes(activeAdTab));
	}, [activeAdTab, json])

	useEffect(() => {

	}, [])

	return (
		<div className="w-[450px] right-0 top-0 h-full z-10 flex-shrink-0 flex pb-10 overflow-y-auto overflow-x-visible flex-col relative items-center bg-black">
			<div className="absolute right-full top-0 h-full w-1 bg-white cursor-col-resize hover:w-3 transition-all" ref={sliderRef} onMouseDown={(e) => {
				console.log('e', e, e.currentTarget)
			}} />
			<div className="px-4 py-4">
				<h2 className="text-xl font-medium font-diatype">Rendered View</h2>
			</div>
			<TabView activeAdTab={activeAdTab} setActiveAdTab={setActiveAdTab} />

			{currentAdVariant && <AdVariant noExpand={true} adVariant={currentAdVariant} className="mt-10 p-3 border border-gray-800 bg-secondaryBackground rounded-lg max-w-[80%]" style={{fontSize: '8.5px'}}/>}

			<FeedBackView />

		</div>
	)
}

export default RightPane;
