"use client";

import React, {
  createContext,
  FC,
  useCallback,
  useContext,
  useLayoutEffect,
  useReducer,
} from "react";
import {
  ConversationType,
  IAdMongoDB,
  IAdsetMongoDB,
  ICampaignMongoDB,
  IConversation,
} from "@/interfaces/IConversation";
import axios, { AxiosError } from "axios";
import { ROUTES } from "@/config/api-config";
import {
  Feedback,
  FeedBackKeyProperty,
  IAdCreative,
  IAdCreativeNew,
} from "@/interfaces/IAdCreative";
import {
  ChatGPTMessageObj,
  FeedBackKey,
  IAdVariant,
} from "@/interfaces/IArtiBot";
import { useSession } from "next-auth/react";
import ObjectId from "bson-objectid";
import { InfiniteConversation } from "@/api/conversation";
import { QueryClient } from "@tanstack/react-query";
import API_QUERIES from "@/config/api-queries";

interface IConversationData {}

export type ConversationData = IConversationData | null | false;

// An enum with all the types of actions to use in our reducer
enum CONVERSATION_ACTION_TYPE {
  LOADING = "LOADING",
  LOADED = "LOADED",
  CLEAR_ERROR = "CLEAR_ERROR",
  ADD_ADCREATIVES = "ADD_ADCREATIVES",
  REMOVE_ADCREATIVES = "REMOVE_ADCREATIVES",
  UPDATING_VARIANT_IMAGE = "UPDATING_VARIANT_IMAGE",
  UPDATE_VARIANT_IMAGE = "UPDATE_VARIANT_IMAGE",
  ERROR_IN_UPDATING_VARIANT_IMAGE = "ERROR_IN_UPDATING_VARIANT_IMAGE",
  UPDATE_VARIANT_IMAGE_SUCCESS = "UPDATE_VARIANT_IMAGE_SUCCESS",
  GEN_AD_CREATIVE_IMAGES = "GEN_AD_CREATIVE_IMAGES",
  GEN_AD_CREATIVE_IMAGES_SUCCESS = "GEN_AD_CREATIVE_IMAGES_SUCCESS",
  ERROR_IN_GENERATING_CREATIVE_IMAGES = "ERROR_IN_GENERATING_CREATIVE_IMAGES",
  UPDATE_VARIANT_IMAGE_FAILURE = "UPDATE_VARIANT_IMAGE_FAILURE",
  GET_ADCREATIVES = "GET_ADCREATIVES",
  GET_ADCREATIVES_SUCCESS = "GET_ADCREATIVES_SUCCESS",
  GET_ADCREATIVES_FAILURE = "GET_ADCREATIVES_FAILURE",
  GET_CONVERSATIONS = "GET_CONVERSATIONS",
  GET_CONVERSATIONS_SUCCESS = "GET_CONVERSATIONS_SUCCESS",
  GET_VARIANTS_SUCCESS = "GET_VARIANTS_SUCCESS",
  GET_CONVERSATIONS_FAILURE = "GET_CONVERSATIONS_FAILURE",
  GET_CONVERSATION = "GET_CONVERSATION",
  GET_CONVERSATION_SUCCESS = "GET_CONVERSATION_SUCCESS",
  GET_CONVERSATION_FAILURE = "GET_CONVERSATION_FAILURE",
  CREATE_CONVERSATION = "CREATE_CONVERSATION",
  CREATE_CONVERSATION_SUCCESS = "CREATE_CONVERSATION_SUCCESS",
  CREATE_CONVERSATION_FAILURE = "CREATE_CONVERSATION_FAILURE",
  ADD_TO_MESSAGE_BUFFER = "ADD_TO_MESSAGE_BUFFER",
  FLUSH_MESSAGE_BUFFER = "FLUSH_MESSAGE_BUFFER",
  SHOW_ERROR_MESSAGE = "SHOW_ERROR_MESSAGE",
  HANDLE_FEEDBACK_KEY = "HANDLE_FEEDBACK_KEY",
  UPDATE_VARIANT = "UPDATE_VARIANT",
}

// An interface for our actions
interface ConversationAction {
  type: CONVERSATION_ACTION_TYPE;
  payload: any;
}

// interface StateRecord<T extends { id: string }> {
//   map: Record<T["id"], T>;
//   list: T[];
// }

class StateRecord<T extends { id: string }, R extends (keyof T)[] = ["id"]> {
  readonly map: Record<T["id"], T>;
  readonly list: T[];

  constructor(map: Record<T["id"], T>, list: T[]) {
    this.map = map;
    this.list = list;
  }

  isEmpty() {
    return this.list.length === 0 && Object.keys(this.map).length === 0;
  }

  get(id: T["id"]): undefined | T {
    return this.map[id];
  }

  /**
   * @deprecated
   * @description Use findOneBy instead
   * */
  getBy(id: R[number], value: T[R[number]]) {
    return this.list.find((item) => item[id] === value);
  }

