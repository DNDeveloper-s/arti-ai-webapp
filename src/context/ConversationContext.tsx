'use client';

import React, {createContext, FC, useCallback, useContext, useLayoutEffect, useReducer} from 'react';
import {ConversationType, IConversation} from '@/interfaces/IConversation';
import axios, {AxiosError} from 'axios';
import {ROUTES} from '@/config/api-config';
import {Feedback, FeedBackKeyProperty, IAdCreative} from '@/interfaces/IAdCreative';
import {ChatGPTMessageObj, FeedBackKey, IAdVariant} from '@/interfaces/IArtiBot';
import {useSession} from 'next-auth/react';
import ObjectId from 'bson-objectid';

interface IConversationData {

}

export type ConversationData = IConversationData | null | false;

// An enum with all the types of actions to use in our reducer
enum CONVERSATION_ACTION_TYPE {
	LOADING = 'LOADING',
	LOADED = 'LOADED',
	CLEAR_ERROR = 'CLEAR_ERROR',
	ADD_ADCREATIVES = 'ADD_ADCREATIVES',
	REMOVE_ADCREATIVES = 'REMOVE_ADCREATIVES',
	UPDATING_VARIANT_IMAGE = 'UPDATING_VARIANT_IMAGE',
	UPDATE_VARIANT_IMAGE = 'UPDATE_VARIANT_IMAGE',
	ERROR_IN_UPDATING_VARIANT_IMAGE = 'ERROR_IN_UPDATING_VARIANT_IMAGE',
	UPDATE_VARIANT_IMAGE_SUCCESS = 'UPDATE_VARIANT_IMAGE_SUCCESS',
	GEN_AD_CREATIVE_IMAGES = 'GEN_AD_CREATIVE_IMAGES',
	GEN_AD_CREATIVE_IMAGES_SUCCESS = 'GEN_AD_CREATIVE_IMAGES_SUCCESS',
	ERROR_IN_GENERATING_CREATIVE_IMAGES = 'ERROR_IN_GENERATING_CREATIVE_IMAGES',
	UPDATE_VARIANT_IMAGE_FAILURE = 'UPDATE_VARIANT_IMAGE_FAILURE',
	GET_ADCREATIVES = 'GET_ADCREATIVES',
	GET_ADCREATIVES_SUCCESS = 'GET_ADCREATIVES_SUCCESS',
	GET_ADCREATIVES_FAILURE = 'GET_ADCREATIVES_FAILURE',
	GET_CONVERSATIONS = 'GET_CONVERSATIONS',
	GET_CONVERSATIONS_SUCCESS = 'GET_CONVERSATIONS_SUCCESS',
	GET_CONVERSATIONS_FAILURE = 'GET_CONVERSATIONS_FAILURE',
	GET_CONVERSATION = 'GET_CONVERSATION',
	GET_CONVERSATION_SUCCESS = 'GET_CONVERSATION_SUCCESS',
	GET_CONVERSATION_FAILURE = 'GET_CONVERSATION_FAILURE',
	CREATE_CONVERSATION = 'CREATE_CONVERSATION',
	CREATE_CONVERSATION_SUCCESS = 'CREATE_CONVERSATION_SUCCESS',
	CREATE_CONVERSATION_FAILURE = 'CREATE_CONVERSATION_FAILURE',
	ADD_TO_MESSAGE_BUFFER = 'ADD_TO_MESSAGE_BUFFER',
	FLUSH_MESSAGE_BUFFER = 'FLUSH_MESSAGE_BUFFER',
	SHOW_ERROR_MESSAGE = 'SHOW_ERROR_MESSAGE',
	HANDLE_FEEDBACK_KEY = 'HANDLE_FEEDBACK_KEY',
}

// An interface for our actions
interface ConversationAction {
	type: CONVERSATION_ACTION_TYPE;
	payload: any;
}

interface StateRecord<T extends {id: string}> {
	map: Record<T['id'], T>;
	list: T[];
}

interface IError {
	message: string;
}

interface IConversationState {
	conversation: StateRecord<IConversation>;
	adCreative: StateRecord<IAdCreative>;
	variant: StateRecord<IAdVariant>;
	conversations?: IConversation[];
	adCreatives?: IAdCreative[];
	conversationMap?: Record<IConversation['id'], IConversation>;
	variantMap?: Record<IAdVariant['id'], IAdVariant>;
	adCreativeMap?: Record<IAdCreative['id'], IAdCreative>;
	loading: LoadingState;
	messageBuffer?: ChatGPTMessageObj[];
	inProcess?: any;
	inError?: any;
	error?: IError;
}

