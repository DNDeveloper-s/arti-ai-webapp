import { ROUTES } from "@/config/api-config";
import API_QUERIES from "@/config/api-queries";
import { useClientMessages } from "@/context/ClientMessageContext";
import { useConversation } from "@/context/ConversationContext";
import getJSONObjectFromAString, { isValidJsonWithAdsArray } from "@/helpers";
import useSessionToken from "@/hooks/useSessionToken";
import {
  IAdCreative,
  IAdCreativeClient,
  IAdCreativeNew,
  IAdCreativeWithVariants,
} from "@/interfaces/IAdCreative";
import { ChatGPTRole, IAdVariant } from "@/interfaces/IArtiBot";
import { ConversationType, IConversation } from "@/interfaces/IConversation";
import {
  MutationFunction,
  QueryClient,
  QueryFunctionContext,
  QueryKey,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import ObjectID from "bson-objectid";
import { compact } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { useCredentials } from "./user";
import { IFacebookAdInsight } from "@/interfaces/ISocial";

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
}
export type GetConversationInifiniteResponse = InfiniteConversation[];

export const useGetConversationInfinite = (cursorId?: string) => {
  const LIMIT = 4;
  const { pushConversationsToState } = useConversation();

  const fetchConversations = async (pageParam: undefined | string) => {
    const response = await axios.get(ROUTES.CONVERSATION.QUERY_INFINITE, {
      params: {
        cursor_id: pageParam,
        limit: LIMIT,
      },
    });

    pushConversationsToState(response.data.data ?? []);

    return response.data.data;
  };

  return useInfiniteQuery<GetConversationInifiniteResponse>({
    queryKey: API_QUERIES.GET_INFINITE_CONVERSATIONS,
    queryFn: ({ pageParam }: any) => fetchConversations(pageParam),
    initialPageParam: cursorId,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length === 0 && lastPage.length < LIMIT) return undefined;
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
  const { pushVariantsToState } = useConversation();
  const LIMIT = 4;
  const fetchVariants = async (skip: number) => {
    const response = await axios.get(ROUTES.CONVERSATION.QUERY_VARIANTS, {
      params: {
        skip,
        limit: LIMIT,
      },
    });

    const variants = response.data.data
      ?.map((item: any) => item.variants)
      .flat();

    console.log("variants - ", variants);

    pushVariantsToState(variants ?? []);

    return response.data.data;
  };

  return useInfiniteQuery<GetVariantsByConversationResponse>({
    queryKey: API_QUERIES.VARIANTS_BY_CONVERSATION,
    queryFn: ({ pageParam }: any) => fetchVariants(pageParam),
    initialPageParam: skip,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length === 0 || lastPage.length < LIMIT) return undefined;
      return allPages.length * LIMIT;
    },
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
export const useGetMessages = (
  conversationId: string | null,
  initialPageParam?: string
) => {
  const { archiveByConversationId } = useClientMessages();
  const qc = useQueryClient();
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

    // const queryState = qc.getQueryState(
    //   API_QUERIES.GET_MESSAGES(conversationId)
    // );

    // queryState?.isInvalidated && archiveByConversationId(conversationId);

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

export const useGetConversation = (
  conversationId: string | null,
  enabled: boolean = true
) => {
  const { pushConversationsToState } = useConversation();
  const fetchConversation = async ({ queryKey }: QueryFunctionContext) => {
    const [, conversation_id] = queryKey;

    if (!conversation_id || typeof conversation_id !== "string") {
      throw new Error("Conversation ID is required");
    }

    const response = await axios.get(ROUTES.CONVERSATION.GET(conversation_id));

    pushConversationsToState(response.data.data ? [response.data.data] : []);

    return response.data.data;
  };
  return useQuery<IConversation>({
    queryKey: API_QUERIES.GET_CONVERSATION(conversationId),
    queryFn: fetchConversation,
    staleTime: 1000 * 60 * 5,
    retry: 3,
    enabled,
  });
};

function handleSSEEvent(rawData?: string): FormattedEventResponse {
  if (!rawData) return {};
  // console.log("rawData - ", rawData, rawData.split("\n\n"));
  const stringToParse = compact(rawData.split("\n\n")).pop();
  // console.log("stringToParse - ", stringToParse);
  if (!stringToParse) return {};
  const sanitizedString = stringToParse.replace(/\n/g, "\\n");
  // console.log("sanitizedString - ", sanitizedString);

  // Loop through each line to find the line containing JSON data
  let jsonData = null;
  if (sanitizedString.startsWith("data:")) {
    jsonData = sanitizedString.substring(6).trim(); // Remove 'data:' and any leading/trailing whitespace
  }

  if (jsonData === null) {
    // throw new Error("No JSON data found in SSE event");
    console.error("No JSON data found in SSE event");
    return {};
  }

  let parsedData: any = {};

  try {
    parsedData = JSON.parse(jsonData);
  } catch (e) {
    console.log("Error in parsing JSON data - ", jsonData);
    return {};
  }
  return {
    data: {
      ...parsedData,
      createdAt: Date.now(),
    },
  };
}

function handleJSONData(id: string, parsedData: FormattedEventResponse) {
  if (!parsedData.data) return {};
  const content = parsedData.data.content;
  if (!content) {
    console.error("No content found in the parsed data - ", parsedData);
    return;
  }

  try {
    const textContent = content.split("{\\n")[0];

    const jsonObjectInString = getJSONObjectFromAString(content);
    const isJson = isValidJsonWithAdsArray(jsonObjectInString);

    if (!isJson) {
      return parsedData;
    }

    const messageItem = {
      ...parsedData.data,
      id,
      content: textContent,
      adCreatives: [JSON.parse(jsonObjectInString)],
      json: jsonObjectInString,
      isClient: true,
    };

    return { data: messageItem };
  } catch (e) {
    return parsedData; // 660fdf33a909bb0dc7a23af2
  }
}

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

export interface FormattedEventResponse {
  data?: ClientMessageItem;
}

interface UseSendMessageOptions {
  onError?: (error: any) => void;
}

export interface SendMessageVariables {
  conversationId: string;
  conversationType: ConversationType;
  projectName: string;
  messages: { id: string; content: string; role: ChatGPTRole }[];
  serverGeneratedMessageId: string;
}

export const useSendMessage = (options?: UseSendMessageOptions) => {
  const { onError } = options || {};

  const [data, setData] = useState<FormattedEventResponse | null>(null);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [isGeneratingJson, setIsGeneratingJson] = useState<boolean>(false);
  const [isDone, setIsDone] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const token = useSessionToken();
  const { mutate: postSaveMessages } = useSaveMessages();
  const { mutate: postSaveJSONMessages } = useSaveAdCreativeMessages();

  const postSaveTextMessage = (
    variables: SendMessageVariables,
    data: FormattedEventResponse
  ) => {
    if (!data.data) return;
    postSaveMessages({
      conversationId: data.data.conversationId,
      conversationType: variables.conversationType,
      projectName: variables.projectName,
      messages: [
        variables.messages[0],
        {
          id: data.data.id,
          content: data.data.content,
          role: ChatGPTRole.ASSISTANT,
        },
      ],
    });
  };

  const postSaveJSONMessage = (
    variables: SendMessageVariables,
    data: FormattedEventResponse
  ) => {
    if (!data.data || !data.data.json) return;
    postSaveJSONMessages({
      conversationId: data.data.conversationId,
      conversationType: variables.conversationType,
      projectName: variables.projectName,
      json: data.data.json,
      messages: [
        variables.messages[0],
        {
          id: data.data.id,
          content: data.data.content,
          role: ChatGPTRole.ASSISTANT,
        },
      ],
    });
  };

  const sendMessage = async (variables: SendMessageVariables) => {
    try {
      if (!token) {
        throw new Error("Please authenticate");
      }
      setIsError(false);
      setIsPending(true);
      setIsDone(false);

      const response = await fetch(ROUTES.MESSAGE.SEND, {
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
          Authorization: `Bearer ${token}`,
        },
        method: "POST",
        body: JSON.stringify(variables),
      });

      if (!response.body) {
        throw new Error("No response body present");
      }

      const reader = response.body
        .pipeThrough(new TextDecoderStream())
        .getReader();

      setIsPending(false);

      let containsJson = false;
      let lastValue = "";

      while (true) {
        // console.log('reader - ', await reader.read());
        const { value, done } = await reader.read();
        // console.log("Testing | value - ", value);
        // handleChunk({ chunk: value, done, index: i });
        if (done) {
          const parsedData = handleSSEEvent(lastValue);
          if (!containsJson) {
            setData(parsedData);
            postSaveTextMessage(variables, parsedData);
          } else {
            const dataToSet = handleJSONData(parsedData.data?.id, parsedData);
            dataToSet && setData(dataToSet);
            dataToSet && postSaveJSONMessage(variables, dataToSet);
          }
          setIsDone(true);
          setIsGeneratingJson(false);
          break;
        }
        if (value.includes("{\\n")) {
          containsJson = true;
          setIsGeneratingJson(true);
        }
        if (!containsJson) {
          const parsedData = handleSSEEvent(value);
          // console.log("Testing | parsedData - ", parsedData);
          setData(parsedData);
        }
        lastValue = value;
      }
    } catch (e) {
      console.error("Error in sending the message - ", e);
      setIsError(true);
      onError && onError(e);
    }
  };

  return {
    mutate: sendMessage,
    data,
    isPending,
    isDone,
    isError,
    isGeneratingJson,
  };
};

interface SaveMessageVariables {
  messages: { id: string; content: string; role: ChatGPTRole }[];
  conversationId: string;
  conversationType: ConversationType;
  projectName: InfiniteConversation["project_name"];
}

export const useSaveMessages = () => {
  const queryClient = useQueryClient();

  const saveMessage = async (variables: SaveMessageVariables) => {
    const response = await axios.post(ROUTES.MESSAGE.SAVE, variables);
    return response.data;
  };

  return useMutation({
    mutationFn: saveMessage,
    onSettled: (data, error, variables) => {
      console.log(
        "API_QUERIES.GET_MESSAGES(variables.conversationId) 0 ",
        API_QUERIES.GET_MESSAGES(variables.conversationId)
      );
      queryClient.invalidateQueries({
        queryKey: API_QUERIES.GET_MESSAGES(variables.conversationId),
      });
      queryClient.invalidateQueries({
        queryKey: API_QUERIES.GET_INFINITE_CONVERSATIONS,
      });
    },
  });
};

interface SaveAdCreativeMessageVariables {
  messages: { content: string; role: ChatGPTRole }[];
  json: string;
  conversationId: string;
  conversationType: ConversationType;
  projectName: InfiniteConversation["project_name"];
  onDemand?: boolean;
}

export const useSaveAdCreativeMessages = () => {
  const queryClient = useQueryClient();

  const saveAdCreativeMessage = async (
    variables: SaveAdCreativeMessageVariables
  ) => {
    const response = await axios.post(
      ROUTES.MESSAGE.SAVE_AD_CREATIVE,
      variables
    );
    return response.data;
  };

  return useMutation({
    mutationFn: saveAdCreativeMessage,
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({
        queryKey: API_QUERIES.GET_MESSAGES(variables.conversationId),
      });
      queryClient.invalidateQueries({
        queryKey: API_QUERIES.GET_CONVERSATION(variables.conversationId),
      });
      queryClient.invalidateQueries({
        queryKey: API_QUERIES.GET_INFINITE_CONVERSATIONS,
      });
    },
  });
};

export const useGetAdJson = () => {
  const queryClient = useQueryClient();

  const getAdJson = async (conversationId: string) => {
    const response = await axios.get(ROUTES.MESSAGE.GET_AD_JSON, {
      params: {
        conversation_id: conversationId,
      },
    });

    return response.data;
  };

  return useMutation({
    mutationFn: getAdJson,
    onSettled: (data, error, conversationId) => {
      queryClient.invalidateQueries({
        queryKey: API_QUERIES.GET_MESSAGES(conversationId),
      });
      queryClient.invalidateQueries({
        queryKey: API_QUERIES.GET_CONVERSATION(conversationId),
      });
      queryClient.invalidateQueries({
        queryKey: API_QUERIES.GET_INFINITE_CONVERSATIONS,
      });
    },
  });
};

export interface UserCampaign {
  name: string;
  status: string;
  objective: string;
  effective_status: string;
  /** This is mongodb id for the campaign */
  id: string;
  /** This is the campaign id from meta */
  campaignId: string;
}
type GetUserCampaignsInfiniteResponse = UserCampaign[];
export const useGetUserCampaigns = (cursorId?: string) => {
  const LIMIT = 4;

  const fetchUserCampaigns = async (pageParam: undefined | string) => {
    const response = await axios.get(ROUTES.USERS.CAMPAIGNS, {
      params: {
        cursor_id: pageParam,
        limit: LIMIT,
      },
    });

    return response.data.data;
  };

  return useInfiniteQuery<GetUserCampaignsInfiniteResponse>({
    queryKey: API_QUERIES.GET_USER_CAMPAIGNS,
    queryFn: ({ pageParam }: any) => fetchUserCampaigns(pageParam),
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

const insights = {
  name: "ARTI AI - Direct Leads Campaign",
  status: "ACTIVE",
  objective: "OUTCOME_LEADS",
  effective_status: "ACTIVE",
  insights: {
    data: [
      {
        impressions: "41653",
        reach: "21267",
        spend: "1750.27",
        unique_clicks: "524",
        ctr: "1.867813",
        actions: [
          {
            action_type: "onsite_conversion.messaging_first_reply",
            value: "2",
          },
          {
            action_type: "landing_page_view",
            value: "49",
          },
          {
            action_type: "onsite_conversion.post_save",
            value: "30",
          },
          {
            action_type: "comment",
            value: "1",
          },
          {
            action_type: "page_engagement",
            value: "600",
          },
          {
            action_type: "post_engagement",
            value: "601",
          },
          {
            action_type: "post",
            value: "11",
          },
          {
            action_type: "lead",
            value: "126",
          },
          {
            action_type: "leadgen_grouped",
            value: "126",
          },
          {
            action_type: "onsite_conversion.messaging_conversation_started_7d",
            value: "2",
          },
          {
            action_type: "onsite_conversion.lead_grouped",
            value: "126",
          },
          {
            action_type: "post_reaction",
            value: "102",
          },
          {
            action_type: "link_click",
            value: "456",
          },
        ],
        cpm: "42.020263",
        date_start: "2024-03-07",
        date_stop: "2024-04-05",
      },
    ],
    paging: {
      cursors: {
        before: "MAZDZD",
        after: "MAZDZD",
      },
    },
  },
  id: "120207183720580340",
};

interface CampaignWithInsights {
  ad_account_id: string;
  name: string;
  status: string;
  objective: string;
  effective_status: string;
  insights?: {
    data: IFacebookAdInsight[];
    paging: {
      cursors: {
        before: string;
        after: string;
      };
    };
  };
  /** This is the campaign Id from meta */
  id: string;
}

export const useGetCampaignInsights = (
  campaignId?: string,
  enabled: boolean = true
) => {
  const { accessToken } = useCredentials();

  const getCampaignInsights = async ({ queryKey }: QueryFunctionContext) => {
    const [, accessToken, campaignId] = queryKey;

    if (!accessToken) {
      throw new Error("Access token is required");
    }

    if (!campaignId || typeof campaignId !== "string") {
      throw new Error("Campaign ID is required");
    }

    const response = await axios.get(ROUTES.ADS.GET_CAMPAIGN(campaignId), {
      params: {
        access_token: accessToken,
        get_insights: true,
      },
    });

    return response.data.data;
  };

  return useQuery<CampaignWithInsights>({
    queryKey: API_QUERIES.GET_CAMPAIGN(accessToken, campaignId),
    queryFn: getCampaignInsights,
    enabled: enabled && !!campaignId && !!accessToken,
  });
};

interface LeadFormObject {
  id: string;
  name: string;
  leads: any;
  questions: any;
  status: "ACTIVE" | "ARCHIVED" | "PAUSED";
}
type GetLeadGenFormsResponse = LeadFormObject[];
export const useGetLeadGenForms = ({
  pageAccessToken,
  pageId,
  enabled = true,
}: {
  pageAccessToken?: string | null;
  pageId?: string;
  enabled?: boolean;
}) => {
  const getLeadGenForms = async ({ queryKey }: QueryFunctionContext) => {
    const [, pageId, pageAccessToken] = queryKey;
    if (!pageId) {
      throw new Error("Page ID is required");
    }
    if (!pageAccessToken) {
      throw new Error("Page Access Token is required");
    }
    const response = await axios.get(ROUTES.ADS.GET_LEADGEN_FORMS, {
      params: {
        page_id: pageId,
        page_access_token: pageAccessToken,
      },
    });

    return response.data.data;
  };

  return useQuery<GetLeadGenFormsResponse>({
    queryKey: API_QUERIES.GET_LEADGEN_FORMS(pageId, pageAccessToken),
    queryFn: getLeadGenForms,
    enabled: !!enabled && !!pageId && !!pageAccessToken,
  });
};