  findOneBy(id: R[number], value: T[R[number]]) {
    return this.list.find((item) => item[id] === value);
  }

  findAllBy(id: R[number], value: T[R[number]]) {
    return this.list.filter((item) => item[id] === value);
  }

  merge(record: StateRecord<T>): StateRecord<T> {
    const list = this.list.filter(
      (i) => !record.list.find((j) => j.id === i.id)
    );
    const obj = {
      map: {
        ...(this.map ?? {}),
        ...(record.map ?? {}),
      },
      list: [...list, ...(record.list ?? [])],
    };
    return new StateRecord<T>(obj.map, obj.list);
  }

  static getEmpty<T extends { id: string }>() {
    return new StateRecord<T>({} as Record<T["id"], T>, [] as T[]);
  }
}

interface IError {
  message: string;
}

interface IConversationState {
  conversation: StateRecord<IConversation, ["id"]>;
  adCreative: StateRecord<IAdCreative>;
  variant: StateRecord<IAdVariant, ["id"]>;
  campaign: StateRecord<ICampaignMongoDB>;
  adset: StateRecord<IAdsetMongoDB, ["id", "adCreativeId"]>;
  ad: StateRecord<IAdMongoDB, ["id", "adsetId"]>;
  conversations?: IConversation[];
  adCreatives?: IAdCreative[];
  conversationMap?: Record<IConversation["id"], IConversation>;
  variantMap?: Record<IAdVariant["id"], IAdVariant>;
  adCreativeMap?: Record<IAdCreative["id"], IAdCreative>;
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
  campaign: StateRecord<ICampaignMongoDB>;
  adset: StateRecord<IAdsetMongoDB>;
  ad: StateRecord<IAdMongoDB>;
}

// Create a utility function to extract the adCreativeMap, variantMap from a conversation
const extractFromConversation = (
  conversation: IConversation
): Omit<StateRecordEnum, "conversation"> => {
  const adCreativeInitializer = {
    variant: StateRecord.getEmpty<IAdVariant>(),
    adCreative: StateRecord.getEmpty<IAdCreative>(),
  };

  const campaignInitializer = {
    campaign: StateRecord.getEmpty<ICampaignMongoDB>(),
    adset: StateRecord.getEmpty<IAdsetMongoDB>(),
    ad: StateRecord.getEmpty<IAdMongoDB>(),
  };

  const { campaign, adset, ad } =
    conversation.adCampaigns?.reduce(
      (
        acc: {
          campaign: StateRecord<ICampaignMongoDB>;
          adset: StateRecord<IAdsetMongoDB>;
          ad: StateRecord<IAdMongoDB>;
        },
        adCampaign: ICampaignMongoDB
      ) => {
        adCampaign.adsets?.forEach((adset: IAdsetMongoDB) => {
          acc.adset = addKeyToStateRecord(acc.adset, adset);
          adset.ads?.forEach((ad: IAdMongoDB) => {
            acc.ad = addKeyToStateRecord(acc.ad, ad);
          });
        });

        acc.campaign = addKeyToStateRecord(acc.campaign, adCampaign);
        return acc;
      },
      campaignInitializer
    ) ?? campaignInitializer;

  const { variant, adCreative } =
    conversation.adCreatives?.reduce(
      (
        acc: {
          variant: StateRecord<IAdVariant>;
          adCreative: StateRecord<IAdCreative>;
        },
        adCreative: IAdCreative
      ) => {
        adCreative.variants?.forEach((variant: IAdVariant) => {
          acc.variant = addKeyToStateRecord(acc.variant, variant);
        });
        acc.adCreative = addKeyToStateRecord(acc.adCreative, adCreative);
        return acc;
      },
      adCreativeInitializer
    ) ?? adCreativeInitializer;

  return { variant, adCreative, campaign, adset, ad };
};

// Create a utility function to extract the variantMap from an adCreative
const extractFromAdCreative = (
  adCreative: IAdCreative,
  initVariant: StateRecord<IAdVariant>
): Pick<StateRecordEnum, "variant"> => {
  return adCreative.variants?.reduce(
    (
      acc: {
        variant: StateRecord<IAdVariant>;
      },
      variant: IAdVariant
    ) => {
      acc.variant = addKeyToStateRecord(acc.variant, variant);
      // acc.variant.map = addKeyToStateRecord(acc.variant.map, variant);
      return acc;
    },
    { variant: initVariant }
  );
};

