'use client';

import {dummy} from '@/constants/dummy';
import ConversationCard, {ConversationCardShimmer} from '@/components/Dashboard/ConversationCard';
import AdCreativeCard, {AdCreativeCardShimmer} from '@/components/Dashboard/AdCreativeCard';
import UploadItemCard from '@/components/Dashboard/UploadItemCard';
import webImage4 from '@/assets/images/image10.webp';
import webImage from '@/assets/images/image1.webp';
import AttachmentModal from '@/components/Dashboard/AttachmentModal';
import Drawer, {Position} from '@/components/Drawer';
import RightPane from '@/components/ArtiBot/RIghtPane/RightPane';
import React, {FC, useEffect, useMemo, useState} from 'react';
import {AttachmentDetails, ModalDispatchAction} from '@/interfaces';
import {IAdCreative} from '@/interfaces/IAdCreative';
import {useRouter} from 'next/navigation';
import {signOut, useSession} from 'next-auth/react';
import PlaceholderCard from '@/components/Dashboard/PlaceholderCard';
import CTAButton from '@/components/CTAButton';
import EmptyFolderIcon from '@/components/EmptyFolderIcon';
import Link from 'next/link';
import {getAdCreatives, getConversations, useConversation} from '@/context/ConversationContext';
import {ConversationType, IConversation, IConversationModel} from '@/interfaces/IConversation';
import Tabs, {TabItem} from '@/components/shared/tabs/Tabs';
import AdCreativeIcon from '@/components/shared/icons/AdCreativeIcon';
import StrategyIcon from '@/components/shared/icons/StrategyIcon';
import useSessionToken from '@/hooks/useSessionToken';

enum EmptySectionType {
	CONVERSATION = 'conversation',
	AD_CREATIVE = 'ad_creative',
	UPLOAD = 'upload'
}
interface EmptySectionProps {
	className?: string;
	type: EmptySectionType;
	style?: Record<string, string>
}
const EmptySection: FC<EmptySectionProps> = (props) => {

	let items = null;
	let content = null;

	if(props.type === EmptySectionType.CONVERSATION) {
		items = dummy.DConversations.filter(c => c.has_activity).map(conversation => <ConversationCard key={conversation.title} conversation={conversation}/>)
		content = <>
			<h3 className="text-lg text-primary text-opacity-70 font-bold">Looks like you don't have any Conversations</h3>
			<p className={"text-xs text-white text-opacity-40"}>Fortunately, it's easy to create new one.</p>
			<Link
				href="/artibot"
				className="text-primary underline"
			>Start Chat</Link>
		</>
	}

	if(props.type === EmptySectionType.AD_CREATIVE) {
		// items = dummy.DAd_Creatives.map(adCreative => <AdCreativeCard key={adCreative.json} adCreative={adCreative} onClick={() => {}} />)
		content = <>
			<h3 className="text-lg text-primary text-opacity-70 font-bold">Looks like you don't have any Ad Creatives</h3>
			<p className={"text-xs text-white text-opacity-40"}>Get started by creating your first ad creative through a chat with our Arti AI Bot.</p>
		</>
	}

	if(props.type === EmptySectionType.UPLOAD) {
		items = (
			<>
				<UploadItemCard fileDetails={{type: 'pdf', url: 'https://www.smcrealty.com/images/microsites/brochure/dlf-the-camellias-1619.pdf'}} />
				<UploadItemCard fileDetails={{type: 'image', url: webImage4}} />
				<UploadItemCard fileDetails={{type: 'image', url: webImage}} />
				<UploadItemCard fileDetails={{type: 'pdf', url: 'https://www.smcrealty.com/images/microsites/brochure/dlf-the-camellias-1619.pdf'}} />
			</>
		)
		content = <>
			<h3 className="text-lg text-primary text-opacity-70 font-bold">No uploads have been made yet.</h3>
			<p className={"text-xs text-white text-opacity-40"}>Start uploading to populate this section with your content.</p>
		</>
	}

	return (
		<div className='relative w-full'>
			<div style={{zIndex: 2000, backdropFilter: 'blur(3px)', background: 'rgba(0,0,0,0.6)', ...(props.style ?? {})}} className="absolute w-full h-full flex flex-col gap-2 justify-center items-center backdrop-blur-xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
				<EmptyFolderIcon width={100} height={100}/>
				{content}
			</div>
			<div className="flex gap-4 w-full overflow-x-auto">
				{items}
			</div>
		</div>
	)
}

const tabItems = [
	{label: 'Ad Creative', id: 'ad_creative', icon: AdCreativeIcon},
	{label: 'Strategy', id: 'strategy', icon: StrategyIcon},
]

