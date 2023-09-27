'use client'

import Logo from '@/components/Logo';
import CTAButton from '@/components/CTAButton';
import {RxExit} from 'react-icons/rx';
import Link from 'next/link';
import LogoutButton from '@/components/Dashboard/LogoutButton';
import ObjectId from 'bson-objectid';
import {dummy} from '@/constants/dummy';

export default function Navbar() {
	let id = ObjectId();

	// Check if the conversation with no activity exists
	const hasNoActivity = dummy.Conversations.find(c => !c.has_activity);
	if(hasNoActivity) {
		id = hasNoActivity.id as ObjectId;
	}

	return (
		<div className="flex h-20 w-full px-5 justify-between items-center">
			<Logo />
			<div className="flex items-center">
				<Link href={'/artibot/' + id}>
					<CTAButton className="py-3 mr-2 rounded-lg text-sm">
						<span>Start Chat</span>
					</CTAButton>
				</Link>
				<LogoutButton>
					<RxExit className="cursor-pointer text-primary" style={{fontSize: '24px'}} />
				</LogoutButton>
			</div>
		</div>
	)
}
