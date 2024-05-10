import { ROUTES } from "@/config/api-config";
import API_QUERIES from "@/config/api-queries";
import { useBusiness } from "@/context/BusinessContext";
import { useConversation } from "@/context/ConversationContext";
import { IAdCreativeWithVariants } from "@/interfaces/IAdCreative";
import { ChatGPTRole } from "@/interfaces/IArtiBot";
import { ConversationType } from "@/interfaces/IConversation";
import {
  QueryKey,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

export interface ClientMessageItem {
  content: string;
  id: string;
  conversationId: string;
  done: boolean;
  role: ChatGPTRole;
  adCreatives?: IAdCreativeClient[];
  isClient?: boolean;
  createdAt: number;
  json?: string;
}

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
  adCreatives: IAdCreativeWithVariants[];
  conversation_type: ConversationType;
  project_name: string;
  lastAdCreativeCreatedAt: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  businessId: string;
}

export interface SocialPost {
  id: string;
  postId: string;
  pageId: string;
  provider: string;
  conversationId: string;
  variantId: string;
  adCreativeId: string;
  userId: string;
  createdAt: string;
  Variant: {
    imageUrl: string;
    adCreativeId: string;
    text: string;
    oneLiner: string;
  };
}

export interface ConversationGroupByPost {
  id: string;
  conversation_type: ConversationType;
  project_name: string;
  lastAdCreativeCreatedAt: string;
  businessId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  Post: SocialPost[];
}

type ConversationGroupByNone = InfiniteConversation;

interface GetConversationInifiniteBase {
  posts: ConversationGroupByPost[];
  none: ConversationGroupByNone[];
}

export type GetConversationInifiniteResponse<T extends "posts" | "none"> =
  GetConversationInifiniteBase[T];

export const useGetConversationInfinite = <T extends "posts" | "none" = "none">(
  cursorId?: string | null,
  include_cursor: boolean = false,
  enabled: boolean = true,
  group_by?: T
) => {
  const LIMIT = 10;
  const { pushConversationsToState } = useConversation();
  const { business } = useBusiness();
  const qc = useQueryClient();
  const searchParams = useSearchParams();
  let queryConversationId: any = null;
  const initialLoad = useRef(true);

  if (initialLoad.current) {
    queryConversationId = searchParams.get("conversation_id");
    initialLoad.current = false;
  }

  const fetchConversations = async (
    pageParam: any,
    queryKey: QueryKey,
    direction: "forward" | "backward" = "forward"
  ) => {
    const [, businessId, group_by] = queryKey;
    if (!businessId) {
      throw new Error("Business ID is required");
    }
    const state = qc.getQueryState(queryKey);

    const response = await axios.get(ROUTES.CONVERSATION.QUERY_INFINITE, {
      params: {
        cursor_id: pageParam?.cursorId,
        include_cursor: state?.isInvalidated || pageParam?.include_cursor,
        limit: LIMIT * (direction === "forward" ? 1 : -1),
        business_id: businessId,
        group_by,
      },
    });

    if (group_by !== "posts")
      pushConversationsToState(response.data.data ?? []);

    return response.data.data;
  };

  return useInfiniteQuery<GetConversationInifiniteResponse<T>>({
    queryKey: API_QUERIES.GET_INFINITE_CONVERSATIONS(business?.id, group_by),
    queryFn: ({ pageParam, queryKey, direction, meta }: any) =>
      fetchConversations(pageParam, queryKey, direction),
    meta: {},
    initialPageParam: { cursorId: queryConversationId, include_cursor: true },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length === 0 || lastPage.length < LIMIT) return undefined;
      return {
        cursorId: lastPage[lastPage.length - 1]?.id,
        include_cursor: false,
      };
    },
    getPreviousPageParam: (firstPage, allPages) => {
      if (
        firstPage.length === 0 ||
        (allPages.length > 1 && firstPage.length < LIMIT)
      )
        return undefined;
      return { cursorId: firstPage[0].id, include_cursor: false };
    },
    enabled,
  });
};

export interface InfiniteMessage {
  id: string;
  content: string;
  role: ChatGPTRole;
  conversationId: string;
  createdAt?: string;
  updatedAt?: string;
  adCreatives: IAdCreativeWithVariants[];
}

type GetMessagesInifiniteResponse = InfiniteMessage[];
export const useGetMessages = ({
  conversationId,
  initialPageParam,
  enabled = false,
}: {
  conversationId: string | null;
  initialPageParam?: string | null;
  enabled?: boolean;
}) => {
  const qc = useQueryClient();
  const LIMIT = 10;
  const fetchMessages = async (
    pageParam: undefined | any,
    queryKey: QueryKey,
    direction: "forward" | "backward" = "forward"
  ) => {
    const [, conversationId] = queryKey;
    if (!conversationId || typeof conversationId !== "string") {
      throw new Error("Conversation ID is required");
    }
    const response = await axios.get(
      ROUTES.CONVERSATION.GET_MESSAGES(conversationId),
      {
        params: {
          cursor_id: pageParam?.cursorId,
          limit:
            LIMIT *
            (pageParam?.initial ? -1 : direction === "forward" ? 1 : -1),
          include_cursor: pageParam?.include_cursor,
        },
      }
    );

    return response.data.data;
  };

  return useInfiniteQuery<GetMessagesInifiniteResponse>({
    queryKey: API_QUERIES.GET_MESSAGES(conversationId),
    queryFn: ({ pageParam, queryKey, direction }: any) =>
      fetchMessages(pageParam, queryKey, direction),
    initialPageParam: initialPageParam
      ? {
          cursorId: initialPageParam,
          initial: true,
          include_cursor: true,
        }
      : undefined,
    enabled: !!enabled && !!conversationId,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length === 0) return undefined;
      return {
        cursorId: lastPage[lastPage.length - 1]?.id,
        include_cursor: false,
      };
    },
    getPreviousPageParam: (firstPage, allPages) => {
      if (firstPage.length === 0) return undefined;
      return { cursorId: firstPage[0]?.id, include_cursor: false };
    },
  });
};