interface StateRecordEnum {
	conversation: StateRecord<IConversation>;
	adCreative: StateRecord<IAdCreative>;
	variant: StateRecord<IAdVariant>;
}

// Create a utility function to extract the adCreativeMap, variantMap from a conversation
const extractFromConversation = (conversation: IConversation): Omit<StateRecordEnum, 'conversation'> => {
	const initializer = {variant: {list: [], map: {}}, adCreative: {list: [], map: {}}};
	return conversation.adCreatives?.reduce((acc: {
		variant: StateRecord<IAdVariant>,
		adCreative: StateRecord<IAdCreative>
	}, adCreative: IAdCreative) => {
		adCreative.variants?.forEach(variant => {
			acc.variant = addKeyToStateRecord(acc.variant, variant);
		})
		acc.adCreative = addKeyToStateRecord(acc.adCreative, adCreative);
		return acc;
	}, initializer) ?? initializer;
}

// Create a utility function to extract the variantMap from an adCreative
const extractFromAdCreative = (adCreative: IAdCreative, initVariant: StateRecord<IAdVariant>): Pick<StateRecordEnum, 'variant'> => {
	return adCreative.variants?.reduce((acc: {
		variant: StateRecord<IAdVariant>,
	}, variant: IAdVariant) => {
		acc.variant = addKeyToStateRecord(acc.variant, variant);
		// acc.variant.map = addKeyToStateRecord(acc.variant.map, variant);
		return acc;
	}, {variant: initVariant});
}

interface LoadingState {
	conversation?: boolean;
	adCreative?: boolean;
	variant?: boolean;
	conversations?: boolean;
	adCreatives?: boolean;
	variants?: boolean
}

type GenerateAdCreativeImageApiSuccess = {
	ok: true;
	url: string;
	name: string;
	variantId: IAdVariant["id"];
};

type GenerateAdCreativeImageApiError = {
	ok: false;
	message: string;
	stack: any;
	variantId: IAdVariant["id"];
};

type GenerateAdCreativeImageApiResponseRes = GenerateAdCreativeImageApiSuccess | GenerateAdCreativeImageApiError

type GenerateAdCreativeImageApiResponse = {
	ok: boolean;
	message: string;
	data: {
		response: GenerateAdCreativeImageApiResponseRes[];
	}
};

export const initConversationState: IConversationState = {
	conversation: {map: {}, list: []},
	adCreative: {map: {}, list: []},
	variant: {map: {}, list: []},
	conversations: [],
	adCreatives: [],
	conversationMap: {},
	variantMap: {},
	adCreativeMap: {},
	loading: {
		conversations: true,
		conversation: true,
		adCreatives: true
	},
	messageBuffer: [],
	inProcess: {},
	inError: {}
}

/**
 * @deprecated
 * @param map
 * @param item
 */
function addKeyToMap<T extends {id: string}>(map: Record<T['id'], T> | undefined, item: T) {
	return {
		...(map ?? {}),
		[item.id]: item
	}
}

/**
 *
 * @param record
 * @param item
 */
function removeKeyFromStateRecord<T extends {id: string}>(record: StateRecord<T>, item: T): StateRecord<T> {
	const list = record.list?.filter(i => i.id !== item.id) ?? [];
	const map = {...record.map};
	delete map[item.id as T["id"]];
	return {
		map,
		list
	}
}

/**
 * Add a key to the state record
 * @param record
 * @param item
 */
function addKeyToStateRecord<T extends {id: string}>(record: StateRecord<T>, item: T): StateRecord<T> {
	const list = record.list?.filter(i => i.id !== item.id) ?? [];
	return {
		map: {
			...(record.map ?? {}),
			[item.id]: item
		},
		list: [
			...list,
			item
		]
	}
}

function updateLoadingState(state: IConversationState, loadingState: IConversationState['loading']): IConversationState['loading'] {
	return {
	...(state.loading ?? {}),
	...loadingState
	}
}

/**
 * Merge new record into the state record
 * @param state
 * @param record
 */
