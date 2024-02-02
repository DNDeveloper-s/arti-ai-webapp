import AppLoader from '@/components/AppLoader';
import React from 'react';
import {redirect, useParams} from 'next/navigation';
import { getServerSession } from "next-auth/next"
import {authOptions} from '@/app/api/auth/[...nextauth]/route';
import Conversation from '@/components/Conversation';
import {ConversationContextProvider} from '@/context/ConversationContext';
import {ConversationType} from '@/interfaces/IConversation';


export default async function ConversationID() {
	// const {data, status} = useSession();
	const session = await getServerSession(authOptions)
	// const router = useRouter();
	const status = '';

	let jsx = <AppLoader />

	if(!session) jsx = redirect('/', 'replace');

	if(session) jsx = <Conversation type={ConversationType.AD_CREATIVE} />

	return jsx;
}
