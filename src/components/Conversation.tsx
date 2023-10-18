'use client';

import ArtiBot from '@/components/ArtiBot/ArtiBot';
import {dummy} from '@/constants/dummy';
import React, {useEffect} from 'react';
import {useParams} from 'next/navigation';
import {ConversationType, IConversation} from '@/interfaces/IConversation';
import {createConversation, getConversation, useConversation} from '@/context/ConversationContext';
import useSessionToken from '@/hooks/useSessionToken';

// Fetch the conversation from the database
// If the conversation doesn't exist, create a new conversation
// If the conversation exists, use that conversation

// Update the conversation at the following events:
// 1. When the user sends a message
// 2. When the user receives a message
// 3. When the user opens the conversation
// 4. When the user closes the conversation

// Update the ad creative at the following events:
// 1. When the ad creative is generated
// 2. When the user likes the ad creative
// 3. When the user dislikes the ad creative
// 4. When the user comments on the ad creative

export default function Conversation({type = ConversationType.AD_CREATIVE}: {type: ConversationType}) {
	let conversation: IConversation | undefined;
	const {state, dispatch} = useConversation();
	const params = useParams();
	const token = useSessionToken();

	useEffect(() => {
		if(params.conversation_id && token) getConversation(dispatch, params.conversation_id.toString());
	}, [dispatch, token, params.conversation_id])

	useEffect(() => {
		if(state.loading || !dispatch || !params.conversation_id) return;

		if(!state.conversation.map || !state.conversation.map[params.conversation_id]) {
			const newConversation: IConversation = {
				id: Array.isArray(params.conversation_id) ? params.conversation_id[0] : params.conversation_id,
				messages: [],
				last_activity: new Date().toISOString(),
				title: 'New Chat',
				conversation_type: type,
				// Check if the conversation has any activity
				has_activity: false
			}
			createConversation(dispatch, newConversation);
		}
	}, [dispatch, state.loading, state.conversation.map, params.conversation_id])

	return (
		<main>
			{/*<Logo />*/}
			<div className="grid grid-cols-[1fr] h-screen">
				{/*<div className="bg-background">*/}

				{/*</div>*/}
				{state.conversation.map && state.conversation.map[params.conversation_id] && <ArtiBot conversation={state.conversation.map[params.conversation_id]}/>}
			</div>
		</main>
	)
}