function mergeStateRecord<T extends {id: string}>(state: StateRecord<T>, record: StateRecord<T>): StateRecord<T> {
	const list = state.list?.filter(i => !record.list?.find(j => j.id === i.id)) ?? [];
	return {
		map: {
			...(state.map ?? {}),
			...(record.map ?? {})
		},
		list: [
			...list,
			...(record.list ?? [])
		]
	}
}

function conversationReducer(state: IConversationState, action: ConversationAction): IConversationState {
	const { type, payload } = action;
	switch (type) {
		case CONVERSATION_ACTION_TYPE.UPDATE_VARIANT_IMAGE_SUCCESS:
			const conversations = state.conversations;
			// const newConversations = conversations.reduce((acc, conversation) => {
			//
			// }
			const variant12 = addKeyToStateRecord(state.variant, payload.variant);
			// const _variantMap = {...state.variant.map};
			// if(!_variantMap[payload.variantId]) {
			// 	_variantMap[payload.variantId] = {};
			// }
			// if(_variantMap[payload.variantId]) _variantMap[payload.variantId].imageUrl = payload.imageUrl;
			return {
				...state,
				loading: updateLoadingState(state, {variant: false}),
				variant: mergeStateRecord(state.variant, variant12),
				inProcess: {
					...(state.inProcess ?? {}),
					[payload.variantId]: false
				}
			};
		case CONVERSATION_ACTION_TYPE.GEN_AD_CREATIVE_IMAGES:
			let { conversationId: adCreativeId1 } = payload;
			const variantList = state.adCreative.list.find(adCreative => adCreative.id === adCreativeId1)?.variants ?? [];
			const init = {inProcess: {...(state.inProcess ?? {})}};
			const map1 = variantList.reduce((acc: typeof init, variant) => {
				if(variant.imageUrl) {
					acc.inProcess[variant.id] = false;
					return acc;
				}
				acc.inProcess[variant.id] = true;
				return acc;
			}, init);

			return {
				...state,
				loading: updateLoadingState(state, {variant: false}),
				inProcess: {
					...map1.inProcess,
					[adCreativeId1]: true
				}
			};
		case CONVERSATION_ACTION_TYPE.GEN_AD_CREATIVE_IMAGES_SUCCESS:
			const { conversationId, response } = payload;
			// const adCreative = state.adCreative.map[adCreativeId];
			let adVariant = {...state.variant};
			response.map((res: GenerateAdCreativeImageApiResponseRes) => {
				if(res.ok) {
					const variant = state.variant.map[res.variantId];
					variant.imageUrl = res.url;
					adVariant = addKeyToStateRecord(adVariant, variant);
					state.inError[res.variantId] = false;
					state.inProcess[res.variantId] = false;
				} else {
					state.inError[res.variantId] = true;
					state.inProcess[res.variantId] = false;
				}
			});

			return {
				...state,
				inProcess: {
					...(state.inProcess ?? {}),
					[conversationId]: false
				},
				inError: {
					...(state.inError ?? {}),
				},
				variant: mergeStateRecord(state.variant, adVariant)
			};
		case CONVERSATION_ACTION_TYPE.UPDATING_VARIANT_IMAGE:
			return {
				...state,
				inProcess: {
					...(state.inProcess ?? {}),
					[payload.variantId]: true
				}
			};
		case CONVERSATION_ACTION_TYPE.ERROR_IN_UPDATING_VARIANT_IMAGE:
			return {
				...state,
				inProcess: {
					...(state.inProcess ?? {}),
					[payload.variantId]: false
				},
				inError: {
					...(state.inError ?? {}),
					[payload.variantId]: true
				}
			};
		case CONVERSATION_ACTION_TYPE.GET_ADCREATIVES:
			return {
				...state,
				loading: updateLoadingState(state, {adCreatives: true})
			};
		case CONVERSATION_ACTION_TYPE.ADD_ADCREATIVES:
			// Prepare the variantMap and adCreativeMap
			const _initial12 =  {variant: {map: {}, list: []}, adCreative: {map: {}, list: []}};
			const maps3 = payload.adCreatives?.reduce((acc: Omit<StateRecordEnum, 'conversation'>, adCreative: IAdCreative) => {
				acc.adCreative = addKeyToStateRecord(acc?.adCreative, adCreative);
				const {variant} = extractFromAdCreative(adCreative, acc.variant);
				acc.variant = variant;
				return acc;
			}, _initial12) ?? _initial12;

			return {
				...state,
				loading: updateLoadingState(state, {adCreatives: false}),
				adCreative: mergeStateRecord(state.adCreative, maps3.adCreative),
				variant: mergeStateRecord(state.variant, maps3.variant),
			};
		case CONVERSATION_ACTION_TYPE.REMOVE_ADCREATIVES:
			const _adCreatives = payload.adCreatives as IAdCreative[];
			_adCreatives.forEach(adCreative => {
				state.adCreative = removeKeyFromStateRecord(state.adCreative, adCreative);
				adCreative.variants?.forEach(variant => {
					state.variant = removeKeyFromStateRecord(state.variant, variant);
				})
			})
			return {
				...state
			}
		case CONVERSATION_ACTION_TYPE.HANDLE_FEEDBACK_KEY:
			// const _adCreatives = payload.adCreatives as IAdCreative[];
			// _adCreatives.forEach(adCreative => {
			// 	state.adCreative = removeKeyFromStateRecord(state.adCreative, adCreative);
			// 	adCreative.variants?.forEach(variant => {
			// 		state.variant = removeKeyFromStateRecord(state.variant, variant);
			// 	})
			// })
			const {variantId, feedbackKey, feedback} = payload as {variantId: IAdVariant['id'], feedbackKey: FeedBackKeyProperty, feedback: Feedback};
			const variant = state.variant.map[variantId];
			// if(!variant.feedback) variant.feedback = {};
			// variant.feedback[feedbackKey] = feedback;

			const variantsFeedbackLocal = window.localStorage.getItem('variantsFeedback');
			let obj: Record<string, string> = {};
			try {
				obj = JSON.parse(variantsFeedbackLocal ?? '{}');
			} catch (e) {
				obj = {};
			}

			variant.feedback = {
				// @ts-ignore
				...(obj[variantId] ?? {}),
				[feedbackKey]: feedback
			}

			window.localStorage.setItem('variantsFeedback', JSON.stringify({...obj, [variantId]: variant.feedback}));

			state.variant = addKeyToStateRecord(state.variant, variant);
			return {
				...state
			}
		case CONVERSATION_ACTION_TYPE.GET_ADCREATIVES_SUCCESS:
			// Prepare the variantMap and adCreativeMap
			const maps2 = payload.adCreatives.reduce((acc: Omit<StateRecordEnum, 'conversation'>, adCreative: IAdCreative) => {
				acc.adCreative = addKeyToStateRecord(acc?.adCreative, adCreative);
				const {variant} = extractFromAdCreative(adCreative, acc.variant);
				acc.variant = variant;
				return acc;
			}, {variant: {...state.variant}, adCreative: {...state.adCreative}});
			return {
				...state,
				loading: updateLoadingState(state, {adCreatives: false}),
				adCreatives: payload.adCreatives ?? state.adCreatives,
				adCreativeMap: {...(state.adCreativeMap ?? {}), ...maps2.adCreativeMap},
				variantMap: {...(state.variantMap ?? {}), ...maps2.variantMap},
				adCreative: mergeStateRecord(state.adCreative, maps2.adCreative),
				variant: mergeStateRecord(state.variant, maps2.variant),
			};
		case CONVERSATION_ACTION_TYPE.GET_CONVERSATIONS:
			return {
				...state,
				loading: updateLoadingState(state, {conversations: true}),
			}
		case CONVERSATION_ACTION_TYPE.GET_CONVERSATIONS_SUCCESS:
			const maps = payload.conversations.reduce((acc: StateRecordEnum, conversation: IConversation) => {
				acc.conversation = addKeyToStateRecord(acc?.conversation, conversation);
				const {variant, adCreative} = extractFromConversation(conversation);
				acc.variant = {...acc.variant, ...variant};
				acc.adCreative = {...acc.adCreative, ...adCreative};
				return acc;
			}, {variant: {}, adCreative: {}, conversation: {}});

			return {
				...state,
				loading: updateLoadingState(state, {conversations: false}),
				conversations: payload.conversations ?? state.conversations,
				conversation: mergeStateRecord(state.conversation, maps.conversation),
				adCreative: mergeStateRecord(state.adCreative, maps.adCreative),
				variant: mergeStateRecord(state.variant, maps.variant),
			};
		case CONVERSATION_ACTION_TYPE.SHOW_ERROR_MESSAGE:
			return {
				...state,
				error: {
					message: action.payload.message
				},
			}
		case CONVERSATION_ACTION_TYPE.CLEAR_ERROR:
			return {
				...state,
				error: undefined,
			}
		case CONVERSATION_ACTION_TYPE.GET_CONVERSATION:
			return {
				...state,
				loading: updateLoadingState(state, {conversation: true}),
			}
		case CONVERSATION_ACTION_TYPE.GET_CONVERSATION_SUCCESS:
			if(!payload.conversation) {
				return {
					...state,
					loading: updateLoadingState(state, {conversation: false}),
				}
			}


			const conversation1 = addKeyToStateRecord(state.conversation, payload.conversation);
			const _initial1 = {variant: {map: {}, list: []}, adCreative: {map: {}, list: []}};
			const _maps13 = payload.conversation.adCreatives?.reduce((acc: Omit<StateRecordEnum, 'conversation'>, adCreative: IAdCreative) => {
				acc.adCreative = addKeyToStateRecord(acc?.adCreative, adCreative);
				const {variant} = extractFromAdCreative(adCreative, acc.variant);
				acc.variant = {...acc.variant, ...variant};
				return acc;
			}, _initial1) ?? _initial1;
			return {
				...state,
				loading: updateLoadingState(state, {conversation: false}),
				conversation: mergeStateRecord(state.conversation, conversation1),
				adCreative: mergeStateRecord(state.adCreative, _maps13.adCreative),
				variant: mergeStateRecord(state.variant, _maps13.variant),
			};
		case CONVERSATION_ACTION_TYPE.CREATE_CONVERSATION_SUCCESS:
			const conversation = addKeyToStateRecord(state.conversation, payload.conversation);
			const _initial = {variant: {map: {}, list: []}, adCreative: {map: {}, list: []}};
			const _maps12 = payload.conversation.adCreatives?.reduce((acc: Omit<StateRecordEnum, 'conversation'>, adCreative: IAdCreative) => {
				acc.adCreative = addKeyToStateRecord(acc?.adCreative, adCreative);
				const {variant} = extractFromAdCreative(adCreative, acc.variant);
				acc.variant = {...acc.variant, ...variant};
				return acc;
			}, _initial) ?? _initial;
			return {
				...state,
				loading: updateLoadingState(state, {conversation: false}),
				conversation: mergeStateRecord(state.conversation, conversation),
				adCreative: mergeStateRecord(state.adCreative, _maps12.adCreative),
				variant: mergeStateRecord(state.variant, _maps12.variant),
				// adCreativeMap: maps.adCreativeMap,
				// variantMap: maps.variantMap
			};
		// case CONVERSATION_ACTION_TYPE.LOADING:
		// 	return {
		// 		...state,
		// 		loading: true
		// 	};
		// case CONVERSATION_ACTION_TYPE.LOADED:
		// 	return {
		// 		...state,
		// 		loading: false
		// 	};
		case CONVERSATION_ACTION_TYPE.ADD_TO_MESSAGE_BUFFER:
			const messageBuffer = [...(state?.messageBuffer ?? [])];
			messageBuffer.push(payload);
			return {
				...state,
				messageBuffer
			}
		case CONVERSATION_ACTION_TYPE.FLUSH_MESSAGE_BUFFER:
			return {
				...state,
				messageBuffer: []
			}
		default:
			return state;
	}
}

