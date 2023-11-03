'use client';

import React from 'react';
import {useSession} from 'next-auth/react';
import CTAButton from '@/components/CTAButton';
import Link from 'next/link';
import StrategyIcon from '@/components/shared/icons/StrategyIcon';
import AdCreativeIcon from '@/components/shared/icons/AdCreativeIcon';
import StartIcon from '@/components/shared/icons/StartIcon';

interface WelcomeSectionProps {

}

const WelcomeSection:React.FC<WelcomeSectionProps> = (props) => {
	const {data: session, status} = useSession();

	console.log('session - ', session);

	return (
		<div className="w-full pt-4 pb-5 md:pt-12 md:pb-16">
			<h2 className="text-xl md:text-3xl text-white text-opacity-70 font-light mb-5">Welcome {(session && session.user) ? session.user.first_name : ""}</h2>
			{/*<p className="mb-2 text-white text-opacity-50">Start chat,</p>*/}
			{/*<div className="w-full rounded-lg h-32 bg-secondaryBackground">*/}

			{/*</div>*/}
		</div>
	)
}

export default WelcomeSection;
