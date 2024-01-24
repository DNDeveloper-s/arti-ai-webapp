// import {useSession} from 'next-auth/react';
import AppLoader from '@/components/AppLoader';
// import ProductPage from '@/components/ProductPage';
// import Dashboard from '@/components/Dashboard';
import React from 'react';
import {redirect} from 'next/navigation';
import { getServerSession } from "next-auth/next"
import {authOptions} from '@/app/api/auth/[...nextauth]/route';
import AskConversationType from '@/components/AskConversationType';


export default async function ArtiBot() {
	// const {data, status} = useSession();
	const session = await getServerSession(authOptions)
	// const router = useRouter();
	const status = '';
	console.log('session - ', session);


	let jsx = <AppLoader />

	if(!session) jsx = redirect('/', 'replace');


	if(session) jsx = <AskConversationType />

	return jsx;
}
