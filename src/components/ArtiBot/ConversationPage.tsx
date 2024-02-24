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
import { Tooltip } from 'react-tooltip';
import LeftPane from './LeftPane/LeftPane';
import { useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { FaTiktok, FaFacebookF } from 'react-icons/fa6';
import { MdEmail } from 'react-icons/md';
import { RxCaretDown } from 'react-icons/rx';
import Logo from '../Logo';

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

enum ArtiAiDropdownItems {
	ArtiAiChat = 'ArtiAi Chat',
	TiktokAdCreatives = 'Tiktok Ad Creatives',
	FacebookAdCreatives = 'Facebook Ad Creatives',
	EmailMarketing = 'Email Marketing',
}

interface ArtiAiDropdownItem {
	id: string;
	icon: JSX.Element;
	label: string;
	disabled?: boolean;
}

export function ArtiAiDropdown({hidden, items, handleChange}: {hidden?: boolean, handleChange?: (selectedItem: ArtiAiDropdownItem) => void, items: ArtiAiDropdownItem[]}) {
	const [open, setOpen] = useState(false);
	const [selectedItem, setSelectedItem] = useState<ArtiAiDropdownItem>(items[0]);
	const newRef = useRef<HTMLDivElement>(null);

	function handleClose() {
		setOpen(false);
	}


	function onChange(selectedItem: ArtiAiDropdownItem) {
		if(selectedItem.disabled) return;
		setSelectedItem(selectedItem);
		if(handleChange) handleChange(selectedItem);
		handleClose();
	}

	useEffect(() => {
		document.addEventListener("mousedown", handleOutsideClick);
		return () => {
		  document.removeEventListener("mousedown", handleOutsideClick);
		};
	}, [])

	const handleOutsideClick = (e) => {
		if (newRef.current && !newRef.current.contains(e.target)) {
			handleClose();
		}
	};

	return (
		<>
			<div className={'relative text-white min-w-[250px] ' + (hidden ? 'opacity-0 pointer-events-none' : '')} ref={newRef}>
				<div className='flex items-center cursor-pointer py-2 px-3 gap-2 text-base bg:bg-gray-800 rounded' onClick={() => setOpen(c => !c)}>
					<div className='flex gap-3 items-center text-base'>
						{selectedItem.icon}
						<span>{selectedItem.label}</span>
					</div>
					<RxCaretDown className='text-2xl' />
				</div>
				<AnimatePresence mode='wait'>
					{open && <motion.div initial={{y: 10, opacity: 0}} animate={{y: 0, opacity: 1}} exit={{y: -10, opacity: 0}} className='absolute top-full left-0 py-1 flex flex-col gap-1 text-base bg-black'>
						{items.filter(c => c.id !== selectedItem.id).map((dropdownItem: ArtiAiDropdownItem) => (
							<div key={dropdownItem.id} onClick={() => onChange(dropdownItem)} className={'grid grid-cols-[30px_1fr] cursor-pointer justify-items-center gap-3 py-2 px-3 items-center whitespace-nowrap border border-transparent hover:border-primary rounded hover:bg-gray-800 ' + (dropdownItem.disabled ? ' !cursor-not-allowed opacity-40' : '')}>
								{dropdownItem.icon}
								<span className='justify-self-start'>{dropdownItem.label}</span>
							</div>
						))}
					</motion.div>}
				</AnimatePresence>
			</div>
		</>
	)
}

export default function ArtiBotPage({conversation}: {conversation: IConversation}) {
	const [adCreatives, setAdCreatives] = useState(conversation?.adCreatives ? conversation?.adCreatives : []);
	const {state, dispatch} = useConversation();
	const {state: editVariantState} = useEditVariant();
	const [isConversationCollapsible, setIsConversationCollapsible] = useState<boolean>(false);
	const search = useSearchParams();

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
		console.log('mounted | ArtiBotPage - ');
	}, [])

	useEffect(() => {
		const adCreatives = state.adCreative.list?.filter(a => a.conversationId === conversation?.id) ?? [];
		setAdCreatives(adCreatives);
	}, [state.adCreative.list, conversation]);

	function toggleCollapse() {
		if(!adCreative) return setIsConversationCollapsible(false);
		setIsConversationCollapsible(c => !c);
	}

	const dropdownItems: ArtiAiDropdownItem[] = useMemo(() => [
		{id: '1', icon: <Logo width={25} />, label: ArtiAiDropdownItems.ArtiAiChat, disabled: false},
		{id: '2', icon: <FaTiktok />, label: ArtiAiDropdownItems.TiktokAdCreatives, disabled: !Boolean(adCreative)},
		{id: '3', icon: <FaFacebookF />, label: ArtiAiDropdownItems.FacebookAdCreatives, disabled: !Boolean(adCreative)},
		{id: '4', icon: <MdEmail />, label: ArtiAiDropdownItems.EmailMarketing, disabled: true},
	], [adCreative]);
	
	useEffect(() => {
		setIsConversationCollapsible(search.get('ad_creative') === 'expand');
	}, [search])

	const headerContent = (
		<div className="z-30 flex justify-between h-16 py-2 px-6 box-border items-center bg-secondaryBackground shadow-[0px_1px_1px_0px_#000]">
			<ArtiAiDropdown handleChange={(item: ArtiAiDropdownItem) => {
				console.log('item - ', item);
				setIsConversationCollapsible(item.label !== ArtiAiDropdownItems.ArtiAiChat);
			}} items={dropdownItems} />
			<Link href="/" className="flex justify-center items-center">
				<Logo width={35} className="mr-2" height={35} />
				<h3 className="text-lg">Arti AI</h3>
			</Link>
			<ArtiAiDropdown items={dropdownItems} hidden={true} />
		</div>
	)

	return (
		<div className='w-full h-full overflow-hidden flex'>
			<div>
				<LeftPane />
			</div>
			<div className={'bg-secondaryBackground flex flex-col h-full flex-1 overflow-hidden'}>
				{headerContent}
				<div className={'transition-all w-full overflow-hidden relative ' + (isConversationCollapsible ? 'h-[0] ' : 'h-full flex-1 ')}>
					<div className={'w-full max-w-[1100px] mx-auto h-full overflow-hidden'}>
						<ArtiBot hideHeader={true} toggleCollapse={toggleCollapse} collapsed={false} conversation={conversation} adCreatives={adCreatives} setAdCreatives={setAdCreatives}/>
					</div>
				</div>
				{adCreative && <>
					{/* <div onClick={toggleCollapse} className={'h-4 cursor-pointer text-primary max-w-[900px] mx-auto text-xs gap-1 flex-grow-0 w-full bg-gray-800 flex justify-center items-center'}>
						{isConversationCollapsible ? <AiOutlineCaretDown /> : <AiOutlineCaretUp />}
						<span className={'text-[10px]'}>{isConversationCollapsible ? 'Expand Chat' : 'Expand Ad Preview'}</span>
					</div> */}
					<div className={'transition-all w-full overflow-hidden ' + (isConversationCollapsible ? 'h-full flex-1 ' : 'h-[0]')}>
						<div className={'w-full max-w-[1100px] mx-auto h-full overflow-hidden'}>
							<RightPane adCreative={adCreative} isAdCampaign={false}/>
						</div>
					</div>
				</>}
				<Tooltip id='edit-ad-variant-tooltip' />
			</div>
		</div>
	)

	// return (
	// 	<PanelGroup autoSaveId={'conversation-panel'} direction='horizontal'>
	// 		<Panel defaultSize={40} minSize={30} order={1}>
	// 			<ArtiBot conversation={conversation} adCreatives={adCreatives} setAdCreatives={setAdCreatives}/>
	// 		</Panel>
	// 		<PanelResizeHandle className='w-2 bg-gray-600' />
	// 		<Panel minSize={20} defaultSize={20} order={2}>
	// 			{adCreative && <RightPane adCreative={adCreative} isAdCampaign={false} />}
	// 			<EditAdVariantScreen adVariant={editVariantState.variant} />
	// 		</Panel>
	// 		{editVariantState.variant && <>
    //     <PanelResizeHandle className='w-2 bg-gray-600' />
    //     <Panel minSize={20} defaultSize={20} order={3}>
    //       <EditAdVariantScreen adVariant={editVariantState.variant} />
    //     </Panel>
    //   </>}
	// 	</PanelGroup>
	// )

    // return (
    //     <div className={'flex h-full overflow-hidden'}>
    //         <div className={'flex-1'}>
    //             <ArtiBot conversation={conversation} adCreatives={adCreatives} setAdCreatives={setAdCreatives}/>
    //         </div>
    //         {adCreative && <RightPane adCreative={adCreative} isAdCampaign={false} />}
	// 		<ResizeAble containerClassName='h-full flex-1 bg-secondaryBackground'>
	// 			<div className='h-full'>
	// 				<p>There we can have other things in total.</p>
	// 			</div>
	// 		</ResizeAble>
    //     </div>
    // )
}