interface LoadingState {
  conversation?: boolean;
  adCreative?: boolean;
  variant?: boolean;
  conversations?: boolean;
  adCreatives?: boolean;
  variants?: boolean;
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

type GenerateAdCreativeImageApiResponseRes =
  | GenerateAdCreativeImageApiSuccess
  | GenerateAdCreativeImageApiError;

type GenerateAdCreativeImageApiResponse = {
  ok: boolean;
  message: string;
  data: {
    response: GenerateAdCreativeImageApiResponseRes[];
  };
};

export const initConversationState: IConversationState = {
  conversation: StateRecord.getEmpty<IConversation>(),
  adCreative: StateRecord.getEmpty<IAdCreative>(),
  variant: StateRecord.getEmpty<IAdVariant>(),
  campaign: StateRecord.getEmpty<ICampaignMongoDB>(),
  adset: StateRecord.getEmpty<IAdsetMongoDB>(),
  ad: StateRecord.getEmpty<IAdMongoDB>(),
  conversations: [],
  adCreatives: [],
  conversationMap: {},
  variantMap: {},
  adCreativeMap: {},
  loading: {
    conversations: true,
    conversation: true,
    adCreatives: true,
  },
  messageBuffer: [],
  inProcess: {},
  inError: {},
};

/**
 * @deprecated
 * @param map
 * @param item
 */
function addKeyToMap<T extends { id: string }>(
  map: Record<T["id"], T> | undefined,
  item: T
) {
  return {
    ...(map ?? {}),
    [item.id]: item,
  };
}

/**
 *
 * @param record
 * @param item
 */
function removeKeyFromStateRecord<T extends { id: string }>(
  record: StateRecord<T>,
  item: T
): StateRecord<T> {
  const list = record.list?.filter((i) => i.id !== item.id) ?? [];
  const map = { ...record.map };
  delete map[item.id as T["id"]];
  return new StateRecord(map, list);
}

/**
 * Add a key to the state record
 * @param record
 * @param item
 */
function addKeyToStateRecord<T extends { id: string }>(
  record: StateRecord<T>,
  item: T
): StateRecord<T> {
  const list = record.list?.filter((i) => i.id !== item.id) ?? [];
  const res = {
    map: {
      ...(record.map ?? {}),
      [item.id]: item,
    },
    list: [...list, item],
  };

  return new StateRecord<T>(res.map, res.list);
}

function updateLoadingState(
  state: IConversationState,
  loadingState: IConversationState["loading"]
): IConversationState["loading"] {
  return {
    ...(state.loading ?? {}),
    ...loadingState,
  };
}

/**
 * Merge new record into the state record
 * @param state
 * @param record
 */
function mergeStateRecord<T extends { id: string }>(
  state: StateRecord<T>,
  record: StateRecord<T>
): StateRecord<T> {
  const list =
    state.list?.filter((i) => !record.list?.find((j) => j.id === i.id)) ?? [];
  const obj = {
    map: {
      ...(state.map ?? {}),
      ...(record.map ?? {}),
    },
    list: [...list, ...(record.list ?? [])],
  };
  return new StateRecord(obj.map, obj.list);
}

function conversationReducer(
  state: IConversationState,
  action: ConversationAction
): IConversationState {
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
        loading: updateLoadingState(state, { variant: false }),
        variant: mergeStateRecord(state.variant, variant12),
        inProcess: {
          ...(state.inProcess ?? {}),
          [payload.variantId]: false,
        },
      };
    case CONVERSATION_ACTION_TYPE.UPDATE_VARIANT:
      const variant11 = addKeyToStateRecord(state.variant, payload);
      return {
        ...state,
        variant: mergeStateRecord(state.variant, variant11),
      };
    case CONVERSATION_ACTION_TYPE.GEN_AD_CREATIVE_IMAGES:
      let { conversationId: adCreativeId1 } = payload;
      const variantList =
        state.adCreative.list.find(
          (adCreative) => adCreative.id === adCreativeId1
        )?.variants ?? [];
      const init = { inProcess: { ...(state.inProcess ?? {}) } };
      const map1 = variantList.reduce(
        (acc: typeof init, variant: IAdVariant) => {
          if (variant.imageUrl) {
            acc.inProcess[variant.id] = false;
            return acc;
          }
          acc.inProcess[variant.id] = true;
          return acc;
        },
        init
      );