export default function CardSection() {
	const router = useRouter();
	const [openModal, setOpenModal] = useState(false);
	const [modalData, setModalData] = useState<ModalDispatchAction<AttachmentDetails>>(null);
	const [currentAdCreative, setCurrentAdCreative] = useState<IAdCreative | null>(null);
	const {state, dispatch} = useConversation();
	const token = useSessionToken();

	const [activeTabItem, setActiveTabItem] = useState<TabItem>(tabItems[0]);

	useEffect(() => {
		token && dispatch && getConversations(dispatch);
	}, [dispatch, token]);

	useEffect(() => {
		token && dispatch && getAdCreatives(dispatch);
	}, [dispatch, token]);

	function handleLogOutButton() {
		signOut();
	}

	// Group the adCreatives by conversationId

	console.log('state - ', state.loading, state.conversation, state.conversation?.list);


	// Merge the variants of adCreatives per conversationId
	const adVariantsByConversationId = state.adCreatives?.reduce((acc: Record<string, IAdCreative[]>, adCreative: IAdCreative) => {
		if(!acc[adCreative.conversationId]) {
			acc[adCreative.conversationId] = [];
		}
		acc[adCreative.conversationId].push(adCreative);
		return acc;
	}, {} as Record<string, IAdCreative[]>) ?? {};

	function handleAdCreativeClick(adCreativeItem: IAdCreative) {
		// setOpen(true);
		setCurrentAdCreative(adCreativeItem);
	}

	function handleUploadItemClick(fileDetails: AttachmentDetails) {
		setModalData(fileDetails)
	}

	const hasActiveConversations = dummy.Conversations.filter(c => (c.messages?.length > 0)).length > 0;

	function handleTabChange(tabItem: TabItem) {
		setActiveTabItem(tabItem)
	}

	const conversations = useMemo(() => {
		if(!state.conversation.list) return null;
		const _conversations = state.conversation.list;

		if(activeTabItem.id === ConversationType.STRATEGY) {
			return _conversations.filter((c: IConversation) => c.conversation_type === ConversationType.STRATEGY);
		}
		return _conversations.filter((c: IConversation) => c.conversation_type === ConversationType.AD_CREATIVE);
	}, [activeTabItem.id, state.conversation.list])

	function renderConversations() {
		if(state.loading.conversations && (!state.conversation?.list || state.conversation?.list?.length === 0)) return <div className="w-full flex gap-4 overflow-hidden">
			<ConversationCardShimmer />
			<ConversationCardShimmer />
			<ConversationCardShimmer />
		</div>
		return (
			<>
				{!state.conversation?.list || state.conversation?.list?.length === 0 ?
					<EmptySection style={{backdropFilter: 'blur(3px)', background: 'rgba(0,0,0,0.6)'}} type={EmptySectionType.CONVERSATION} /> :
					// state.conversations.filter((c: IConversationModel & {has_activity: boolean}) => c.has_activity).map((conversation: IConversationModel) =>
					state.conversation?.list.map((conversation: IConversation) =>
						<ConversationCard key={conversation.id} conversation={conversation}/>)
				}
			</>
		)
	}

	function renderAdCreatives() {
		if(state.loading.adCreatives && (!state.adCreative?.list || state.adCreative?.list?.length === 0)) {
			return (
				<section className="mb-10 w-full">
					<h2 className="mb-3">Past Ad Creatives</h2>
					<div className="flex gap-4 w-full overflow-x-auto">
						<div className="w-full flex gap-4 overflow-hidden">
							<AdCreativeCardShimmer />
							<AdCreativeCardShimmer />
							<AdCreativeCardShimmer />
						</div>
					</div>
				</section>
			)
		}

		return (
			<>
				{state.adCreative.list && state.adCreative.list.length > 0 && <section className="mb-10 w-full">
          <h2 className="mb-3">Past Ad Creatives</h2>
          <div className="flex gap-4 w-full overflow-x-auto">
						{Object.keys(adVariantsByConversationId).map((conversationId: string) => <AdCreativeCard key={conversationId} adCreatives={adVariantsByConversationId[conversationId]} onClick={handleAdCreativeClick}/>)}
          </div>
        </section>}
			</>
		)
	}

	// TODO: Refactor them in corresponding component
	return (
		<>
			<section className="mb-10 w-full">
				<div className="flex mb-3 justify-between items-center">
					<h2>Past Conversations</h2>
					{/*<div className="h-8">*/}
					{/*	<Tabs items={tabItems} handleChange={handleTabChange} />*/}
					{/*</div>*/}
				</div>
				<div className="flex gap-4 w-full overflow-x-auto">
					{renderConversations()}
				</div>
			</section>
			{renderAdCreatives()}
			{/*{state.adCreatives && state.adCreatives.length > 0 && <section className="mb-10 w-full">*/}
			{/*	<h2 className="mb-3">Past Ad Creatives</h2>*/}
			{/*	<div className="flex gap-4 w-full overflow-x-auto">*/}
			{/*		{Object.keys(adVariantsByConversationId).map((conversationId: string) => <AdCreativeCard key={conversationId} adCreatives={adVariantsByConversationId[conversationId]} onClick={handleAdCreativeClick}/>)}*/}
			{/*	</div>*/}
			{/*</section>}*/}
			{/*<section className="mb-10 w-full">*/}
			{/*	<h2 className="mb-3">Past Uploads</h2>*/}
			{/*	<div className="flex gap-4 w-full overflow-x-auto">*/}
			{/*		<EmptySection style={{backdropFilter: 'blur(3px)', background: 'rgba(0,0,0,0.9)'}} type={EmptySectionType.UPLOAD} />*/}
			{/*	</div>*/}
			{/*</section>*/}
			<AttachmentModal fileDetails={modalData} open={!!modalData} setOpen={setModalData} />
			<Drawer open={!!currentAdCreative} position={Position.RIGHT} handelClose={() => setCurrentAdCreative(null)}>
				{currentAdCreative && <RightPane adCreative={currentAdCreative}/>}
			</Drawer>
		</>
	)
}
