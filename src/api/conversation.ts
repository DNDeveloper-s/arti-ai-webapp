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
  UseMutationOptions,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import ObjectID from "bson-objectid";
import { compact, omit } from "lodash";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { GenericLocationObject, useCredentials } from "./user";
import {
  IAd,
  IFacebookAdInsight,
  PaginatedResponse,
} from "@/interfaces/ISocial";
import { SnackbarContext } from "@/context/SnackbarContext";
import { useBusiness } from "@/context/BusinessContext";
import { useSearchParams } from "next/navigation";
import { RangeValueType } from "rc-picker/lib/PickerInput/RangePicker";
import { Dayjs } from "dayjs";

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

const sampleGroupByPosts = {
  id: "661225f4123038d55eecbcef",
  conversation_type: "social_media_post",
  project_name: "New Convo",
  lastAdCreativeCreatedAt: "2024-04-07T05:50:10.374Z",
  businessId: "6617bf388e224e3215f60cdc",
  userId: "6544be2bf17aa96df1673fef",
  createdAt: "2024-04-07T04:50:03.799Z",
  updatedAt: "2024-04-07T05:50:10.374Z",
  Post: [
    {
      id: "6620f1bf1f93508975ebf27f",
      postId: "820762918047031_744443924540896",
      pageId: "820762918047031",
      provider: "facebook",
      conversationId: "661225f4123038d55eecbcef",
      variantId: "661234141856edc0717b8b5e",
      adCreativeId: "661234131856edc0717b8b5c",
      userId: "6544be2bf17aa96df1673fef",
      createdAt: "2024-04-18T10:11:11.191Z",
    },
    {
      id: "6628ee695288da0759f46a65",
      postId: "820762918047031_747911267527495",
      pageId: "820762918047031",
      provider: "facebook",
      conversationId: "661225f4123038d55eecbcef",
      variantId: "661234141856edc0717b8b5d",
      adCreativeId: "661234131856edc0717b8b5c",
      userId: "6544be2bf17aa96df1673fef",
      createdAt: "2024-04-24T11:35:05.085Z",
    },
  ],
};

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
    initialPageParam: { cursorId, include_cursor: true },
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
  const { business } = useBusiness();
  const LIMIT = 10;
  const fetchVariants = async (skip: number, queryKey: QueryKey) => {
    const [, businessId] = queryKey;
    const response = await axios.get(ROUTES.CONVERSATION.QUERY_VARIANTS, {
      params: {
        skip,
        limit: LIMIT,
        business_id: businessId,
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
    queryKey: API_QUERIES.VARIANTS_BY_CONVERSATION(business?.id),
    queryFn: ({ pageParam, queryKey }: any) =>
      fetchVariants(pageParam, queryKey),
    initialPageParam: skip,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length === 0 || lastPage.length < LIMIT) return undefined;
      return allPages.length * LIMIT;
    },
    enabled: !!business,
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

interface DefaultBaseResponse<T> {
  ok: boolean;
  data: T;
  message?: string;
}
export const useGetConversation = (
  conversationId?: string | null,
  enabled: boolean = true
) => {
  const { pushConversationsToState } = useConversation();
  const { setBusiness } = useBusiness();
  const { data: businesses, isSuccess } = useQueryUserBusiness();
  const searchParams = useSearchParams();
  const businessId = searchParams.get("business_id");

  const fetchConversation = async ({ queryKey }: QueryFunctionContext) => {
    const [, conversation_id] = queryKey;

    if (!conversation_id || typeof conversation_id !== "string") {
      throw new Error("Conversation ID is required");
    }

    const response = await axios.get<DefaultBaseResponse<InfiniteConversation>>(
      ROUTES.CONVERSATION.GET(conversation_id)
    );

    pushConversationsToState(response.data.data ? [response.data.data] : []);

    return response.data.data;
  };

  const query = useQuery<InfiniteConversation>({
    queryKey: API_QUERIES.GET_CONVERSATION(conversationId),
    queryFn: fetchConversation,
    staleTime: 1000 * 60 * 5,
    retry: 3,
    enabled: !!enabled && !!conversationId,
  });

  useEffect(() => {
    if (isSuccess && businesses) {
      const conversationBusinessId = query.data?.businessId ?? businessId;
      const business = businesses.find((b) => b.id === conversationBusinessId);
      business && setBusiness(business);
    }
  }, [businesses, isSuccess, query.data, setBusiness, businessId]);

  return query;
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

  const [, setSnackbarData] = useContext(SnackbarContext).snackBarData;
  const [data, setData] = useState<FormattedEventResponse | null>(null);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [isGeneratingJson, setIsGeneratingJson] = useState<boolean>(false);
  const [isDone, setIsDone] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const token = useSessionToken();
  const { mutate: postSaveMessages } = useSaveMessages();
  const { mutate: postSaveJSONMessages } = useSaveAdCreativeMessages();
  const { business } = useBusiness();
  const searchParams = useSearchParams();

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
        body: JSON.stringify({ ...variables, businessId: business?.id }),
      });

      if (!response.body) {
        throw new Error("No response body present");
      }

      if (
        response.status !== 200 &&
        response.headers.get("Content-Type")?.includes("application/json")
      ) {
        const json = await response.json();
        throw new Error(json.message ?? "Error in sending the message");
      }

      const reader = response.body
        .pipeThrough(new TextDecoderStream())
        .getReader();

      setIsPending(false);

      let containsJson = false;
      let lastValue = "";

      while (true) {
        const { value, done } = await reader.read();
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
        if (value.includes("{\\n") && !containsJson) {
          containsJson = true;
          setIsGeneratingJson(true);
        }
        if (!containsJson) {
          const parsedData = handleSSEEvent(value);
          setData(parsedData);
        }
        lastValue = value;
      }
    } catch (e: any) {
      console.log("e - ", e.message);
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
  const { business } = useBusiness();

  const saveMessage = async (variables: SaveMessageVariables) => {
    if (!business) throw new Error("Business is required");
    const response = await axios.post(ROUTES.MESSAGE.SAVE, {
      ...variables,
      businessId: business.id,
    });
    return response.data;
  };

  return useMutation({
    mutationFn: saveMessage,
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({
        queryKey: API_QUERIES.GET_MESSAGES(variables.conversationId),
      });
      queryClient.invalidateQueries({
        queryKey: API_QUERIES.GET_INFINITE_CONVERSATIONS(business?.id),
      });
      queryClient.invalidateQueries({
        queryKey: API_QUERIES.GET_CREDIT_BALANCE,
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
  const { business } = useBusiness();

  const saveAdCreativeMessage = async (
    variables: SaveAdCreativeMessageVariables
  ) => {
    if (!business) throw new Error("Business is required");
    const response = await axios.post(ROUTES.MESSAGE.SAVE_AD_CREATIVE, {
      ...variables,
      businessId: business.id,
    });
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
        queryKey: API_QUERIES.GET_INFINITE_CONVERSATIONS(business?.id),
      });
      queryClient.invalidateQueries({
        queryKey: API_QUERIES.GET_CREDIT_BALANCE,
      });
    },
  });
};