      return {
        ...state,
        loading: updateLoadingState(state, { variant: false }),
        inProcess: {
          ...map1.inProcess,
          [adCreativeId1]: true,
        },
      };
    case CONVERSATION_ACTION_TYPE.GEN_AD_CREATIVE_IMAGES_SUCCESS:
      const { conversationId, response } = payload;
      // const adCreative = state.adCreative.map[adCreativeId];
      let adVariant = state.variant;
      response.map((res: GenerateAdCreativeImageApiResponseRes) => {
        if (res.ok) {
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
          [conversationId]: false,
        },
        inError: {
          ...(state.inError ?? {}),
        },
        variant: mergeStateRecord(state.variant, adVariant),
      };
    case CONVERSATION_ACTION_TYPE.UPDATING_VARIANT_IMAGE:
      return {
        ...state,
        inProcess: {
          ...(state.inProcess ?? {}),
          [payload.variantId]: true,
        },
      };
    case CONVERSATION_ACTION_TYPE.ERROR_IN_UPDATING_VARIANT_IMAGE:
      return {
        ...state,
        inProcess: {
          ...(state.inProcess ?? {}),
          [payload.variantId]: false,
        },
        inError: {
          ...(state.inError ?? {}),
          [payload.variantId]: true,
        },
      };
    case CONVERSATION_ACTION_TYPE.ERROR_IN_GENERATING_CREATIVE_IMAGES:
      return {
        ...state,
        inError: {
          [payload.adCreativeId]: {
            message: payload.message,
          },
        },
      };
    case CONVERSATION_ACTION_TYPE.GET_ADCREATIVES:
      return {
        ...state,
        loading: updateLoadingState(state, { adCreatives: true }),
      };
    case CONVERSATION_ACTION_TYPE.ADD_ADCREATIVES:
      // Prepare the variantMap and adCreativeMap
      const _initial12 = {
        variant: { map: {}, list: [] },
        adCreative: { map: {}, list: [] },
      };
      const maps3 =
        payload.adCreatives?.reduce(
          (
            acc: Omit<StateRecordEnum, "conversation">,
            adCreative: IAdCreative
          ) => {
            acc.adCreative = addKeyToStateRecord(acc?.adCreative, adCreative);
            const { variant } = extractFromAdCreative(adCreative, acc.variant);
            acc.variant = variant;
            return acc;
          },
          _initial12
        ) ?? _initial12;

      return {
        ...state,
        loading: updateLoadingState(state, { adCreatives: false }),
        adCreative: mergeStateRecord(state.adCreative, maps3.adCreative),
        variant: mergeStateRecord(state.variant, maps3.variant),
      };
    case CONVERSATION_ACTION_TYPE.REMOVE_ADCREATIVES:
      const _adCreatives = payload.adCreatives as IAdCreative[];
      _adCreatives.forEach((adCreative) => {
        state.adCreative = removeKeyFromStateRecord(
          state.adCreative,
          adCreative
        );
        adCreative.variants?.forEach((variant: IAdVariant) => {
          state.variant = removeKeyFromStateRecord(state.variant, variant);
        });
      });
      return {
        ...state,
      };
    case CONVERSATION_ACTION_TYPE.HANDLE_FEEDBACK_KEY:
      // const _adCreatives = payload.adCreatives as IAdCreative[];
      // _adCreatives.forEach(adCreative => {
      // 	state.adCreative = removeKeyFromStateRecord(state.adCreative, adCreative);
      // 	adCreative.variants?.forEach(variant => {
      // 		state.variant = removeKeyFromStateRecord(state.variant, variant);
      // 	})
      // })
      const { variantId, feedbackKey, feedback } = payload as {
        variantId: IAdVariant["id"];
        feedbackKey: FeedBackKeyProperty;
        feedback: Feedback;
      };
      const variant = state.variant.map[variantId];
      // if(!variant.feedback) variant.feedback = {};
      // variant.feedback[feedbackKey] = feedback;

      const variantsFeedbackLocal =
        window.localStorage.getItem("variantsFeedback");
      let obj: Record<string, string> = {};
      try {
        obj = JSON.parse(variantsFeedbackLocal ?? "{}");
      } catch (e) {
        obj = {};
      }

      variant.feedback = {
        // @ts-ignore
        ...(obj[variantId] ?? {}),
        [feedbackKey]: feedback,
      };

      window.localStorage.setItem(
        "variantsFeedback",
        JSON.stringify({ ...obj, [variantId]: variant.feedback })
      );

      state.variant = addKeyToStateRecord(state.variant, variant);
      return {
        ...state,
      };
    case CONVERSATION_ACTION_TYPE.GET_ADCREATIVES_SUCCESS:
      // Prepare the variantMap and adCreativeMap
      const maps2 = payload.adCreatives.reduce(
        (
          acc: Omit<StateRecordEnum, "conversation">,
          adCreative: IAdCreative
        ) => {
          acc.adCreative = addKeyToStateRecord(acc?.adCreative, adCreative);
          const { variant } = extractFromAdCreative(adCreative, acc.variant);
          acc.variant = variant;
          return acc;
        },
        { variant: { ...state.variant }, adCreative: { ...state.adCreative } }
      );
      return {
        ...state,
        loading: updateLoadingState(state, { adCreatives: false }),
        adCreatives: payload.adCreatives ?? state.adCreatives,
        adCreativeMap: {
          ...(state.adCreativeMap ?? {}),
          ...maps2.adCreativeMap,
        },
        variantMap: { ...(state.variantMap ?? {}), ...maps2.variantMap },
        adCreative: mergeStateRecord(state.adCreative, maps2.adCreative),
        variant: mergeStateRecord(state.variant, maps2.variant),
      };
    case CONVERSATION_ACTION_TYPE.GET_CONVERSATIONS:
      return {
        ...state,
        loading: updateLoadingState(state, { conversations: true }),
      };
    case CONVERSATION_ACTION_TYPE.GET_CONVERSATIONS_SUCCESS:
      const initializer1 = {
        variant: state.variant,
        adCreative: state.adCreative,
        campaign: state.campaign,
        adset: state.adset,
        ad: state.ad,
        conversation: state.conversation,
      };
      const maps = payload.conversations.reduce(
        (acc: typeof initializer1, conversation: IConversation) => {
          acc.conversation = addKeyToStateRecord(
            acc?.conversation,
            conversation
          );
          const { variant, adCreative, campaign, adset, ad } =
            extractFromConversation(conversation);
          acc.variant = acc.variant.merge(variant);
          acc.adCreative = acc.adCreative.merge(adCreative);
          acc.campaign = acc.campaign.merge(campaign);
          acc.adset = acc.adset.merge(adset);
          acc.ad = acc.ad.merge(ad);
          return acc;
        },
        initializer1
      );

      return {
        ...state,
        loading: updateLoadingState(state, { conversations: false }),
        conversations: payload.conversations ?? state.conversations,
        conversation: mergeStateRecord(state.conversation, maps.conversation),
        adCreative: mergeStateRecord(state.adCreative, maps.adCreative),
        variant: mergeStateRecord(state.variant, maps.variant),
        campaign: mergeStateRecord(state.campaign, maps.campaign),
        adset: mergeStateRecord(state.adset, maps.adset),
        ad: mergeStateRecord(state.ad, maps.ad),
      };
    case CONVERSATION_ACTION_TYPE.GET_VARIANTS_SUCCESS:
      const variantRecord = payload.variants.reduce(
        (acc: { variant: StateRecord<IAdVariant> }, cur: IAdVariant) => {
          acc.variant = addKeyToStateRecord(acc.variant, cur);
          return acc;
        },
        {
          variant: state.variant,
        }
      );
      return {
        ...state,
        loading: updateLoadingState(state, { variant: false }),
        variant: mergeStateRecord(state.variant, variantRecord.variant),
      };
    case CONVERSATION_ACTION_TYPE.SHOW_ERROR_MESSAGE:
      return {
        ...state,
        error: {
          message: action.payload.message,
        },
      };
    case CONVERSATION_ACTION_TYPE.CLEAR_ERROR:
      return {
        ...state,
        error: undefined,
      };
    case CONVERSATION_ACTION_TYPE.GET_CONVERSATION:
      return {
        ...state,
        loading: updateLoadingState(state, { conversation: true }),
      };
    case CONVERSATION_ACTION_TYPE.GET_CONVERSATION_SUCCESS:
      if (!payload.conversation) {
        return {
          ...state,
          loading: updateLoadingState(state, { conversation: false }),
        };
      }

      const conversation1 = addKeyToStateRecord(
        state.conversation,
        payload.conversation
      );
      const data = extractFromConversation(payload.conversation);
      return {
        ...state,
        loading: updateLoadingState(state, { conversation: false }),
        conversation: mergeStateRecord(state.conversation, conversation1),
        adCreative: mergeStateRecord(state.adCreative, data.adCreative),
        variant: mergeStateRecord(state.variant, data.variant),
        campaign: mergeStateRecord(state.campaign, data.campaign),
        adset: mergeStateRecord(state.adset, data.adset),
        ad: mergeStateRecord(state.ad, data.ad),
      };
    case CONVERSATION_ACTION_TYPE.CREATE_CONVERSATION_SUCCESS:
      const conversation = addKeyToStateRecord(
        state.conversation,
        payload.conversation
      );
      const _initial = {
        variant: { map: {}, list: [] },
        adCreative: { map: {}, list: [] },
      };
      const _maps12 =
        payload.conversation.adCreatives?.reduce(
          (
            acc: Omit<StateRecordEnum, "conversation">,
            adCreative: IAdCreative
          ) => {
            acc.adCreative = addKeyToStateRecord(acc?.adCreative, adCreative);
            const { variant } = extractFromAdCreative(adCreative, acc.variant);
            acc.variant = acc.variant.merge(variant);
            return acc;
          },
          _initial
        ) ?? _initial;
      return {
        ...state,
        loading: updateLoadingState(state, { conversation: false }),
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
        messageBuffer,
      };
    case CONVERSATION_ACTION_TYPE.FLUSH_MESSAGE_BUFFER:
      return {
        ...state,
        messageBuffer: [],
      };
    default:
      return state;
  }
}

