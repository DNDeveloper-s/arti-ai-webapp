'use client';

import React, {
	Context,
	createContext,
	FC,
	useCallback,
	useContext,
	useEffect,
	useLayoutEffect,
	useReducer
} from 'react';
import {ConversationType, IConversation, IConversationModel} from '@/interfaces/IConversation';
import axios from 'axios';
import {ROUTES} from '@/config/api-config';
import {IAdCreative} from '@/interfaces/IAdCreative';
import {ChatGPTMessageObj, IAdVariant} from '@/interfaces/IArtiBot';
import {useSession} from 'next-auth/react';
import Cookies from 'js-cookie';

interface IConversationData {

}

export type ConversationData = IConversationData | null | false;

// An enum with all the types of actions to use in our reducer
enum CONVERSATION_ACTION_TYPE {
	LOADING = 'LOADING',
	LOADED = 'LOADED',
	ADD_ADCREATIVES = 'ADD_ADCREATIVES',
	UPDATING_VARIANT_IMAGE = 'UPDATING_VARIANT_IMAGE',
	UPDATE_VARIANT_IMAGE = 'UPDATE_VARIANT_IMAGE',
	UPDATE_VARIANT_IMAGE_SUCCESS = 'UPDATE_VARIANT_IMAGE_SUCCESS',
	UPDATE_VARIANT_IMAGE_FAILURE = 'UPDATE_VARIANT_IMAGE_FAILURE',
	GET_ADCREATIVES = 'GET_ADCREATIVES',
	GET_ADCREATIVES_SUCCESS = 'GET_ADCREATIVES_SUCCESS',
	GET_ADCREATIVES_FAILURE = 'GET_ADCREATIVES_FAILURE',
	GET_CONVERSATIONS = 'GET_CONVERSATIONS',
	GET_CONVERSATIONS_SUCCESS = 'GET_CONVERSATIONS_SUCCESS',
	GET_CONVERSATIONS_FAILURE = 'GET_CONVERSATIONS_FAILURE',
	GET_CONVERSATION = 'GET_CONVERSATION_SUCCESS',
	GET_CONVERSATION_SUCCESS = 'GET_CONVERSATION_SUCCESS',
	GET_CONVERSATION_FAILURE = 'GET_CONVERSATION_FAILURE',
	CREATE_CONVERSATION = 'CREATE_CONVERSATION',
	CREATE_CONVERSATION_SUCCESS = 'CREATE_CONVERSATION_SUCCESS',
	CREATE_CONVERSATION_FAILURE = 'CREATE_CONVERSATION_FAILURE',
	ADD_TO_MESSAGE_BUFFER = 'ADD_TO_MESSAGE_BUFFER',
	FLUSH_MESSAGE_BUFFER = 'FLUSH_MESSAGE_BUFFER',
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

interface IConversationState {
	conversation: StateRecord<IConversation>;
	adCreative: StateRecord<IAdCreative>;
	variant: StateRecord<IAdVariant>;
	conversations?: IConversation[];
	adCreatives?: IAdCreative[];
	conversationMap?: Record<IConversation['id'], IConversation>;
	variantMap?: Record<IAdVariant['id'], IAdVariant>;
	adCreativeMap?: Record<IAdCreative['id'], IAdCreative>;
	loading?: boolean;
	messageBuffer?: ChatGPTMessageObj[];
	inProcess?: any;
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
const extractFromAdCreative = (adCreative: IAdCreative): Pick<StateRecordEnum, 'variant'> => {
	return adCreative.variants?.reduce((acc: {
		variant: StateRecord<IAdVariant>,
	}, variant: IAdVariant) => {
		acc.variant = addKeyToStateRecord(acc.variant, variant);
		// acc.variant.map = addKeyToStateRecord(acc.variant.map, variant);
		return acc;
	}, {variant: {map: {}, list: []}});
}

export const initConversationState = {
	conversation: {map: {}, list: []},
	adCreative: {map: {}, list: []},
	variant: {map: {}, list: []},
	conversations: [],
	adCreatives: [],
	conversationMap: {},
	variantMap: {},
	adCreativeMap: {},
	loading: false,
	messageBuffer: [],
	inProcess: false
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
			console.log('state.variantMap - ', state.variantMap);
			// if(!_variantMap[payload.variantId]) {
			// 	_variantMap[payload.variantId] = {};
			// }
			// if(_variantMap[payload.variantId]) _variantMap[payload.variantId].imageUrl = payload.imageUrl;
			return {
				...state,
				loading: false,
				variant: mergeStateRecord(state.variant, variant12),
				inProcess: {
					...(state.inProcess ?? {}),
					[payload.variantId]: false
				}
			};
		case CONVERSATION_ACTION_TYPE.UPDATING_VARIANT_IMAGE:
			return {
				...state,
				inProcess: {
					...(state.inProcess ?? {}),
					[payload.variantId]: true
				}
			};
		case CONVERSATION_ACTION_TYPE.GET_ADCREATIVES:
			return {
				...state,
				loading: true,
			};
		case CONVERSATION_ACTION_TYPE.ADD_ADCREATIVES:
			// Prepare the variantMap and adCreativeMap
			const _initial12 =  {variant: {map: {}, list: []}, adCreative: {map: {}, list: []}};
			const maps3 = payload.adCreatives?.reduce((acc: Omit<StateRecordEnum, 'conversation'>, adCreative: IAdCreative) => {
				acc.adCreative = addKeyToStateRecord(acc?.adCreative, adCreative);
				const {variant} = extractFromAdCreative(adCreative);
				acc.variant = {...acc.variant, ...variant};
				return acc;
			}, _initial12) ?? _initial12;

			return {
				...state,
				loading: false,
				adCreative: mergeStateRecord(state.adCreative, maps3.adCreative),
				variant: mergeStateRecord(state.variant, maps3.variant),
			};
		case CONVERSATION_ACTION_TYPE.GET_ADCREATIVES_SUCCESS:
			// Prepare the variantMap and adCreativeMap
			const maps2 = payload.adCreatives.reduce((acc: {variantMap: IConversationState['variantMap'], adCreativeMap: IConversationState['adCreativeMap']}, adCreative: IAdCreative) => {
				addKeyToMap(acc?.adCreativeMap, adCreative);
				const {variantMap} = extractFromAdCreative(adCreative);
				acc.variantMap = {...acc.variantMap, ...variantMap};
				return acc;
			}, {variantMap: {}, adCreativeMap: {}});
			return {
				...state,
				loading: false,
				adCreatives: payload.adCreatives ?? state.adCreatives,
				adCreativeMap: {...(state.adCreativeMap ?? {}), ...maps2.adCreativeMap},
				variantMap: {...(state.variantMap ?? {}), ...maps2.variantMap}
			};
		case CONVERSATION_ACTION_TYPE.GET_CONVERSATIONS_SUCCESS:
			const maps = payload.conversations.reduce((acc: StateRecordEnum, conversation: IConversation) => {
				acc.conversation = addKeyToStateRecord(acc?.conversation, conversation);
				const {variant, adCreative} = extractFromConversation(conversation);
				acc.variant = {...acc.variant, ...variant};
				acc.adCreative = {...acc.adCreative, ...adCreative};
				return acc;
			}, {variant: {}, adCreative: {}, conversation: {}});

			console.log('maps - ', maps);

			return {
				...state,
				loading: false,
				conversations: payload.conversations ?? state.conversations,
				conversation: mergeStateRecord(state.conversation, maps.conversation),
				adCreative: mergeStateRecord(state.adCreative, maps.adCreative),
				variant: mergeStateRecord(state.variant, maps.variant),
			};
		case CONVERSATION_ACTION_TYPE.GET_CONVERSATION_SUCCESS:
			if(!payload.conversation) {
				return {
					...state,
					loading: false
				}
			}
			const conversation1 = addKeyToStateRecord(state.conversation, payload.conversation);
			const _initial1 = {variant: {map: {}, list: []}, adCreative: {map: {}, list: []}};
			const _maps13 = payload.conversation.adCreatives?.reduce((acc: Omit<StateRecordEnum, 'conversation'>, adCreative: IAdCreative) => {
				acc.adCreative = addKeyToStateRecord(acc?.adCreative, adCreative);
				const {variant} = extractFromAdCreative(adCreative);
				acc.variant = {...acc.variant, ...variant};
				return acc;
			}, _initial1) ?? _initial1;
			return {
				...state,
				loading: false,
				conversation: mergeStateRecord(state.conversation, conversation1),
				adCreative: mergeStateRecord(state.adCreative, _maps13.adCreative),
				variant: mergeStateRecord(state.variant, _maps13.variant),
			};
		case CONVERSATION_ACTION_TYPE.CREATE_CONVERSATION_SUCCESS:
			const conversation = addKeyToStateRecord(state.conversation, payload.conversation);
			const _initial = {variant: {map: {}, list: []}, adCreative: {map: {}, list: []}};
			const _maps12 = payload.conversation.adCreatives?.reduce((acc: Omit<StateRecordEnum, 'conversation'>, adCreative: IAdCreative) => {
				acc.adCreative = addKeyToStateRecord(acc?.adCreative, adCreative);
				const {variant} = extractFromAdCreative(adCreative);
				acc.variant = {...acc.variant, ...variant};
				return acc;
			}, _initial) ?? _initial;
			return {
				...state,
				loading: false,
				conversation: mergeStateRecord(state.conversation, conversation),
				adCreative: mergeStateRecord(state.adCreative, _maps12.adCreative),
				variant: mergeStateRecord(state.variant, _maps12.variant),
				// adCreativeMap: maps.adCreativeMap,
				// variantMap: maps.variantMap
			};
		case CONVERSATION_ACTION_TYPE.LOADING:
			return {
				...state,
				loading: true
			};
		case CONVERSATION_ACTION_TYPE.LOADED:
			return {
				...state,
				loading: false
			};
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
		console.log('session?.data?.user?.token?.accessToken - ', session?.data?.user?.token?.accessToken);
		if(session?.data?.user?.token?.accessToken) {
			localStorage.setItem('token', session?.data?.user?.token?.accessToken);
		} else {
			localStorage.removeItem('token');
		}
	}, [session])

