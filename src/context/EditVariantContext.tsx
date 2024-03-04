'use client';

import React, {createContext, FC, useCallback, useContext, useLayoutEffect, useReducer} from 'react';
import axios, {AxiosError} from 'axios';
import {ROUTES} from '@/config/api-config';
import {Feedback, FeedBackKeyProperty, IAdCreative} from '@/interfaces/IAdCreative';
import {ChatGPTMessageObj, FeedBackKey, IAdVariant} from '@/interfaces/IArtiBot';
import {useSession} from 'next-auth/react';
import ObjectId from 'bson-objectid';
import { REGENERATE_SECTION } from '@/components/ArtiBot/EditAdVariant/EditAdVariant';
import { VariantImageMap } from '@/services/VariantImageMap';

interface IEditVariantData {
	variant?: IAdVariant;
}

export type EditVariantData = IEditVariantData | null | false;

// An enum with all the types of actions to use in our reducer
enum EDIT_VARIANT_ACTION_TYPE {
    START_EDITING_VARIANT = 'START_EDITING_VARIANT',
    STOP_EDITING_VARIANT = 'STOP_EDITING_VARIANT',
    UPDATE_VARIANT = 'UPDATE_VARIANT',
	REGENERATE_VARIANT_IMAGE = 'REGENERATE_VARIANT_IMAGE',
	UPDATE_VARIANT_IMAGES = 'UPDATE_VARIANT_IMAGES',
	RESET_LAST_IMAGE_URL = 'RESET_LAST_IMAGE_URL',
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
	regeneratedImages?: Record<IAdVariant['id'], string[]>
	variantImages?: VariantImageMap[];
	fallbackImage?: Record<IAdVariant['id'], string>
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
			const imageUrl = state.variant?.imageUrl;

			const _fallbackImage = state.variant?.id && imageUrl ? {[state.variant?.id]: imageUrl} : {};
			return {
				...state,
				variant: undefined,
				variantImages: undefined,
				fallbackImage: {...(state.fallbackImage ?? {}), ..._fallbackImage}
			}
        case EDIT_VARIANT_ACTION_TYPE.UPDATE_VARIANT:
			return {
				...state,
				variant: payload
			}
		case EDIT_VARIANT_ACTION_TYPE.RESET_LAST_IMAGE_URL:
			return {
				...state,
				fallbackImage: undefined
			}
		case EDIT_VARIANT_ACTION_TYPE.REGENERATE_VARIANT_IMAGE:
			const images = {...state.regeneratedImages};
			let arr = images[payload.variantId] ?? [];
			if(!arr.includes(payload.imageUrl)) {
				arr.push(payload.imageUrl);
			}
			images[payload.variantId] = arr;
			console.log('images - ', images);
			return {
				...state,
				regeneratedImages: images
			}
		case EDIT_VARIANT_ACTION_TYPE.UPDATE_VARIANT_IMAGES:
			return {
				...state,
				variantImages: payload
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

export function updateVariantImages(dispatch: (a: EditVariantAction) => void, variantImages: VariantImageMap[]) {
	dispatch({
		type: EDIT_VARIANT_ACTION_TYPE.UPDATE_VARIANT_IMAGES,
		payload: variantImages
	})
}

export function resetImageUrl(dispatch: (a: EditVariantAction) => void) {
	dispatch({
		type: EDIT_VARIANT_ACTION_TYPE.RESET_LAST_IMAGE_URL,
		payload: undefined
	})
}

export async function regenerateVariantData(dispatch: (a: EditVariantAction) => void, variantId: IAdVariant['id'], key: REGENERATE_SECTION, extraInput?: string | null) {
	try {
		const response = await axios.get(ROUTES.VARIANT.REGENERATE_DATA(variantId, key, extraInput), {
			headers: {
				'Authorization': 'Bearer ' + localStorage.getItem('token')
			}
		});
		if(key === REGENERATE_SECTION.IMAGE) {
			dispatch({
				type: EDIT_VARIANT_ACTION_TYPE.REGENERATE_VARIANT_IMAGE,
				payload: {
					variantId,
					imageUrl: response.data.data
				}
			})
		}
		if(response.data.ok) {
			return response.data.data;
		}
		return response.data.ok;
	} catch (error: any) {
		return {
			ok: false,
			error: error as AxiosError
		};
	}
}

export {
  useEditVariant,
	EditVariantContextProvider
};
