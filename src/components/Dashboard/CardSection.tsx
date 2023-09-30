'use client';

import {dummy} from '@/constants/dummy';
import ConversationCard from '@/components/Dashboard/ConversationCard';
import AdCreativeCard from '@/components/Dashboard/AdCreativeCard';
import UploadItemCard from '@/components/Dashboard/UploadItemCard';
import webImage4 from '@/assets/images/image10.webp';
import webImage from '@/assets/images/image1.webp';
import AttachmentModal from '@/components/Dashboard/AttachmentModal';
import Drawer, {Position} from '@/components/Drawer';
import RightPane from '@/components/ArtiBot/RIghtPane/RightPane';
import React, {FC, useState} from 'react';
import {AttachmentDetails, ModalDispatchAction} from '@/interfaces';
import {IAdCreative} from '@/interfaces/IAdCreative';
import {useRouter} from 'next/navigation';
import {signOut} from 'next-auth/react';
import PlaceholderCard from '@/components/Dashboard/PlaceholderCard';
import CTAButton from '@/components/CTAButton';
import EmptyFolderIcon from '@/components/EmptyFolderIcon';
import Link from 'next/link';

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
		items = dummy.DAd_Creatives.map(adCreative => <AdCreativeCard key={adCreative.json} adCreative={adCreative} onClick={() => {}} />)
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

export default function CardSection() {
	const router = useRouter();
	const [openModal, setOpenModal] = useState(false);
	const [modalData, setModalData] = useState<ModalDispatchAction<AttachmentDetails>>(null);
	const [currentAdCreative, setCurrentAdCreative] = useState<IAdCreative | null>(null);

	function handleLogOutButton() {
		signOut();
	}

	function handleAdCreativeClick(adCreativeItem: IAdCreative) {
		// setOpen(true);
		setCurrentAdCreative(adCreativeItem);
	}

	function handleUploadItemClick(fileDetails: AttachmentDetails) {
		setModalData(fileDetails)
	}

	// TODO: Refactor them in corresponding component
	return (
		<>
			<section className="mb-10 w-full">
				<h2 className="mb-3">Previous Conversations</h2>
				<div className="flex gap-4 w-full overflow-x-auto">
					{!dummy.Conversations || dummy.Conversations.length === 0 ?
						<EmptySection style={{backdropFilter: 'blur(3px)', background: 'rgba(0,0,0,0.6)'}} type={EmptySectionType.CONVERSATION} /> :
						dummy.Conversations.filter(c => c.has_activity).map(conversation =>
								<ConversationCard key={conversation.title} conversation={conversation}/>)
					}
				</div>
			</section>
			<section className="mb-10 w-full">
				<h2 className="mb-3">Past Ad Creatives</h2>
				<div className="flex gap-4 w-full overflow-x-auto">
					{!dummy.Conversations || dummy.Conversations.length === 0 ?
						<EmptySection style={{backdropFilter: 'blur(3px)', background: 'rgba(0,0,0,0.8)'}} type={EmptySectionType.AD_CREATIVE} /> :
						dummy.Ad_Creatives.map(adCreative => <AdCreativeCard key={adCreative.json} adCreative={adCreative} onClick={handleAdCreativeClick} />)
					}
				</div>
			</section>
			<section className="mb-10 w-full">
				<h2 className="mb-3">Past Uploads</h2>
				<div className="flex gap-4 w-full overflow-x-auto">
					<EmptySection style={{backdropFilter: 'blur(3px)', background: 'rgba(0,0,0,0.9)'}} type={EmptySectionType.UPLOAD} />
				</div>
			</section>
			<AttachmentModal fileDetails={modalData} open={!!modalData} setOpen={setModalData} />
			<Drawer open={!!currentAdCreative} position={Position.RIGHT} handelClose={() => setCurrentAdCreative(null)}>
				{currentAdCreative && <RightPane adCreative={currentAdCreative}/>}
			</Drawer>
		</>
	)
}