const useConversationContext = (initState: IConversationState) => {
  const [state, dispatch] = useReducer(conversationReducer, initState);
  const session = useSession({ required: false });

  useLayoutEffect(() => {
    if (session?.data?.user?.token?.accessToken) {
      localStorage.setItem("token", session?.data?.user?.token?.accessToken);
    } else {
      localStorage.removeItem("token");
    }
  }, [session]);

  const getVariantsByAdCreativeId = useCallback(
    (adCreativeId: string) => {
      const conversationId = state.adCreative.map[adCreativeId]?.conversationId;
      if (!conversationId) return null;
      const adCreativeIds = state.adCreative.list
        .filter((adCreative) => adCreative.conversationId === conversationId)
        .map((adCreative) => adCreative.id);
      const variantIds = state.adCreative.list
        .filter((adCreative) => adCreativeIds?.includes(adCreative.id))
        .map((adCreative) =>
          adCreative.variants?.map((variant: IAdVariant) => variant.id)
        )
        .flat();
      if (!variantIds) return null;
      return state.variant.list
        .filter((c) => variantIds.includes(c.id))
        .sort((a, b) => (a.id > b.id ? -1 : 1));
    },
    [state.adCreative.list, state.adCreative.map, state.variant.list]
  );

  const handleFeedBackKey = useCallback(
    (
      variantId: IAdVariant["id"],
      feedbackKey: FeedBackKeyProperty,
      feedback: Feedback
    ) => {
      dispatch({
        type: CONVERSATION_ACTION_TYPE.HANDLE_FEEDBACK_KEY,
        payload: {
          variantId,
          feedbackKey,
          feedback,
        },
      });
    },
    []
  );

  const updateVariant = useCallback((variant: IAdVariant) => {
    dispatch({
      type: CONVERSATION_ACTION_TYPE.UPDATE_VARIANT,
      payload: variant,
    });
  }, []);

  const pushConversationsToState = useCallback(
    (conversations: InfiniteConversation[]) => {
      dispatch({
        type: CONVERSATION_ACTION_TYPE.GET_CONVERSATIONS_SUCCESS,
        payload: { conversations },
      });
    },
    []
  );

  // const increment = useCallback(() => {
  // 	dispatch({type: REDUCER_ACTION_TYPE.INCREMENT});
  // }, []);

  const pushVariantsToState = useCallback((variants: IAdVariant[]) => {
    // dispatch({type: REDUCER_ACTION_TYPE.INCREMENT});
    dispatch({
      type: CONVERSATION_ACTION_TYPE.GET_VARIANTS_SUCCESS,
      payload: { variants },
    });
  }, []);

  const pustAdCreativesToState = useCallback(
    (adCreatives: IAdCreativeNew[]) => {
      // dispatch({type: REDUCER_ACTION_TYPE.INCREMENT});
      dispatch({
        type: CONVERSATION_ACTION_TYPE.GET_ADCREATIVES_SUCCESS,
        payload: { adCreatives },
      });
    },
    []
  );

  return {
    state,
    dispatch,
    updateVariant,
    getVariantsByAdCreativeId,
    handleFeedBackKey,
    pushConversationsToState,
    pushVariantsToState,
    pustAdCreativesToState,
  };
};

