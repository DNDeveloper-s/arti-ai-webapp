import { ROUTES } from "@/config/api-config";
import API_QUERIES from "@/config/api-queries";
import {
  IAdCreative,
  IAdCreativeNew,
  IAdCreativeWithVariants,
} from "@/interfaces/IAdCreative";
import { IAdVariant } from "@/interfaces/IArtiBot";
import { ConversationType, IConversation } from "@/interfaces/IConversation";
import { IAdCampaign } from "@/interfaces/ISocial";
import {
  QueryFunctionContext,
  QueryKey,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import axios from "axios";

export interface InfiniteConversation {
  id: string;
  messages: {
    id: string;
    content: string;
    role: string;
    conversationId: string;
    createdAt: string;
    updatedAt: string;
  }[];
  conversation_type: ConversationType;
  project_name: string;
  lastAdCreativeCreatedAt: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}
export type GetConversationInifiniteResponse = InfiniteConversation[];

export const useGetConversationInfinite = (cursorId?: string) => {
  const LIMIT = 4;
  const fetchConversations = async (pageParam: undefined | string) => {
    const response = await axios.get(ROUTES.CONVERSATION.QUERY_INFINITE, {
      params: {
        cursor_id: pageParam,
        limit: LIMIT,
      },
    });

    return response.data.data;
  };

  return useInfiniteQuery<GetConversationInifiniteResponse>({
    queryKey: API_QUERIES.GET_INFINITE_CONVERSATIONS,
    queryFn: ({ pageParam }: any) => fetchConversations(pageParam),
    initialPageParam: cursorId,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length === 0) return undefined;
      return lastPage[lastPage.length - 1]?.id;
    },
    getPreviousPageParam: (firstPage, allPages) => {
      if (firstPage.length === 0) return undefined;
      return firstPage[0].id;
    },
  });
};

export interface VariantsByConversation {
  userId: string;
  lastUpdatedAt: string;
  id: string; // ConversationId
  project_name: string;
  ad_creative: IAdCreativeNew;
  variants: IAdVariant[];
}

export type GetVariantsByConversationResponse = VariantsByConversation[];

export const useGetVariantsByConversation = (skip: number = 0) => {
  const LIMIT = 4;
  const fetchVariants = async (skip: number) => {
    const response = await axios.get(ROUTES.CONVERSATION.QUERY_VARIANTS, {
      params: {
        skip,
        limit: LIMIT,
      },
    });

    return response.data.data;
  };

  return useInfiniteQuery<GetVariantsByConversationResponse>({
    queryKey: API_QUERIES.VARIANTS_BY_CONVERSATION,
    queryFn: ({ pageParam }: any) => fetchVariants(pageParam),
    initialPageParam: skip,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length === 0) return undefined;
      return allPages.length * LIMIT;
    },
  });
};

export interface InfiniteMessage {
  id: string;
  content: string;
  role: string;
  conversationId: string;
  createdAt?: string;
  updatedAt?: string;
  adCreatives: IAdCreativeWithVariants[];
}
type GetMessagesInifiniteResponse = InfiniteMessage[];
export const useGetMessages = (
  conversationId: string | null,
  initialPageParam?: string
) => {
  const LIMIT = 10;
  const fetchMessages = async (
    pageParam: undefined | string,
    queryKey: QueryKey
  ) => {
    const [, conversationId] = queryKey;
    if (!conversationId || typeof conversationId !== "string") {
      throw new Error("Conversation ID is required");
    }
    const response = await axios.get(
      ROUTES.CONVERSATION.GET_MESSAGES(conversationId),
      {
        params: {
          cursor_id: pageParam,
          limit: LIMIT,
        },
      }
    );

    return response.data.data;
  };

  return useInfiniteQuery<GetMessagesInifiniteResponse>({
    queryKey: API_QUERIES.GET_MESSAGES(conversationId),
    queryFn: ({ pageParam, queryKey }: any) =>
      fetchMessages(pageParam, queryKey),
    initialPageParam: initialPageParam,
    // select: (data) => ({
    //   pages: [...data.pages].reverse(),
    //   pageParams: [...data.pageParams].reverse(),
    // }),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length === 0 || lastPage.length < LIMIT) return undefined;
      return lastPage[lastPage.length - 1]?.id;
    },
    getPreviousPageParam: (firstPage, allPages) => {
      if (firstPage.length === 0) return undefined;
      return firstPage[0].id;
    },
  });
};

export const useGetConversation = (conversationId: string | null) => {
  const fetchConversation = async ({ queryKey }: QueryFunctionContext) => {
    const [, conversation_id] = queryKey;

    if (!conversation_id || typeof conversation_id !== "string") {
      throw new Error("Conversation ID is required");
    }

    const response = await axios.get(ROUTES.CONVERSATION.GET(conversation_id));

    return response.data.data;
  };
  return useQuery<IConversation>({
    queryKey: API_QUERIES.GET_CONVERSATION(conversationId),
    queryFn: fetchConversation,
    staleTime: 1000 * 60 * 5,
    retry: 3,
  });
};
