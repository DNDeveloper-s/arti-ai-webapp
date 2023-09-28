'use client';

import React, {createContext, FC, useContext, useReducer, useState} from 'react';
import {IConversation} from '@/interfaces/IConversation';

interface IConversationData {

}

export type ConversationData = IConversationData | null | false;

// An enum with all the types of actions to use in our reducer
enum CONVERSATION_ACTION_TYPE {
	INCREASE = 'INCREASE',
	DECREASE = 'DECREASE',
}

// An interface for our actions
interface ConversationAction {
	type: CONVERSATION_ACTION_TYPE;
	payload: any;
}

interface IConversationState {
	conversations: any;
}

export const ConversationContext = createContext();

function conversationReducer(state: IConversationState, action: ConversationAction): IConversationState {
	const { type, payload } = action;
	switch (type) {
		case CONVERSATION_ACTION_TYPE.INCREASE:
			return {
				...state,
				conversations: state.conversations,
			};
		case CONVERSATION_ACTION_TYPE.DECREASE:
			return {
				...state,
				conversations: state.conversations,
			};
		default:
			return state;
	}
}

const ConversationContextProvider: FC<{children: React.ReactElement}> = (props) => {
	// const [ConversationData, setConversationData] = useState<ConversationData>(null);
	const [state, dispatch] = useReducer(conversationReducer, {conversations: []})
	// NOTE: you *might* need to memoize this value
	// Learn more in http://kcd.im/optimize-context
	const value = {state, dispatch}

	return <ConversationContext.Provider value={value}>
		{props.children}
	</ConversationContext.Provider>
}

function useConversation() {
	const context = useContext(ConversationContext);
	if (context === undefined) {
		throw new Error('useConversation must be used within a ConversationContextProvider')
	}
	return context
}

export {useConversation, ConversationContextProvider};
