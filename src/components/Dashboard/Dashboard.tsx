import {signOut} from 'next-auth/react';
import {useRouter} from 'next/navigation';
import Navbar from '@/components/Dashboard/Navbar';
import ConversationCard from '@/components/Dashboard/ConversationCard';
import AdCreativeCard from '@/components/Dashboard/AdCreativeCard';
import UploadItemCard from '@/components/Dashboard/UploadItemCard';
import WelcomeSection from '@/components/Dashboard/WelcomeSection';
import Drawer, {Position} from '@/components/Drawer';
import React, {useState} from 'react';
import RightPane from '@/components/ArtiBot/RIghtPane';
import {dummyJSONMessage} from '@/components/ArtiBot/ArtiBot';

export default function Dashboard() {
	const router = useRouter();
	const [open, setOpen] = useState(false);

	function handleLogOutButton() {
		signOut();
	}

	function handleAdCreativeClick(adCreativeItem) {
		setOpen(true);
	}

	return (
		<main className={"w-full max-w-[900px] mx-auto"}>
			<Navbar />
			<WelcomeSection />
			<section className="mb-10 w-full">
				<h2 className="text-primary mb-3">Previous Conversations</h2>
				<div className="flex gap-4 w-full overflow-x-auto">
					<ConversationCard />
					<ConversationCard />
					<ConversationCard />
					<ConversationCard />
					<ConversationCard />
				</div>
			</section>
			<section className="mb-10 w-full">
				<h2 className="mb-3">Past Ad Creatives</h2>
				<div className="flex gap-4 w-full overflow-x-auto">
					<AdCreativeCard onClick={handleAdCreativeClick} />
					<AdCreativeCard onClick={handleAdCreativeClick} />
					<AdCreativeCard onClick={handleAdCreativeClick} />
				</div>
			</section>
			<section className="mb-10 w-full">
				<h2 className="mb-3">Past Uploads</h2>
				<div className="flex gap-4 w-full overflow-x-auto">
					<UploadItemCard fileDetails={{type: 'pdf'}} />
					<UploadItemCard fileDetails={{type: 'pdf'}} />
					<UploadItemCard fileDetails={{type: 'image'}} />
					<UploadItemCard fileDetails={{type: 'pdf'}} />
				</div>
			</section>
			<Drawer open={open} position={Position.RIGHT} setOpen={setOpen}>
				<RightPane adGenerated={dummyJSONMessage} />
			</Drawer>
		</main>
	)
}
