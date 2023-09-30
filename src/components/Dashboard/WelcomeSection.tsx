'use client';

import React from 'react';
import {useSession} from 'next-auth/react';

interface WelcomeSectionProps {

}

const WelcomeSection:React.FC<WelcomeSectionProps> = (props) => {
	const {data: session, status} = useSession();

	console.log('session - ', session);

	return (
		<div className="w-full pt-12 pb-16">
			<h2 className="text-3xl text-white text-opacity-70 font-light mb-6">Welcome {(session && session.user) ? session.user.first_name + ' ' + session.user.last_name : ""},</h2>
			<div className="w-full rounded-lg h-32 bg-secondaryBackground">

			</div>
		</div>
	)
}

export default WelcomeSection;
