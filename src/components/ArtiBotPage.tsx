'use client';

import React, {FC} from 'react';
import ObjectId from 'bson-objectid';
import {dummy} from '@/constants/dummy';
import {redirect, useParams, useSearchParams} from 'next/navigation';
import {useConversation} from '@/context/ConversationContext';
import {ConversationType} from '@/interfaces/IConversation';

interface ArtiBotPageProps {
	projectName: string;
}

const ArtiBotPage: FC<ArtiBotPageProps> = ({projectName}) => {
	const { state } = useConversation();
	const searchParams = useSearchParams();
	const isStrategy = searchParams.get('conversation_type') === ConversationType.STRATEGY;

	const conversationType = isStrategy ? ConversationType.STRATEGY : ConversationType.AD_CREATIVE;

	// Check if the conversation with no activity exists
	const id = ObjectId();

	if (isStrategy) {
		return redirect(`/artibot/${conversationType}/${id}?project_name=${projectName}`, 'replace');
	} else {
		return redirect(`/artibot/${conversationType}/${id}?project_name=${projectName}`, 'replace');
	}
};
export default ArtiBotPage;
