import ArtiBot from '@/components/ArtiBot/ArtiBot';
// import {useSession} from 'next-auth/react';
import AppLoader from '@/components/AppLoader';
// import LandingPage from '@/components/LandingPage';
// import Dashboard from '@/components/Dashboard';
import React from 'react';
import {redirect} from 'next/navigation';
import { getServerSession } from "next-auth/next"
import {authOptions} from '@/app/api/auth/[...nextauth]/route';
import ObjectId from 'bson-objectid';
import {dummy} from '@/constants/dummy';


export default async function ArtiBot() {
	// const {data, status} = useSession();
	const session = await getServerSession(authOptions)
	// const router = useRouter();
	const status = '';
	console.log('session - ', session);


	let jsx = <AppLoader />

	if(!session) jsx = redirect('/', 'replace');


	let id = ObjectId();

	// Check if the conversation with no activity exists
	const hasNoActivity = dummy.Conversations.find(c => !c.has_activity);
	if(hasNoActivity) {
		id = hasNoActivity.id as ObjectId;
	}


	if(session) return redirect('/artibot/' + id, 'replace');

	return jsx;
}
