import ArtiBot from '@/components/ArtiBot/ArtiBot';
// import {useSession} from 'next-auth/react';
import AppLoader from '@/components/AppLoader';
// import LandingPage from '@/components/LandingPage';
// import Dashboard from '@/components/Dashboard';
import React from 'react';
import {redirect} from 'next/navigation';
import { getServerSession } from "next-auth/next"
import {authOptions} from '@/app/api/auth/[...nextauth]/route';
import {dummy} from '@/constants/dummy';


export default async function ConversationID() {
	// const {data, status} = useSession();
	const session = await getServerSession(authOptions)
	// const router = useRouter();
	const status = '';
	console.log('session - ', session);

	let jsx = <AppLoader />

	if(!session) jsx = redirect('/', 'replace');

	if(session) jsx = (
		<main>
			{/*<Logo />*/}
			<div className="grid grid-cols-[1fr] h-screen">
				{/*<div className="bg-background">*/}

				{/*</div>*/}
				<ArtiBot conversation={dummy.Conversations[0]} />
			</div>
		</main>
	)

	return jsx;
}
