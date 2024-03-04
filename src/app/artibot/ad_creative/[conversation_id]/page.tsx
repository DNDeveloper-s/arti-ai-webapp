import AppLoader from '@/components/AppLoader';
import React, { useEffect } from 'react';
import {redirect, useParams, useSearchParams} from 'next/navigation';
import { getServerSession } from "next-auth/next"
import {authOptions} from '@/app/api/auth/[...nextauth]/route';
import Conversation from '@/components/Conversation';
import {ConversationContextProvider} from '@/context/ConversationContext';
import {ConversationType} from '@/interfaces/IConversation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';


export default async function ConversationID() {
	const session = await getServerSession(authOptions)


	let jsx = <AppLoader />

	if(!session) jsx = redirect('/');

	if(session) jsx = <Conversation type={ConversationType.AD_CREATIVE} />

	return jsx;

	// const {data, status} = useSession();
	// const params = useParams();
	
	// useEffect(() => {
	// 	console.log('params - ', params);
	// }, [params]);

	// useEffect(() => {
	// 	console.log('data - ', data, status);
	// }, [data, status])

	// useEffect(() => {
	// 	console.log('mounted - ');
	// }, [])

	// return (
	// 	<div>
	// 		<span>{JSON.stringify(params)}</span>
	// 		<div className='flex flex-col gap-2 p-2'>
	// 			<Link href={"/artibot/ad_creative/1"}>Go to conversation 1</Link>
	// 			<Link href={'/artibot/ad_creative/2'}>Go to conversation 2</Link>
	// 			<Link href={'/artibot/ad_creative/3'}>Go to conversation 3</Link>
	// 		</div>
	// 	</div>
	// )
}