const useConversationContext = (initState: IConversationState) => {
	const [state, dispatch] = useReducer(conversationReducer, initState);
	const session = useSession({required: false});
	
	useLayoutEffect(() => {
		if(session?.data?.user?.token?.accessToken) {
			localStorage.setItem('token', session?.data?.user?.token?.accessToken);
		} else {
			localStorage.removeItem('token');
		}
	}, [session])

	const getVariantsByAdCreativeId = useCallback((adCreativeId: string) => {
		const conversationId = state.adCreative.map[adCreativeId]?.conversationId;
		if(!conversationId) return null;
		const adCreativeIds = state.adCreative.list.filter(adCreative => adCreative.conversationId === conversationId).map(adCreative => adCreative.id);
		const variantIds = state.adCreative.list.filter(adCreative => adCreativeIds?.includes(adCreative.id)).map(adCreative => adCreative.variants?.map(variant => variant.id)).flat();
		if(!variantIds) return null;
		return state.variant.list.filter(c => variantIds.includes(c.id)).sort((a, b) => a.id > b.id ? -1 : 1);
	}, [state.adCreative.list, state.adCreative.map, state.variant.list]);

	const handleFeedBackKey = useCallback((variantId: IAdVariant['id'], feedbackKey: FeedBackKeyProperty, feedback: Feedback) => {
		dispatch({
			type: CONVERSATION_ACTION_TYPE.HANDLE_FEEDBACK_KEY,
			payload: {
				variantId,
				feedbackKey,
				feedback
			}
		});
	}, [])

	// const increment = useCallback(() => {
	// 	dispatch({type: REDUCER_ACTION_TYPE.INCREMENT});
	// }, []);

	return {state, dispatch, getVariantsByAdCreativeId, handleFeedBackKey};
}

