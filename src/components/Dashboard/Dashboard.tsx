import {signOut} from 'next-auth/react';
import {useRouter} from 'next/navigation';
import Navbar from '@/components/Dashboard/Navbar';
import ConversationCard from '@/components/Dashboard/ConversationCard';
import AdCreativeCard from '@/components/Dashboard/AdCreativeCard';
import UploadItemCard from '@/components/Dashboard/UploadItemCard';
import WelcomeSection from '@/components/Dashboard/WelcomeSection';
import Drawer, {Position} from '@/components/Drawer';
import React, {useState} from 'react';
import RightPane from '@/components/ArtiBot/RIghtPane/RightPane';
import {dummyJSONMessage} from '@/components/ArtiBot/ArtiBot';
import AttachmentModal from '@/components/Dashboard/AttachmentModal';
import webImage from '@/assets/images/image1.webp'
import webImage4 from '@/assets/images/image10.webp'
import {AttachmentDetails, ModalDispatchAction} from '@/interfaces';
import {dummy} from '@/constants/dummy';
import {AdCreative} from '@/interfaces/AdCreative';
import adCreativeCard from '@/components/Dashboard/AdCreativeCard';

export default function Dashboard() {
	const router = useRouter();
	// const [open, setOpen] = useState(false);
	const [openModal, setOpenModal] = useState(false);
	const [modalData, setModalData] = useState<ModalDispatchAction<AttachmentDetails>>(null);
	const [currentAdCreative, setCurrentAdCreative] = useState<AdCreative | null>(null);

	function handleLogOutButton() {
		signOut();
	}

	function handleAdCreativeClick(adCreativeItem: AdCreative) {
		// setOpen(true);
		setCurrentAdCreative(adCreativeItem);
	}

	function handleUploadItemClick(fileDetails: AttachmentDetails) {
		setModalData(fileDetails)
	}

	return (
		<main className={"w-full max-w-[900px] mx-auto"}>
			<Navbar />
			<WelcomeSection />
			<section className="mb-10 w-full">
				<h2 className="mb-3">Previous Conversations</h2>
				<div className="flex gap-4 w-full overflow-x-auto">
					{dummy.Conversations.map(conversation => <ConversationCard key={conversation.title} conversation={conversation} />)}
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
		</main>
	)
}