type UseConversationContextType = ReturnType<typeof useConversationContext>;

export const ConversationContext = createContext<UseConversationContextType>({
  handleFeedBackKey(
    variantId: IAdVariant["id"],
    feedbackKey: FeedBackKeyProperty,
    feedback: Feedback
  ): void {},
  updateVariant(variant: IAdVariant): void {},
  getVariantsByAdCreativeId(adCreativeId: string): null | any {
    return undefined;
  },
  state: initConversationState,
  dispatch: (action: ConversationAction) => {},
  pushConversationsToState(conversations: InfiniteConversation[]): void {},
  pushVariantsToState(variants: IAdVariant[]): void {},
  pustAdCreativesToState(adCreatives: IAdCreativeNew[]): void {},
});

const ConversationContextProvider: FC<
  { children: React.ReactElement } & IConversationState
> = ({ children, ...initState }) => {
  // const [ConversationData, setConversationData] = useState<ConversationData>(null);
  // const [state, dispatch] = useReducer(conversationReducer, {conversations: []})
  // NOTE: you *might* need to memoize this value
  // Learn more in http://kcd.im/optimize-context
  // const value = {state, dispatch}

  const context = useConversationContext(initState);

  return (
    <ConversationContext.Provider value={context}>
      {children}
    </ConversationContext.Provider>
  );
};

type UseConversationHookType = {
  state: IConversationState;
  dispatch: (action: ConversationAction) => void;
  updateVariant: (variant: IAdVariant) => void;
  getVariantsByAdCreativeId: (adCreativeId: string) => IAdVariant[] | null;
  handleFeedBackKey: (
    variantId: IAdVariant["id"],
    feedbackKey: FeedBackKeyProperty,
    feedback: Feedback
  ) => void;
  pushConversationsToState: (conversations: InfiniteConversation[]) => void;
  pushVariantsToState: (variants: IAdVariant[]) => void;
  pustAdCreativesToState: (adCreatives: IAdCreativeNew[]) => void;
};

function useConversation(): UseConversationHookType {
  const context = useContext(ConversationContext);
  if (context === undefined) {
    throw new Error(
      "useConversation must be used within a ConversationContextProvider"
    );
  }
  return context;
}