type UseConversationContextType = ReturnType<typeof useConversationContext>;

export const ConversationContext = createContext<UseConversationContextType>({
	handleFeedBackKey(variantId: IAdVariant["id"], feedbackKey: FeedBackKeyProperty, feedback: Feedback): void {
	},
	getVariantsByAdCreativeId(adCreativeId: string): null | any {
		return undefined;
	}, state: initConversationState, dispatch: (action: ConversationAction) => {}});

const ConversationContextProvider: FC<{children: React.ReactElement} & IConversationState> = ({children, ...initState}) => {
	// const [ConversationData, setConversationData] = useState<ConversationData>(null);
	// const [state, dispatch] = useReducer(conversationReducer, {conversations: []})
	// NOTE: you *might* need to memoize this value
	// Learn more in http://kcd.im/optimize-context
	// const value = {state, dispatch}

	const context = useConversationContext(initState);

	return <ConversationContext.Provider value={context}>
		{children}
	</ConversationContext.Provider>
}


type UseCreateSalesHookType = {
	state: IConversationState;
	dispatch: (action: ConversationAction) => void;
	getVariantsByAdCreativeId: (adCreativeId: string) => IAdVariant[] | null;
	handleFeedBackKey: (variantId: IAdVariant['id'], feedbackKey: FeedBackKeyProperty, feedback: Feedback) => void;
}

