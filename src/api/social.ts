import { ROUTES } from "@/config/api-config";
import API_QUERIES from "@/config/api-queries";
import {
  QueryFunctionContext,
  QueryKey,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import axios from "axios";
import { useCredentials, useGetFacebookPage } from "./user";
import { PaginatedResponse } from "@/interfaces/ISocial";
import { useMemo } from "react";
import { TbRuler3 } from "react-icons/tb";
import { SocialPost } from "./conversation";
import { useBusiness } from "@/context/BusinessContext";
import { SupportedPlatform } from "@/context/UserContext";

export interface FacebookPost {
  id: string;
  created_time: string;
  message: string;
  full_picture: string;
  insights: {
    name: string;
    period: string;
    values: {
      value: number;
    }[];
    title: string;
    description: string;
    id: string;
  }[];
  likes?: PaginatedResponse<PostLike>;
  comments?: PaginatedResponse<PostComment>;
  shares?: ShareCount;
}

interface PostLike {
  id: string;
  name: string;
}

interface PostComment {
  id: string;
  from: {
    name: string;
    id: string;
  };
  message: string;
  created_time: string;
}
interface ShareCount {
  count: number;
}

export const useQueryPostsByPageId = (
  pageId?: string,
  period?: "week",
  post_id?: string,
  enabled: boolean = true
) => {
  const LIMIT = 4;
  const { accessToken } = useCredentials();
  const { data } = useGetFacebookPage({ accessToken, pageId, isInView: true });
  const getPostsByPageId = async (
    pageParam: undefined | any,
    queryKey: QueryKey,
    direction: "forward" | "backward" = "forward"
  ) => {
    const [, page_id, page_access_token, period] = queryKey;
    if (!page_id || !page_access_token) {
      throw new Error("Page ID or Page Access Token is missing");
    }
    const paginationKey = pageParam?.initial
      ? "post_ids"
      : direction === "forward"
        ? "after"
        : "before";

    const response = await axios.get(ROUTES.SOCIAL.POSTS("facebook"), {
      params: {
        page_id,
        access_token: page_access_token,
        limit: LIMIT,
        get_insights: true,
        [paginationKey]: pageParam.id,
        period,
      },
    });

    return response.data.data;
  };

  const query = useInfiniteQuery<PaginatedResponse<FacebookPost>>({
    queryKey: API_QUERIES.GET_SOCIAL_POST(
      pageId,
      data?.page_access_token,
      period
    ),
    enabled: !!enabled && !!pageId,
    queryFn: ({ pageParam, queryKey, direction }: any) =>
      getPostsByPageId(pageParam, queryKey, direction),
    initialPageParam: { id: post_id, initial: true },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.data.length === 0 || lastPage.data.length < LIMIT)
        return undefined;
      return { id: lastPage.paging?.cursors?.after, initial: false };
    },
    getPreviousPageParam: (firstPage, allPages) => {
      if (firstPage.data.length === 0 || firstPage.data.length < LIMIT)
        return undefined;
      return { id: firstPage.paging?.cursors?.before, initial: false };
    },
  });

  const posts = useMemo(() => {
    return (
      query.data?.pages
        .map((page) => page.data)
        .flat()
        // Filtering the campaigns that have insights
        .filter((c) => !!c.insights && c.insights.length > 0) || []
    );
  }, [query.data]);

  return {
    ...query,
    posts,
  };
};

export interface ConversationPost extends Omit<SocialPost, "Variant"> {
  data: Pick<
    FacebookPost,
    "id" | "created_time" | "message" | "full_picture" | "likes"
  >;
}

interface UseQueryPostsByConversationIdOptions {
  conversationId?: string;
  enabled?: boolean;
}

export const useQueryPostsByConversationId = ({
  conversationId,
  enabled = true,
}: UseQueryPostsByConversationIdOptions) => {
  const LIMIT = 4;
  const { businessMap } = useBusiness();
  const page_access_token =
    businessMap.getFacebookPage()?.provider_access_token;

  const getPostsByConversationId = async (
    pageParam: undefined | any,
    queryKey: QueryKey,
    direction: "forward" | "backward" = "forward"
  ) => {
    const [, conversationId, page_access_token] = queryKey;
    if (!conversationId) {
      throw new Error("Conversation ID is missing");
    }

    if (!page_access_token) {
      throw new Error("Page Access Token is missing");
    }

    const response = await axios.get(
      ROUTES.CONVERSATION.POSTS(conversationId as string),
      {
        params: {
          access_token: page_access_token,
          limit: LIMIT * (direction === "forward" ? 1 : -1),
          cursor_id: pageParam,
        },
      }
    );

    return response.data.data;
  };

  const query = useInfiniteQuery<ConversationPost[]>({
    queryKey: API_QUERIES.QUERY_SOCIAL_POSTS(conversationId, page_access_token),
    enabled: !!enabled && !!conversationId && !!page_access_token,
    queryFn: ({ pageParam, queryKey, direction }: any) =>
      getPostsByConversationId(pageParam, queryKey, direction),
    initialPageParam: undefined,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length === 0 || lastPage.length < LIMIT) return undefined;
      return lastPage[lastPage.length - 1].id;
    },
    getPreviousPageParam: (firstPage, allPages) => {
      console.log("firstPage - ", firstPage);
      if (firstPage.length === 0 || firstPage.length < LIMIT) return undefined;
      return firstPage[0].id;
    },
  });

  const posts = useMemo(() => {
    return query.data?.pages.map((page) => page).flat() || [];
  }, [query.data]);

  return {
    ...query,
    posts,
  };
};

export interface QueryPostByIdObject {
  details: Pick<
    FacebookPost,
    "id" | "created_time" | "message" | "full_picture"
  >;
  insights: {
    name: string;
    period: string;
    values: {
      value: number;
    }[];
    title: string;
    description: string;
    id: string;
  }[];
}

interface UseQueryPostByIdOptions {
  postId: string;
  platform: "facebook" | "instagram";
}
export const useQueryPostById = ({
  postId,
  platform,
}: UseQueryPostByIdOptions) => {
  const { businessMap } = useBusiness();
  const page_access_token =
    businessMap.getFacebookPage()?.provider_access_token;

  const getPostById = async ({ queryKey }: QueryFunctionContext) => {
    const [, postId, page_access_token, platform] = queryKey;

    if (!postId || !page_access_token || !platform)
      throw new Error("Post ID, Page Access Token or Platform is missing");

    const response = await axios.get(
      ROUTES.SOCIAL.POST(
        postId as string,
        platform as "facebook" | "instagram"
      ),
      {
        params: {
          access_token: page_access_token,
          get_insights: true,
        },
      }
    );

    return response.data.data;
  };

  const query = useQuery<QueryPostByIdObject>({
    queryKey: API_QUERIES.GET_SOCIAL_POST_BY_ID(
      postId,
      page_access_token,
      platform
    ),
    queryFn: getPostById,
    enabled: !!postId && !!page_access_token && !!platform,
  });

  return {
    ...query,
    post: query.data,
  };
};