async function updateVariantImage(
  dispatch: (a: ConversationAction) => void,
  text: string,
  variantId: string
) {
  dispatch({
    type: CONVERSATION_ACTION_TYPE.UPDATING_VARIANT_IMAGE,
    payload: {
      variantId,
    },
  });

  try {
    // Update the variant
    // const updatedVariant =
    const response = await axios.patch(
      ROUTES.VARIANT.UPDATE_IMAGE(variantId),
      { text },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    if (response.data.ok) {
      dispatch({
        type: CONVERSATION_ACTION_TYPE.UPDATE_VARIANT_IMAGE_SUCCESS,
        payload: { variantId, variant: response.data.data },
      });
    } else {
      dispatch({
        type: CONVERSATION_ACTION_TYPE.ERROR_IN_UPDATING_VARIANT_IMAGE,
        payload: { variantId },
      });
    }
  } catch (error: any) {
    dispatch({
      type: CONVERSATION_ACTION_TYPE.ERROR_IN_UPDATING_VARIANT_IMAGE,
      payload: { variantId },
    });
  }
}

async function generateAdCreativeImages(
  dispatch: (a: ConversationAction) => void,
  adCreativeId: string,
  onError?: (err: Error) => void
) {
  const queryClient = new QueryClient();
  dispatch({
    type: CONVERSATION_ACTION_TYPE.GEN_AD_CREATIVE_IMAGES,
    payload: {
      adCreativeId,
    },
  });

  try {
    const response = await axios.patch<GenerateAdCreativeImageApiResponse>(
      ROUTES.CONVERSATION.GENERATE_IMAGES(adCreativeId),
      {},
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );

    queryClient.invalidateQueries({
      queryKey: API_QUERIES.GET_CREDIT_BALANCE,
    });

    if (response.data.ok) {
      dispatch({
        type: CONVERSATION_ACTION_TYPE.GEN_AD_CREATIVE_IMAGES_SUCCESS,
        payload: { adCreativeId, response: response.data.data.response },
      });
    } else {
      dispatch({
        type: CONVERSATION_ACTION_TYPE.ERROR_IN_GENERATING_CREATIVE_IMAGES,
        payload: { adCreativeId, message: response.data.message },
      });
    }
  } catch (error: any) {
    onError && onError(error);
    dispatch({
      type: CONVERSATION_ACTION_TYPE.ERROR_IN_GENERATING_CREATIVE_IMAGES,
      payload: { adCreativeId, message: error.message },
    });
  }
}

function withRetry(func: Function) {
  const retry = 1;

  let a = func();

  if (!a) {
    a = func();
  }

  return;
}

async function getConversations(
  dispatch: (a: ConversationAction) => void,
  maxRetries = 2
) {
  dispatch({
    type: CONVERSATION_ACTION_TYPE.GET_CONVERSATIONS,
    payload: {},
  });

  for (let retry = 0; retry < maxRetries; retry++) {
    try {
      const response = await axios.get(ROUTES.CONVERSATION.QUERY(), {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      if (response.data.ok) {
        return dispatch({
          type: CONVERSATION_ACTION_TYPE.GET_CONVERSATIONS_SUCCESS,
          payload: { conversations: response.data.data },
        });
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error: any) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  dispatch({
    type: CONVERSATION_ACTION_TYPE.SHOW_ERROR_MESSAGE,
    payload: {
      message: "Unable to fetch the conversations. Please try again!",
    },
  });
}

async function getAdCreatives(dispatch: (a: ConversationAction) => void) {
  dispatch({
    type: CONVERSATION_ACTION_TYPE.GET_ADCREATIVES,
    payload: {},
  });

  try {
    const response = await axios.get(ROUTES.ADCREATIVE.QUERY(), {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    if (response.data.ok) {
      dispatch({
        type: CONVERSATION_ACTION_TYPE.GET_ADCREATIVES_SUCCESS,
        payload: { adCreatives: response.data.data },
      });
    }
  } catch (error: any) {
    dispatch({
      type: CONVERSATION_ACTION_TYPE.GET_ADCREATIVES_FAILURE,
      payload: { error: error.message },
    });
  }
}

async function getConversation(
  dispatch: (a: ConversationAction) => void,
  conversationId: string
) {
  dispatch({
    type: CONVERSATION_ACTION_TYPE.GET_CONVERSATION,
    payload: {},
  });

  try {
    const response = await axios.get(ROUTES.CONVERSATION.GET(conversationId), {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    if (response.data.ok) {
      return dispatch({
        type: CONVERSATION_ACTION_TYPE.GET_CONVERSATION_SUCCESS,
        payload: { conversation: response.data.data },
      });
    }
    dispatch({
      type: CONVERSATION_ACTION_TYPE.SHOW_ERROR_MESSAGE,
      payload: {
        message: "Unable to fetch the conversation. Please try again!",
      },
    });
  } catch (error: any) {
    dispatch({
      type: CONVERSATION_ACTION_TYPE.SHOW_ERROR_MESSAGE,
      payload: {
        message: "Unable to fetch the conversation. Please try again!",
      },
    });
  }
}

function createConversation(
  dispatch: (a: ConversationAction) => void,
  body: any
) {
  dispatch({
    type: CONVERSATION_ACTION_TYPE.CREATE_CONVERSATION,
    payload: {},
  });

  try {
    // const response = await axios.post(ROUTES.CONVERSATION.CREATE(conversationId), body);
    // if(response.data.ok) {
    dispatch({
      type: CONVERSATION_ACTION_TYPE.CREATE_CONVERSATION_SUCCESS,
      payload: { conversation: body },
    });
    // }
  } catch (error: any) {
    dispatch({
      type: CONVERSATION_ACTION_TYPE.CREATE_CONVERSATION_FAILURE,
      payload: { error: error.message },
    });
  }
}

function addAdCreatives(
  dispatch: (a: ConversationAction) => void,
  body: IAdCreative[]
) {
  dispatch({
    type: CONVERSATION_ACTION_TYPE.ADD_ADCREATIVES,
    payload: {
      adCreatives: body ?? [],
    },
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

function addMessageToBuffer(
  dispatch: (a: ConversationAction) => void,
  body: ChatGPTMessageObj
) {
  dispatch({
    type: CONVERSATION_ACTION_TYPE.ADD_TO_MESSAGE_BUFFER,
    payload: body,
  });
}

function flushBufferMessage(dispatch: (a: ConversationAction) => void) {
  dispatch({
    type: CONVERSATION_ACTION_TYPE.FLUSH_MESSAGE_BUFFER,
    payload: null,
  });
}

async function saveMessages(
  dispatch: (a: ConversationAction) => void,
  messages: ChatGPTMessageObj[],
  conversationId: string,
  conversationType: ConversationType,
  projectName: string
) {
  try {
    const response = await axios.post(
      ROUTES.MESSAGE.SAVE,
      {
        messages,
        conversationId,
        conversationType,
        projectName,
      },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    if (!response?.data?.ok) {
      dispatch({
        type: CONVERSATION_ACTION_TYPE.SHOW_ERROR_MESSAGE,
        payload: {
          message:
            response?.data?.message ??
            "Unable to save your message. Please try again later.",
        },
      });
    }
  } catch (error: any) {
    dispatch({
      type: CONVERSATION_ACTION_TYPE.SHOW_ERROR_MESSAGE,
      payload: {
        message: "Unable to save your message. Please try again later.",
      },
    });
  }
}

async function saveAdCreativeMessage(
  dispatch: (a: ConversationAction) => void,
  messages: ChatGPTMessageObj[],
  jsonObjectInString: string,
  conversationId: string,
  conversationType: ConversationType,
  projectName: string,
  onDemand: boolean
) {
  const adCreativeJSON = JSON.parse(jsonObjectInString);
  const adCreativesWithIds = adCreativeJSON.variants?.map(
    (variant: IAdVariant) => {
      return {
        ...variant,
        _id: "variant-" + new ObjectId().toString(),
      };
    }
  );
  adCreativeJSON._id = "ad_creative-" + new ObjectId().toString();
  adCreativeJSON.variants = adCreativesWithIds;
  dispatch({
    type: CONVERSATION_ACTION_TYPE.ADD_ADCREATIVES,
    payload: {
      adCreatives: [adCreativeJSON],
    },
  });

  try {
    const response = await axios.post(
      ROUTES.MESSAGE.SAVE_AD_CREATIVE,
      {
        messages,
        json: jsonObjectInString,
        conversationId,
        projectName,
        onDemand,
      },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );

    const result = response.data.data;

    dispatch({
      type: CONVERSATION_ACTION_TYPE.REMOVE_ADCREATIVES,
      payload: {
        adCreatives: [adCreativeJSON],
      },
    });

    dispatch({
      type: CONVERSATION_ACTION_TYPE.ADD_ADCREATIVES,
      payload: {
        replaceId: adCreativeJSON._id,
        adCreatives: result?.adCreatives ?? [],
      },
    });
  } catch (e) {
    console.log("e - ", e);
  }
}

async function updateVariantToDB(
  dispatch: (a: ConversationAction) => void,
  variant: IAdVariant
) {
  try {
    const response = await axios.patch(
      ROUTES.VARIANT.UPDATE(variant.id),
      {
        text: variant.text,
        imageUrl: variant.imageUrl,
        images: variant.images,
      },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    if (response?.data?.ok) {
      dispatch({
        type: CONVERSATION_ACTION_TYPE.UPDATE_VARIANT,
        payload: variant,
      });
      return true;
    }
    return false;
  } catch (e) {
    console.log("e - ", e);
    return false;
  }
}

function clearError(dispatch: (a: ConversationAction) => void) {
  dispatch({
    type: CONVERSATION_ACTION_TYPE.CLEAR_ERROR,
    payload: {},
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
  updateVariantToDB,
  ConversationContextProvider,
};