function useConversation(): UseCreateSalesHookType {
	const context = useContext(ConversationContext);
	if (context === undefined) {
		throw new Error('useConversation must be used within a ConversationContextProvider')
	}
	return context;
}

async function updateVariantImage(dispatch: (a: ConversationAction) => void, text: string, variantId: string) {
	dispatch({
		type: CONVERSATION_ACTION_TYPE.UPDATING_VARIANT_IMAGE,
		payload: {
			variantId,
		}
	});

	try {
		// Update the variant
		// const updatedVariant =
		const response = await axios.patch(ROUTES.VARIANT.UPDATE_IMAGE(variantId), {text}, {
			headers: {
				'Authorization': 'Bearer ' + localStorage.getItem('token')
			}
		});
		if(response.data.ok) {
			dispatch({type: CONVERSATION_ACTION_TYPE.UPDATE_VARIANT_IMAGE_SUCCESS, payload: {variantId, variant: response.data.data}});
		} else {
			dispatch({type: CONVERSATION_ACTION_TYPE.ERROR_IN_UPDATING_VARIANT_IMAGE, payload: {variantId}});
		}
	} catch (error: any) {
		dispatch({type: CONVERSATION_ACTION_TYPE.ERROR_IN_UPDATING_VARIANT_IMAGE, payload: {variantId}});
	}
}

