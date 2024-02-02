'use client'

import ArtiBot from '@/components/ArtiBot/ArtiBot';
import { IConversation } from '@/interfaces/IConversation';
import React, { useEffect, useMemo, useState } from 'react';
import RightPane from './RIghtPane/RightPane';
import { useConversation } from '@/context/ConversationContext';
import ResizeAble from '../shared/renderers/ResizeAble';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import EditAdVariantScreen from '@/components/ArtiBot/EditAdVariant/EditAdVariantScreen';
import {useEditVariant} from '@/context/EditVariantContext';

export default function ArtiBotPage({conversation}: {conversation: IConversation}) {
	const [adCreatives, setAdCreatives] = useState(conversation?.adCreatives ? conversation?.adCreatives : []);
	const {state, dispatch} = useConversation();
	const {state: editVariantState} = useEditVariant();

    const adCreative = useMemo(() => {
		// Merge all the variants into one adCreative object within one conversation
		if(!adCreatives || adCreatives.length === 0) return null;
		let adCreative = adCreatives[adCreatives.length - 1];
		if(!adCreative) return null;
		adCreative = {
			...adCreative,
			variants: adCreatives.map(a => a.variants).flat()
		}

		return adCreative
	}, [adCreatives]);

	useEffect(() => {
		const adCreatives = state.adCreative.list?.filter(a => a.conversationId === conversation?.id) ?? [];
		setAdCreatives(adCreatives);
	}, [state.adCreative.list, conversation]);

	console.log('editVariantState - ', editVariantState);

	return (
		<PanelGroup autoSaveId={'conversation-panel'} direction='horizontal'>
			<Panel defaultSize={40} minSize={30} order={1}>
				<ArtiBot conversation={conversation} adCreatives={adCreatives} setAdCreatives={setAdCreatives}/>
			</Panel>
			<PanelResizeHandle className='w-2 bg-gray-600' />
			<Panel minSize={20} defaultSize={20} order={2}>
				{adCreative && <RightPane adCreative={adCreative} isAdCampaign={false} />}
			</Panel>
			{editVariantState.variant && <>
        <PanelResizeHandle className='w-2 bg-gray-600' />
        <Panel minSize={20} defaultSize={20} order={3}>
          <EditAdVariantScreen adVariant={editVariantState.variant} />
        </Panel>
      </>}
		</PanelGroup>
	)

    return (
        <div className={'flex h-full overflow-hidden'}>
            <div className={'flex-1'}>
                <ArtiBot conversation={conversation} adCreatives={adCreatives} setAdCreatives={setAdCreatives}/>
            </div>
            {adCreative && <RightPane adCreative={adCreative} isAdCampaign={false} />}
			<ResizeAble containerClassName='h-full flex-1 bg-secondaryBackground'>
				<div className='h-full'>
					<p>There we can have other things in total.</p>
				</div>
			</ResizeAble>
        </div>
    )
}
