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
import React, {useState} from 'react';
import {AttachmentDetails, ModalDispatchAction} from '@/interfaces';
import {IAdCreative} from '@/interfaces/IAdCreative';
import {useRouter} from 'next/navigation';
import {signOut} from 'next-auth/react';

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

	return (
		<>
			<section className="mb-10 w-full">
				<h2 className="mb-3">Previous Conversations</h2>
				<div className="flex gap-4 w-full overflow-x-auto">
					{dummy.Conversations.filter(c => c.has_activity).map(conversation => <ConversationCard key={conversation.title} conversation={conversation} />)}
				</div>
			</section>
			<section className="mb-10 w-full">
				<h2 className="mb-3">Past Ad Creatives</h2>
				<div className="flex gap-4 w-full overflow-x-auto">
					{dummy.Ad_Creatives.map(adCreative => <AdCreativeCard key={adCreative.json} adCreative={adCreative} onClick={handleAdCreativeClick} />)}
				</div>
			</section>
			<section className="mb-10 w-full">
				<h2 className="mb-3">Past Uploads</h2>
				<div className="flex gap-4 w-full overflow-x-auto">
					<UploadItemCard onClick={handleUploadItemClick} fileDetails={{type: 'pdf', url: 'https://www.smcrealty.com/images/microsites/brochure/dlf-the-camellias-1619.pdf'}} />
					<UploadItemCard onClick={handleUploadItemClick} fileDetails={{type: 'image', url: webImage4}} />
					<UploadItemCard onClick={handleUploadItemClick} fileDetails={{type: 'image', url: webImage}} />
					<UploadItemCard onClick={handleUploadItemClick} fileDetails={{type: 'pdf', url: 'https://www.smcrealty.com/images/microsites/brochure/dlf-the-camellias-1619.pdf'}} />
				</div>
			</section>
			<AttachmentModal fileDetails={modalData} open={!!modalData} setOpen={setModalData} />
			<Drawer open={!!currentAdCreative} position={Position.RIGHT} handelClose={() => setCurrentAdCreative(null)}>
				{currentAdCreative && <RightPane adCreative={currentAdCreative}/>}
			</Drawer>
		</>
	)
}