async function generateAdCreativeImages(dispatch: (a: ConversationAction) => void, conversationId: string) {
	dispatch({
		type: CONVERSATION_ACTION_TYPE.GEN_AD_CREATIVE_IMAGES,
		payload: {
			conversationId,
		}
	});

	try {
		const response = await axios.patch<GenerateAdCreativeImageApiResponse>(ROUTES.CONVERSATION.GENERATE_IMAGES(conversationId), {}, {
			headers: {
				'Authorization': 'Bearer ' + localStorage.getItem('token')
			}
		});

		if(response.data.ok) {
			dispatch({type: CONVERSATION_ACTION_TYPE.GEN_AD_CREATIVE_IMAGES_SUCCESS, payload: {conversationId, response: response.data.data.response}});
		} else {
			dispatch({type: CONVERSATION_ACTION_TYPE.ERROR_IN_GENERATING_CREATIVE_IMAGES, payload: {conversationId}});
		}
	} catch (error: any) {
		dispatch({type: CONVERSATION_ACTION_TYPE.ERROR_IN_GENERATING_CREATIVE_IMAGES, payload: {conversationId}});
	}

}

function withRetry(func: Function) {
	const retry = 1;

	let a = func();

	if(!a) {
		a = func();
	}

	return;
}

async function getConversations(dispatch: (a: ConversationAction) => void, maxRetries = 2) {
	dispatch({
		type: CONVERSATION_ACTION_TYPE.GET_CONVERSATIONS,
		payload: {}
	});

	for (let retry = 0; retry < maxRetries; retry++) {
		try {
			const response = await axios.get(ROUTES.CONVERSATION.QUERY(), {
				headers: {
					'Authorization': 'Bearer ' + localStorage.getItem('token')
				}
			});
			if(response.data.ok) {
				return dispatch({type: CONVERSATION_ACTION_TYPE.GET_CONVERSATIONS_SUCCESS, payload: {conversations: response.data.data}});
			}
			await new Promise(resolve => setTimeout(resolve, 1000));
		} catch (error: any) {
			await new Promise(resolve => setTimeout(resolve, 1000));
		}
	}

	dispatch({type: CONVERSATION_ACTION_TYPE.SHOW_ERROR_MESSAGE, payload: {message: 'Unable to fetch the conversations. Please try again!'}});
}

async function getAdCreatives(dispatch: (a: ConversationAction) => void) {
	dispatch({
		type: CONVERSATION_ACTION_TYPE.GET_ADCREATIVES,
		payload: {}
	});

	try {
		const response = await axios.get(ROUTES.ADCREATIVE.QUERY(), {
			headers: {
				'Authorization': 'Bearer ' + localStorage.getItem('token')
			}
		});
		if(response.data.ok) {
			dispatch({type: CONVERSATION_ACTION_TYPE.GET_ADCREATIVES_SUCCESS, payload: {adCreatives: response.data.data}});
		}
	} catch (error: any) {
		dispatch({type: CONVERSATION_ACTION_TYPE.GET_ADCREATIVES_FAILURE, payload: {error: error.message}});
	}

}

async function getConversation(dispatch: (a: ConversationAction) => void, conversationId: string) {
	dispatch({
		type: CONVERSATION_ACTION_TYPE.GET_CONVERSATION,
		payload: {}
	});

	try {
		const response = await axios.get(ROUTES.CONVERSATION.GET(conversationId), {
			headers: {
				'Authorization': 'Bearer ' + localStorage.getItem('token')
			}
		});
		if(response.data.ok) {
			return dispatch({type: CONVERSATION_ACTION_TYPE.GET_CONVERSATION_SUCCESS, payload: {conversation: response.data.data}});
		}
		dispatch({type: CONVERSATION_ACTION_TYPE.SHOW_ERROR_MESSAGE, payload: {message: 'Unable to fetch the conversation. Please try again!'}});
	} catch (error: any) {
		dispatch({type: CONVERSATION_ACTION_TYPE.SHOW_ERROR_MESSAGE, payload: {message: 'Unable to fetch the conversation. Please try again!'}});
	}
}

function createConversation(dispatch: (a: ConversationAction) => void, body: any) {
	dispatch({
		type: CONVERSATION_ACTION_TYPE.CREATE_CONVERSATION,
		payload: {}
	});

	try {
		// const response = await axios.post(ROUTES.CONVERSATION.CREATE(conversationId), body);
		// if(response.data.ok) {
		dispatch({type: CONVERSATION_ACTION_TYPE.CREATE_CONVERSATION_SUCCESS, payload: {conversation: body}});
		// }
	} catch (error: any) {
		dispatch({type: CONVERSATION_ACTION_TYPE.CREATE_CONVERSATION_FAILURE, payload: {error: error.message}});
	}
}

