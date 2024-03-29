import { ROUTES } from "@/config/api-config";
import API_QUERIES from "@/config/api-queries";
import { ConversationType } from "@/interfaces/IConversation";
import { QueryFunction, useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

const data = {
  id: "65642c87c68343014ba202c3",
  messages: [
    {
      id: "65780f4888615fd97af26f11",
      content: "More suggestions",
      role: "user",
      conversationId: "65642c87c68343014ba202c3",
      createdAt: "2023-12-12T07:44:08.781Z",
      updatedAt: "2023-12-12T07:44:08.781Z",
    },
  ],
  conversation_type: "ad_creative",
  project_name: "EcoHarvest Solutions",
  lastAdCreativeCreatedAt: "2023-11-27T05:58:09.940Z",
  userId: "6544be2bf17aa96df1673fef",
  createdAt: "2023-11-27T05:43:56.619Z",
  updatedAt: "2023-12-12T07:44:08.016Z",
};

export interface GetConversationInifiniteResponse {
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

export const useGetConversationInfinite = (cursorId?: string) => {
  const fetchConversations = async (pageParam: undefined | string) => {
    const response = await axios.get(ROUTES.CONVERSATION.QUERY_INFINITE, {
      params: {
        cursor_id: pageParam,
        limit: 4,
      },
    });

    return response.data.data;
  };

  return useInfiniteQuery<GetConversationInifiniteResponse[]>({
    queryKey: API_QUERIES.GET_INFINITE_CONVERSATIONS,
    queryFn: ({ pageParam }: any) => fetchConversations(pageParam),
    initialPageParam: cursorId,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length === 0) return undefined;
      console.log("lastPage - ", lastPage);
      return lastPage[lastPage.length - 1]?.id;
    },
    getPreviousPageParam: (firstPage, allPages) => {
      if (firstPage.length === 0) return undefined;
      return firstPage[0].id;
    },
  });
};
