'use client';

import React, {createContext, FC, useCallback, useContext, useLayoutEffect, useReducer} from 'react';
import axios, {AxiosError} from 'axios';
import {ROUTES} from '@/config/api-config';
import {Feedback, FeedBackKeyProperty, IAdCreative} from '@/interfaces/IAdCreative';
import {ChatGPTMessageObj, FeedBackKey, IAdVariant} from '@/interfaces/IArtiBot';
import {useSession} from 'next-auth/react';
import ObjectId from 'bson-objectid';

interface IEditVariantData {
	variant?: IAdVariant;
}

export type EditVariantData = IEditVariantData | null | false;

// An enum with all the types of actions to use in our reducer
enum EDIT_VARIANT_ACTION_TYPE {
    START_EDITING_VARIANT = 'START_EDITING_VARIANT',
    STOP_EDITING_VARIANT = 'STOP_EDITING_VARIANT',
    UPDATE_VARIANT = 'UPDATE_VARIANT',
}

// An interface for our actions
interface EditVariantAction {
	type: EDIT_VARIANT_ACTION_TYPE;
	payload: any;
}

interface IError {
	message: string;
}

interface IEditVariantState {
	variant?: IAdVariant;
}

export const initEditVariantState: IEditVariantState = {
	variant: undefined
}

function editVariantReducer(state: IEditVariantState, action: EditVariantAction): IEditVariantState {
	const { type, payload } = action;
	switch (type) {
		case EDIT_VARIANT_ACTION_TYPE.START_EDITING_VARIANT:
			return {
				...state,
				variant: payload
			}
		case EDIT_VARIANT_ACTION_TYPE.STOP_EDITING_VARIANT:
			return {
				...state,
				variant: undefined
			}
        case EDIT_VARIANT_ACTION_TYPE.UPDATE_VARIANT:
			return {
				...state,
				variant: payload
			}
		default:
			return state;
	}
}

const useEditVariantContext = (initState: IEditVariantState) => {
	const [state, dispatch] = useReducer(editVariantReducer, initState);
	
	const handleFeedBackKey = useCallback((variantId: IAdVariant['id'], feedbackKey: FeedBackKeyProperty, feedback: Feedback) => {

	}, [])

	return {state, dispatch, handleFeedBackKey};
}

type UseEditVariantContextType = ReturnType<typeof useEditVariantContext>;

export const EditVariantContext = createContext<UseEditVariantContextType>({
	handleFeedBackKey(variantId: IAdVariant["id"], feedbackKey: FeedBackKeyProperty, feedback: Feedback): void {
	}, state: initEditVariantState, dispatch: (action: EditVariantAction) => {}});

const EditVariantContextProvider: FC<{children: React.ReactElement} & IEditVariantState> = ({children, ...initState}) => {
	const context = useEditVariantContext(initState);

	return <EditVariantContext.Provider value={context}>
		{children}
	</EditVariantContext.Provider>
}


type UseEditVariantHookType = {
	state: IEditVariantState;
	dispatch: (action: EditVariantAction) => void;
	handleFeedBackKey: (variantId: IAdVariant['id'], feedbackKey: FeedBackKeyProperty, feedback: Feedback) => void;
}

function useEditVariant(): UseEditVariantHookType {
	const context = useContext(EditVariantContext);
	if (context === undefined) {
		throw new Error('useEditVariant must be used within a EditVariantContextProvider')
	}
	return context;
}

export function startEditingVariant(dispatch: (a: EditVariantAction) => void, variant: IAdVariant) {
	dispatch({
		type: EDIT_VARIANT_ACTION_TYPE.START_EDITING_VARIANT,
		payload: variant
	})
}

export function stopEditingVariant(dispatch: (a: EditVariantAction) => void) {
	dispatch({
		type: EDIT_VARIANT_ACTION_TYPE.STOP_EDITING_VARIANT,
		payload: undefined
	})
}

export function updateVariant(dispatch: (a: EditVariantAction) => void, variant: IAdVariant) {
	dispatch({
		type: EDIT_VARIANT_ACTION_TYPE.UPDATE_VARIANT,
		payload: variant
	})
}

export {
  useEditVariant,
	EditVariantContextProvider
};