	// const increment = useCallback(() => {
	// 	dispatch({type: REDUCER_ACTION_TYPE.INCREMENT});
	// }, []);

	return {state, dispatch};
}

type UseConversationContextType = ReturnType<typeof useConversationContext>;

export const ConversationContext = createContext<UseConversationContextType>({state: initConversationState, dispatch: (action: ConversationAction) => {}});

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
		}
	} catch (error: any) {
		dispatch({type: CONVERSATION_ACTION_TYPE.UPDATE_VARIANT_IMAGE_FAILURE, payload: {error: error.message}});
	}

}

async function getConversations(dispatch: (a: ConversationAction) => void) {
	dispatch({
		type: CONVERSATION_ACTION_TYPE.GET_CONVERSATIONS,
		payload: {}
	});

	try {
		const response = await axios.get(ROUTES.CONVERSATION.QUERY(), {
			headers: {
				'Authorization': 'Bearer ' + localStorage.getItem('token')
			}
		});
		if(response.data.ok) {
			dispatch({type: CONVERSATION_ACTION_TYPE.GET_CONVERSATIONS_SUCCESS, payload: {conversations: response.data.data}});
		}
	} catch (error: any) {
		dispatch({type: CONVERSATION_ACTION_TYPE.GET_CONVERSATIONS_FAILURE, payload: {error: error.message}});
	}

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
		type: CONVERSATION_ACTION_TYPE.LOADING,
		payload: {}
	});

	try {
		const response = await axios.get(ROUTES.CONVERSATION.GET(conversationId), {
			headers: {
				'Authorization': 'Bearer ' + localStorage.getItem('token')
			}
		});
		if(response.data.ok) {
			dispatch({type: CONVERSATION_ACTION_TYPE.GET_CONVERSATION_SUCCESS, payload: {conversation: response.data.data}});
		}
	} catch (error: any) {
		dispatch({type: CONVERSATION_ACTION_TYPE.GET_CONVERSATION_FAILURE, payload: {error: error.message}});
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

function saveMessages(dispatch: (a: ConversationAction) => void, messages: ChatGPTMessageObj[], conversationId: string, conversationType: ConversationType) {
	axios.post(ROUTES.MESSAGE.SAVE, {
		messages,
		conversationId,
		conversationType
	}, {
		headers: {
			'Authorization': 'Bearer ' + localStorage.getItem('token')
		}
	})
}

async function saveAdCreativeMessage(dispatch: (a: ConversationAction) => void, messages: ChatGPTMessageObj[], jsonObjectInString: string, conversationId: string, conversationType: ConversationType, onDemand: boolean) {
	try {
		const response = await axios.post(ROUTES.MESSAGE.SAVE_AD_CREATIVE, {
			messages,
			json: jsonObjectInString,
			conversationId,
			onDemand,
		}, {
			headers: {
				'Authorization': 'Bearer ' + localStorage.getItem('token')
			}
		});

		const result = response.data.data;

		dispatch({
			type: CONVERSATION_ACTION_TYPE.ADD_ADCREATIVES,
			payload: {
				adCreatives: result?.adCreatives ?? []
			}
		});

	} catch(e) {
		console.log('e - ', e);
	}
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
	saveMessages,
	saveAdCreativeMessage,
	ConversationContextProvider
};
