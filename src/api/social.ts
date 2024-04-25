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
  enabled: boolean = true
) => {
  const LIMIT = 4;
  const { accessToken } = useCredentials();
  const { data } = useGetFacebookPage({ accessToken, pageId, isInView: true });
  const getPostsByPageId = async (pageParam: string, queryKey: QueryKey) => {
    const [, page_id, page_access_token, period] = queryKey;
    if (!page_id || !page_access_token) {
      throw new Error("Page ID or Page Access Token is missing");
    }
    const response = await axios.get(ROUTES.SOCIAL.POSTS("facebook"), {
      params: {
        page_id,
        access_token: page_access_token,
        limit: LIMIT,
        get_insights: true,
        after: pageParam,
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
    queryFn: ({ pageParam, queryKey }: any) =>
      getPostsByPageId(pageParam, queryKey),
    initialPageParam: undefined,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.data.length === 0 || lastPage.data.length < LIMIT)
        return undefined;
      return lastPage.paging?.cursors.after;
    },
    getPreviousPageParam: (firstPage, allPages) => {
      if (firstPage.data.length === 0 || firstPage.data.length < LIMIT)
        return undefined;
      return firstPage.paging?.cursors.before;
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