export const useGetAdJson = () => {
  const queryClient = useQueryClient();
  const {} = useBusiness();

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
  conversation_id?: string;
  ad_account_id: string;
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
  conversation_id?: string;
  name: string;
  status: string;
  objective: string;
  effective_status: string;
  insights?: PaginatedResponse<IFacebookAdInsight>;
  ads: PaginatedResponse<AdLeadData>;
  /** This is the campaign Id from meta */
  id: string;
}

export interface AdLeadData {
  id: string;
  name: string;
  leads?: PaginatedResponse<LeadData>;
}

export interface LeadData {
  created_time: string;
  id: string;
  field_data: {
    name: string;
    values: string[];
  }[];
}

export type TimeRange = RangeValueType<Dayjs>;

export function prepareTimeRange(
  timeRange: TimeRange | undefined
): string | null {
  if (!timeRange) {
    return null;
  }
  const [start, end] = timeRange;
  if (!start || !end) return null;
  const obj = {
    since: start.format("YYYY-MM-DD"),
    until: end.format("YYYY-MM-DD"),
  };

  return JSON.stringify(obj);
}

export const useGetCampaignInsights = ({
  campaignId,
  timeRange,
  enabled = true,
  get_leads = false,
}: {
  campaignId?: string | null;
  timeRange?: TimeRange;
  enabled?: boolean;
  get_leads?: boolean;
}) => {
  const { accessToken } = useCredentials();

  const parsedTimeRange = useMemo(
    () => prepareTimeRange(timeRange),
    [timeRange]
  );

  const getCampaignInsights = async ({ queryKey }: QueryFunctionContext) => {
    const [, accessToken, campaignId, timeRange, get_leads] = queryKey;

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
        time_range: timeRange,
        get_leads: !!get_leads,
      },
    });

    return response.data.data;
  };

  return useQuery<CampaignWithInsights>({
    queryKey: API_QUERIES.GET_CAMPAIGN(
      accessToken,
      campaignId,
      parsedTimeRange,
      get_leads
    ),
    queryFn: getCampaignInsights,
    enabled: enabled && !!campaignId && !!accessToken,
    staleTime: 1000 * 60 * 2,
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

interface CreateLeadFormVariables {
  pageId: string;
  pageAccessToken?: string | null;
  name: string;
  questions: {
    type: string;
    key: string;
  }[];
  privacy_policy: {
    url: string;
  };
  follow_up_action_url: string;
}

export const useCreateLeadForm = () => {
  const queryClient = useQueryClient();
  const [, setSnackbarData] = useContext(SnackbarContext).snackBarData;

  const createLeadForm = async (variables: CreateLeadFormVariables) => {
    if (!variables.pageId || !variables.pageAccessToken) {
      throw new Error("Page ID and Page Access Token are required");
    }
    const dataToPost = omit(variables, ["pageId", "pageAccessToken"]);
    const response = await axios.post(
      ROUTES.ADS.CREATE_LEADGEN_FORMS,
      dataToPost,
      {
        params: {
          page_id: variables.pageId,
          page_access_token: variables.pageAccessToken,
        },
      }
    );
    return response.data;
  };

  return useMutation({
    mutationFn: createLeadForm,
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({
        queryKey: API_QUERIES.GET_LEADGEN_FORMS(
          variables.pageId,
          variables.pageAccessToken
        ),
      });
    },
    onSuccess: (data, variables) => {
      setSnackbarData({
        message: "Lead Form created successfully",
        status: "success",
      });
    },
    onError: (error, variables) => {
      setSnackbarData({
        message: "Error in creating the Lead Form",
        status: "error",
      });
    },
  });
};

export interface CreditObject {
  id: string;
  balance: number;
  userId: string;
}
type UseGetCreditResponse = CreditObject;
export const useGetCredits = () => {
  const getCredits = async () => {
    const response = await axios.get(ROUTES.USERS.CREDIT_BALANCE);
    return response.data.data;
  };

  return useQuery<UseGetCreditResponse>({
    queryKey: API_QUERIES.GET_CREDIT_BALANCE,
    queryFn: getCredits,
    staleTime: 1000 * 60 * 5, // 10 minutes
  });
};

type AutoCompleteValue = string | number | null | undefined | "N/A";

interface CampaignAutoComplete {
  name: AutoCompleteValue;
  objective: AutoCompleteValue;
}

interface AutoCompleteFBTargeting {
  id: string;
  name: string;
  type: string;
}

interface AdSetAutoComplete {
  default_fields: {
    name?: AutoCompleteValue;
    performance_goal?: AutoCompleteValue;
    daily_budget?: AutoCompleteValue;
    start_time?: AutoCompleteValue;
    end_time?: AutoCompleteValue;
    location?: AutoCompleteValue;
    age?: AutoCompleteValue;
    gender?: AutoCompleteValue;
    fb_detailed_targeting?: AutoCompleteFBTargeting[];
    fb_location_targeting?: GenericLocationObject[];
    detailed_targeting?: {
      interests?: string[];
    };
  };
  campaign_objective_specific_fields: {
    awareness?: {};
    traffic?: {
      conversion_location: AutoCompleteValue;
    };
    leads?: {
      conversion_location: AutoCompleteValue;
    };
  };
}

interface AdAutoComplete {
  default_fields?: {
    name?: AutoCompleteValue;
    primary_text?: AutoCompleteValue;
    headline?: AutoCompleteValue;
    call_to_action_button?: AutoCompleteValue;
  };
  custom_values_based_on_conversion_location: {
    website?: {
      website_url: AutoCompleteValue;
    };
    app?: {
      deep_link_url: AutoCompleteValue;
    };
    messaging_apps?: {
      call_to_action_button: AutoCompleteValue;
    };
    calls?: {
      phone_number: AutoCompleteValue;
    };
    instant_form?: {
      form_details: AutoCompleteValue;
    };
  };
}

export interface AutoCompleteObject {
  campaign?: CampaignAutoComplete;
  ad_set?: AdSetAutoComplete;
  ad?: AdAutoComplete;
}

export const validateAutoCompleteValue = (
  value: AutoCompleteValue,
  options?: {
    oneOfArr?: string[];
    transformer?: (value: string) => string;
  }
) => {
  const isValidated = value !== null && value !== undefined && value !== "N/A";
  if (!isValidated) return false;
  if (options?.oneOfArr && options?.oneOfArr.length > 0) {
    return options.oneOfArr.includes(
      options.transformer ? options.transformer(value) : (value as string)
    );
  }
  return true;
};

export const useGetAdCreativeAutoComplete = ({
  adCreativeId,
  enabled = true,
}: {
  adCreativeId?: string;
  enabled?: boolean;
}) => {
  const getAdCreativeAutoComplete = async ({
    queryKey,
  }: QueryFunctionContext) => {
    const [, adCreativeId] = queryKey;
    if (!adCreativeId) {
      throw new Error("Ad Creative ID is required");
    }
    const response = await axios.get(ROUTES.ADCREATIVE.AUTO_COMPLETE, {
      params: {
        ad_creative_id: adCreativeId,
        creative_id: adCreativeId,
        create_if_missing: true,
      },
    });
    return response.data.data;
  };

  return useQuery<AutoCompleteObject>({
    queryKey: API_QUERIES.GET_CREATIVE_AUTO_COMPLETE(adCreativeId),
    queryFn: getAdCreativeAutoComplete,
    enabled: !!enabled && !!adCreativeId,
    staleTime: Infinity,
  });
};

const registerBusinessVariableExample = {
  name: "Fitness World",
  category: "health",
  position: "Manager",
  website: "https://www.google.com",
  location: [
    {
      zipcode: "123",
      city: "123",
      locality: "23",
    },
    {
      zipcode: "123",
      city: "123",
      locality: "23",
    },
  ],
  details: "123",
};

export enum SocialPageType {
  FACEBOOK_PAGE = "facebook-page",
  FACEBOOK_AD_ACCOUNT = "facebook-ad-account",
  INSTAGRAM_PAGE = "instagram-page",
}

export interface SocialPageObject {
  name: string;
  image?: string;
  provider_id: string;
  provider_access_token?: string;
  type: SocialPageType;
}

export interface RegisterBusinessVariables {
  name: string;
  category: string;
  position: string;
  website: string;
  location: {
    zipcode: string;
    city: string;
    locality: string;
  }[];
  details: string;
  social_pages?: SocialPageObject[];
}

export const useRegisterBusiness = (
  props: UseMutationOptions<any, Error, RegisterBusinessVariables, any> = {}
) => {
  const { onError, onSuccess, onSettled, ...options } = props;
  const queryClient = useQueryClient();
  const [, setSnackbarData] = useContext(SnackbarContext).snackBarData;

  const registerBusiness = async (data: RegisterBusinessVariables) => {
    const response = await axios.post(ROUTES.BUSINESS.ME, data);
    return response.data.data;
  };

  return useMutation({
    mutationFn: registerBusiness,
    onSettled: (data, error, variables, ...rest) => {
      queryClient.invalidateQueries({
        queryKey: API_QUERIES.GET_USER_BUSINESSES,
      });
      onSettled && onSettled(data, error, variables, ...rest);
    },
    onSuccess: (data, variables, ...rest) => {
      setSnackbarData({
        message: "Business registered successfully",
        status: "success",
      });
      queryClient.invalidateQueries({
        queryKey: API_QUERIES.GET_USER_BUSINESSES,
      });
      onSuccess && onSuccess(data, variables, ...rest);
    },
    onError: (error, variables, ...rest) => {
      setSnackbarData({
        message: "Error in registering the business",
        status: "error",
      });
      onError && onError(error, variables, ...rest);
    },
    ...options,
  });
};

export interface UpdateBusinessVariables
  extends Partial<RegisterBusinessVariables> {
  id: string;
}

export const useUpdateBusiness = (
  props: UseMutationOptions<
    IBusinessResponse,
    Error,
    UpdateBusinessVariables,
    any
  > = {}
) => {
  const { onError, onSuccess, onSettled, ...options } = props;
  const queryClient = useQueryClient();
  const [, setSnackbarData] = useContext(SnackbarContext).snackBarData;

  const updateBusiness = async (data: UpdateBusinessVariables) => {
    if (!data.id) throw new Error("Business ID is required");
    const response = await axios.patch(ROUTES.BUSINESS.ME, data, {
      params: {
        business_id: data.id,
      },
    });
    return response.data;
  };

  return useMutation<IBusinessResponse, Error, UpdateBusinessVariables>({
    mutationFn: updateBusiness,
    onSettled: (data, error, variables, ...rest) => {
      queryClient.invalidateQueries({
        queryKey: API_QUERIES.GET_USER_BUSINESSES,
      });
      onSettled && onSettled(data, error, variables, ...rest);
    },
    onSuccess: (data, variables, ...rest) => {
      setSnackbarData({
        message: "Business updated successfully",
        status: "success",
      });
      onSuccess && onSuccess(data, variables, ...rest);
    },
    onError: (error, variables, ...rest) => {
      setSnackbarData({
        message: "Error in updating the business",
        status: "error",
      });
      onError && onError(error, variables, ...rest);
    },
    ...options,
  });
};

export const useGetBusiness = (business_id?: string | null, enabled = true) => {
  const getBusiness = async ({ queryKey }: QueryFunctionContext) => {
    const [, business_id] = queryKey;
    if (!business_id && typeof business_id !== "string")
      throw new Error("Business ID is required");
    const response = await axios.get(
      ROUTES.BUSINESS.GET(business_id as string)
    );
    return response.data.data;
  };

  return useQuery<IBusinessResponse>({
    queryKey: API_QUERIES.GET_USER_BUSINESS(business_id),
    queryFn: getBusiness,
    staleTime: 1000 * 60 * 5,
    enabled: !!enabled && !!business_id,
  });
};

export interface IBusinessResponse {
  id: string;
  userId: string;
  name: string;
  category: string;
  position: string;
  website: string;
  location?: {
    zipcode: string;
    city: string;
    locality: string;
  }[];
  details?: string;
  summary?: string;
  social_pages?: SocialPageObject[];
  conversation_starter: {
    ad_creative: string;
    post_creative: string;
  };
}
type GetQueryBusinessResponse = IBusinessResponse[];
export const useQueryUserBusiness = () => {
  const queryClient = useQueryClient();

  const getUserBusiness = async () => {
    const response = await axios.get(ROUTES.BUSINESS.ME);
    return response.data.data;
  };

  return useQuery<GetQueryBusinessResponse>({
    queryKey: API_QUERIES.GET_USER_BUSINESSES,
    queryFn: getUserBusiness,
    staleTime: 1000 * 60 * 5,
  });
};

interface UseGetVariantProps {
  ad_id?: string;
  id?: string;
  post_id?: string;
  enabled?: boolean;
}

interface AdVariantWithIdentifiers extends IAdVariant {
  AdCreative: {
    messageId: string;
    conversationId: string;
    id: string;
  };
}

export const useGetVariant = ({
  ad_id,
  id,
  post_id,
  enabled = true,
}: UseGetVariantProps) => {
  const fetchVariant = async ({ queryKey }: QueryFunctionContext) => {
    const [, id, ad_id, post_id] = queryKey;
    const response = await axios.get(ROUTES.VARIANT.GET, {
      params: {
        id: id,
        ad_id: ad_id,
        post_id: post_id,
      },
    });
    return response.data.data;
  };
  return useQuery<AdVariantWithIdentifiers>({
    queryKey: API_QUERIES.GET_VARIANT(id, ad_id, post_id),
    queryFn: fetchVariant,
    enabled: enabled && (!!ad_id || !!id || !!post_id),
  });
};
