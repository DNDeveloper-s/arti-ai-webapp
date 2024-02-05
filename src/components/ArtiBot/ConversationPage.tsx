'use client'

import ArtiBot from '@/components/ArtiBot/ArtiBot';
import {IConversation} from '@/interfaces/IConversation';
import React, {FC, useEffect, useMemo, useRef, useState} from 'react';
import RightPane from './RIghtPane/RightPane';
import {useConversation} from '@/context/ConversationContext';
import ResizeAble from '../shared/renderers/ResizeAble';
import {Panel, PanelGroup, PanelResizeHandle} from 'react-resizable-panels';
import EditAdVariantScreen from '@/components/ArtiBot/EditAdVariant/EditAdVariantScreen';
import {useEditVariant} from '@/context/EditVariantContext';
import ChatGPTMessageItem from '@/components/ArtiBot/MessageItems/ChatGPTMessageItem';
import {ChatGPTRole} from '@/interfaces/IArtiBot';
import {AiOutlineCaretDown, AiOutlineCaretUp} from 'react-icons/ai';

export interface CollapsedComponentProps {
	content: string;
	handleClick?: () => void;
}
export const CollapsedComponent: FC<CollapsedComponentProps> = ({content}) => {
	return (
		<div>
			{/*<h2 className={'text-gray-400 text-sm font-bold mb-1'}>Summary:</h2>*/}
			{/*<span className={'text-base text-white'}>*/}
			{/*	{content}*/}
			{/*</span>*/}

			<ChatGPTMessageItem
				isGenerating={false}
				conversationId={''}
				setMessages={() => {}}
				messageItem={{role: ChatGPTRole.ASSISTANT, content}}
			/>
		</div>
	)
}

export default function ArtiBotPage({conversation}: {conversation: IConversation}) {
	const [adCreatives, setAdCreatives] = useState(conversation?.adCreatives ? conversation?.adCreatives : []);
	const {state, dispatch} = useConversation();
	const {state: editVariantState} = useEditVariant();
	const [isConversationCollapsible, setIsConversationCollapsible] = useState<boolean>(false);

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

	function toggleCollapse() {
		setIsConversationCollapsible(c => !c);
	}

	return (
		<div className={'bg-secondaryBackground flex flex-col h-full w-full overflow-hidden'}>
			<div className={'transition-all w-full overflow-hidden relative ' + (isConversationCollapsible ? 'h-[180px] ' : 'h-full flex-1 ')}>
				<div className={'w-full max-w-[700px] mx-auto h-full overflow-hidden'}>
					<ArtiBot toggleCollapse={toggleCollapse} collapsed={isConversationCollapsible} conversation={conversation} adCreatives={adCreatives} setAdCreatives={setAdCreatives}/>
				</div>
			</div>
			<div onClick={toggleCollapse} className={'h-4 cursor-pointer text-primary max-w-[700px] mx-auto text-xs gap-1 flex-grow-0 w-full bg-gray-800 flex justify-center items-center'}>
				{isConversationCollapsible ? <AiOutlineCaretDown /> : <AiOutlineCaretUp />}
				<span className={'text-[10px]'}>{isConversationCollapsible ? 'Expand Chat' : 'Expand Ad Preview'}</span>
			</div>
			<div className={'transition-all w-full overflow-hidden ' + (isConversationCollapsible ? 'h-full flex-1 ' : 'h-[110px]')}>
				<div className={'w-full max-w-[700px] mx-auto h-full overflow-hidden'}>
					{adCreative && (editVariantState.variant ? <EditAdVariantScreen adVariant={editVariantState.variant} /> : <RightPane adCreative={adCreative} isAdCampaign={false}/>)}
				</div>
			</div>
		</div>
	)

	return (
		<PanelGroup autoSaveId={'conversation-panel'} direction='horizontal'>
			<Panel defaultSize={40} minSize={30} order={1}>
				<ArtiBot conversation={conversation} adCreatives={adCreatives} setAdCreatives={setAdCreatives}/>
			</Panel>
			<PanelResizeHandle className='w-2 bg-gray-600' />
			<Panel minSize={20} defaultSize={20} order={2}>
				{adCreative && <RightPane adCreative={adCreative} isAdCampaign={false} />}
				<EditAdVariantScreen adVariant={editVariantState.variant} />
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
