'use client';

import ArtiBot from '@/components/ArtiBot/ArtiBot';
import {dummy} from '@/constants/dummy';
import React from 'react';
import {useParams} from 'next/navigation';
import {Conversation} from '@/interfaces/Conversation';

export default function Conversation() {
	let conversation: Conversation | undefined;
	// Create a conversation if the conversation with the id in params doesn't exist
	const params = useParams();
	console.log('params - ', params);
	if(params.conversation_id) {
		// Check if the conversation with the id in params exists
		const exist = dummy.Conversations.find(c => c.id === params.conversation_id);
		// If it doesn't exist, create a new conversation
		if(!exist) {
			// Create a new conversation
			const newConversation: Conversation = {
				id: Array.isArray(params.conversation_id) ? params.conversation_id[0] : params.conversation_id,
				messages: [],
				last_activity: new Date().toISOString(),
				title: 'New Chat',
				// Check if the conversation has any activity
				has_activity: false
			}
			dummy.Conversations.push(newConversation);
			conversation = newConversation;
		} else {
			// If it exists, use that conversation
			conversation = exist;
		}
	}


	return (
		<main>
			{/*<Logo />*/}
			<div className="grid grid-cols-[1fr] h-screen">
				{/*<div className="bg-background">*/}

				{/*</div>*/}
				<ArtiBot conversation={conversation} />
			</div>
		</main>
	)
}