function addAdCreatives(dispatch: (a: ConversationAction) => void, body: IAdCreative[]) {
	dispatch({
		type: CONVERSATION_ACTION_TYPE.ADD_ADCREATIVES,
		payload: {
			adCreatives: body ?? []
		}
	});

	// try {
	// 	// const response = await axios.post(ROUTES.CONVERSATION.CREATE(conversationId), body);
	// 	// if(response.data.ok) {
	// 	dispatch({type: CONVERSATION_ACTION_TYPE.ADD_ADCREATIVE_SUCCESS, payload: {conversation: body}});
	// 	// }
	// } catch (error: any) {
	// 	dispatch({type: CONVERSATION_ACTION_TYPE.ADD_ADCREATIVE_FAILURE, payload: {error: error.message}});
	// }
}

function addMessageToBuffer(dispatch: (a: ConversationAction) => void, body: ChatGPTMessageObj) {
	dispatch({
		type: CONVERSATION_ACTION_TYPE.ADD_TO_MESSAGE_BUFFER,
		payload: body
	})
}

function flushBufferMessage(dispatch: (a: ConversationAction) => void) {
	dispatch({
		type: CONVERSATION_ACTION_TYPE.FLUSH_MESSAGE_BUFFER,
		payload: null
	})
}

async function saveMessages(dispatch: (a: ConversationAction) => void, messages: ChatGPTMessageObj[], conversationId: string, conversationType: ConversationType, projectName: string) {
	try {
		const response = await axios.post(ROUTES.MESSAGE.SAVE, {
			messages,
			conversationId,
			conversationType,
			projectName
		}, {
			headers: {
				'Authorization': 'Bearer ' + localStorage.getItem('token')
			}
		})
		if(!response?.data?.ok) {
			dispatch({type: CONVERSATION_ACTION_TYPE.SHOW_ERROR_MESSAGE, payload: {message: response?.data?.message ?? 'Unable to save your message. Please try again later.'}});
		}
	} catch(error: any) {
		dispatch({type: CONVERSATION_ACTION_TYPE.SHOW_ERROR_MESSAGE, payload: {message: 'Unable to save your message. Please try again later.'}});
	}
}

async function saveAdCreativeMessage(dispatch: (a: ConversationAction) => void, messages: ChatGPTMessageObj[], jsonObjectInString: string, conversationId: string, conversationType: ConversationType, projectName: string, onDemand: boolean) {
	const adCreativeJSON = JSON.parse(jsonObjectInString);
	const adCreativesWithIds = adCreativeJSON.variants?.map((variant: IAdVariant) => {
		return {
			...variant,
			_id: 'variant-' + new ObjectId().toString()
		}
	});
	adCreativeJSON._id = 'ad_creative-' + new ObjectId().toString();
	adCreativeJSON.variants = adCreativesWithIds;
	dispatch({
		type: CONVERSATION_ACTION_TYPE.ADD_ADCREATIVES,
		payload: {
			adCreatives: [adCreativeJSON]
		}
	});

	try {
		const response = await axios.post(ROUTES.MESSAGE.SAVE_AD_CREATIVE, {
			messages,
			json: jsonObjectInString,
			conversationId,
			projectName,
			onDemand,
		}, {
			headers: {
				'Authorization': 'Bearer ' + localStorage.getItem('token')
			}
		});

		const result = response.data.data;

		dispatch({
			type: CONVERSATION_ACTION_TYPE.REMOVE_ADCREATIVES,
			payload: {
				adCreatives: [adCreativeJSON]
			}
		});

		dispatch({
			type: CONVERSATION_ACTION_TYPE.ADD_ADCREATIVES,
			payload: {
				replaceId: adCreativeJSON._id,
				adCreatives: result?.adCreatives ?? []
			}
		});

	} catch(e) {
		console.log('e - ', e);
	}
}

function clearError(dispatch: (a: ConversationAction) => void) {
	dispatch({
		type: CONVERSATION_ACTION_TYPE.CLEAR_ERROR,
		payload: {}
	});
}

export {
	createConversation,
	addAdCreatives,
	useConversation,
	getAdCreatives,
	getConversation,
	getConversations,
	updateVariantImage,
	addMessageToBuffer,
	flushBufferMessage,
	generateAdCreativeImages,
	saveMessages,
	clearError,
	saveAdCreativeMessage,
	ConversationContextProvider
};
