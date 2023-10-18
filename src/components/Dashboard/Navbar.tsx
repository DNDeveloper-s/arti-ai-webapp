'use client'

import Logo from '@/components/Logo';
import CTAButton from '@/components/CTAButton';
import {RxExit} from 'react-icons/rx';
import Link from 'next/link';
import LogoutButton from '@/components/Dashboard/LogoutButton';
import ObjectId from 'bson-objectid';
import {dummy} from '@/constants/dummy';
import {useEffect} from 'react';

export default function Navbar() {

	return (
		<div className="flex h-20 w-full px-5 justify-between items-center">
			<Logo />
			<div className="flex items-center">
				<Link href={'/artibot'}>
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
