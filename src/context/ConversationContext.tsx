'use client';

import React, {Context, createContext, FC, useContext, useReducer, useState} from 'react';
import {IConversation} from '@/interfaces/IConversation';

interface IConversationData {

}

export type ConversationData = IConversationData | null | false;

// An enum with all the types of actions to use in our reducer
enum CONVERSATION_ACTION_TYPE {
	INCREASE = 'INCREASE',
	DECREASE = 'DECREASE',
	UPDATING_VARIANT_IMAGE = 'UPDATING_VARIANT_IMAGE',
	UPDATE_VARIANT_IMAGE = 'UPDATE_VARIANT_IMAGE',
	UPDATE_VARIANT_IMAGE_SUCCESS = 'UPDATE_VARIANT_IMAGE_SUCCESS',
	UPDATE_VARIANT_IMAGE_FAILURE = 'UPDATE_VARIANT_IMAGE_FAILURE',
}

// An interface for our actions
interface ConversationAction {
	type: CONVERSATION_ACTION_TYPE;
	payload: any;
}

interface IConversationState {
	conversations?: any;
	variant?: Record<string, string>
}

export const ConversationContext: Context<IConversationState> = createContext({});

function conversationReducer(state: IConversationState, action: ConversationAction): IConversationState {
	const { type, payload } = action;
	switch (type) {
		case CONVERSATION_ACTION_TYPE.UPDATE_VARIANT_IMAGE:
			console.log('updating variant - ', payload.variant, payload.image);
			return {
				...state,
				variant: {
					...(state.variant ?? {}),
					[payload.variant]: payload.image,
				},
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
	const context = useContext<IConversationState>(ConversationContext);
	if (context === undefined) {
		throw new Error('useConversation must be used within a ConversationContextProvider')
	}
	return context;
}

async function updateVariantImage(dispatch: (a: ConversationAction) => void, variant: string, image: string) {
	dispatch({
		type: CONVERSATION_ACTION_TYPE.UPDATING_VARIANT_IMAGE,
		payload: {
			variant,
			image,
		}
	});

	try {
		dispatch({type: CONVERSATION_ACTION_TYPE.UPDATE_VARIANT_IMAGE, payload: {variant, image}});
		// Update the variant
		// const updatedVariant =
		dispatch({type: CONVERSATION_ACTION_TYPE.UPDATE_VARIANT_IMAGE_SUCCESS, payload: {}});
	} catch (error) {
		dispatch({type: CONVERSATION_ACTION_TYPE.UPDATE_VARIANT_IMAGE_FAILURE, payload: {error: error.message}});
	}

}

export {useConversation, updateVariantImage, ConversationContextProvider};
