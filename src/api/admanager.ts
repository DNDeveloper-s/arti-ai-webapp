import { AD_MANAGER_ITEM, ROUTES } from "@/config/api-config";
import API_QUERIES from "@/config/api-queries";
import { IFacebookAdInsight, Paging } from "@/interfaces/ISocial";
import {
  QueryFunctionContext,
  QueryKey,
  UseMutationOptions,
  useInfiniteQuery,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import axios from "axios";
import { useCredentials } from "./user";
import { useTimeRange } from "@/context/TimeRangeContext";
import { AdLeadData, LeadData, prepareTimeRange } from "./conversation";
import { useContext } from "react";
import { SnackbarContext } from "@/context/SnackbarContext";

export interface ICampaignInfinite {
  id: string;
  name: string;
  status: string;
  effective_status: string;
  objective: string;
  insights: {
    data: IFacebookAdInsight[];
    paging: Paging;
  };
}

interface GetCampaignsInifiniteResponse {
  data: ICampaignInfinite[];
  paging: Paging;
}

interface UseGetInifiniteCampaignsProps {
  get_insights?: boolean;
  campaign_id?: string | null;
}

export const useGetInifiniteCampaigns = (
  props?: UseGetInifiniteCampaignsProps
) => {
  const LIMIT = 4;
  const { accessToken, accountId } = useCredentials();
  //   const { pushCampaignsToState } = useCampaign();

  const fetchCampaigns = async (
    pageParam: undefined | any,
    queryKey: QueryKey,
    direction: "forward" | "backward" = "forward"
  ) => {
    const [, accountId, accessToken, get_insights] = queryKey;

    const paginationKey = pageParam.initial
      ? "campaign_ids"
      : direction === "forward"
        ? "after"
        : "before";

    const response = await axios.get(ROUTES.CAMPAIGN.QUERY_INFINITE, {
      params: {
        account_id: accountId ?? "act_167093713134679",
        access_token: accessToken,
        limit: LIMIT,
        get_insights: !!get_insights,
        [paginationKey]: pageParam.id
          ? pageParam.initial
            ? [pageParam.id]
            : pageParam.id
          : undefined,
      },
    });

    // pushCampaignsToState(response.data.data ?? []);

    return response.data.data;
  };

  return useInfiniteQuery<GetCampaignsInifiniteResponse>({
    queryKey: API_QUERIES.GET_INFINITE_CAMPAIGNS(
      accountId,
      accessToken,
      props?.get_insights
    ),
    queryFn: ({ pageParam, queryKey, direction }: any) =>
      fetchCampaigns(pageParam, queryKey, direction),
    initialPageParam: { id: props?.campaign_id, initial: true },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.data.length === 0) return undefined;
      return { id: lastPage.paging.cursors.after, initial: false };
    },
    getPreviousPageParam: (firstPage, allPages) => {
      if (firstPage.data.length === 0) return undefined;
      return { id: firstPage.paging.cursors.before, initial: false };
    },
  });
};

interface LeadsDataResponse {
  campaigns: AdLeadData[];
  adsets: AdLeadData[];
  ad_entities: LeadData[];
}

interface GetLeadsDataResponse<T extends AD_MANAGER_ITEM> {
  data: LeadsDataResponse[T];
}

interface GetLeadsDataVariables<T extends AD_MANAGER_ITEM> {
  type: T;
  id: string;
}

export const useFetchLeadsData = <T extends AD_MANAGER_ITEM>(
  options?: Omit<
    UseMutationOptions<
      GetLeadsDataResponse<T>,
      Error,
      GetLeadsDataVariables<T>
    >,
    "mutationFn"
  >
) => {
  const { accessToken } = useCredentials();
  const { timeRange } = useTimeRange();
  const parsedTimeRange = prepareTimeRange(timeRange);
  const [, setSnackbarData] = useContext(SnackbarContext).snackBarData;

  const queryLeadsData = async (variables: GetLeadsDataVariables<T>) => {
    const { type, id } = variables;
    if (type === undefined || id === undefined)
      return console.error("Type or Id is undefined");
    const response = await axios.get(
      ROUTES.MARKETING.LEADS(type as AD_MANAGER_ITEM, id as string),
      {
        params: {
          time_range: parsedTimeRange,
          access_token: accessToken,
        },
      }
    );
    return response.data.data;
  };

  return useMutation<GetLeadsDataResponse<T>, Error, GetLeadsDataVariables<T>>({
    mutationFn: queryLeadsData,
    onError: (error, variables) => {
      setSnackbarData({
        message: error?.message ?? "Error in fetching Lead Data",
        status: "error",
      });
    },
    ...options,
  });
};

const map = {
  id: "6610e2dda5a15cb890b0c8d6",
  adId: "120207183720600340",
  adAccountId: "act_167093713134679",
  accessToken:
    "EAAJKrtHx2ZB8BO61SJb8b5KLTNV6EqF6Y7VdyrL5qWBFlxpv8rRzCa01BpZBZBLQN4u9xSEog5vVkASupddTPUZBOhMLCAOvFCLu82jt7GmwwZChzEqkY0ZCtI4nd9oMthReTvKTtgfCmHujfWScKUV6ISjKZAeG8rV0PC4PFXyfzflNiFOWFe4uf4r",
  userId: "66040baff5ac2361ea74a338",
  variantId: "6610e227211119401c79b48c",
  adCreativeId: "6610e227211119401c79b48b",
  messageId: "6610e227211119401c79b48a",
  conversationId: "6610e227211119401c79b489",
  adsetId: "120207183720570340",
  campaignId: null,
  adsetRecordId: "6610e2dda5a15cb890b0c8d5",
};

interface AdIdentifierMap {
  id: string;
  adId: string;
  adAccountId: string;
  accessToken: string;
  userId: string;
  variantId: string;
  adCreativeId: string;
  messageId: string;
  conversationId: string;
  adsetId: string;
  campaignId: string;
  adsetRecordId: string;
}

interface UseGetAdIdentifiersOptions {
  ad_id?: string | null;
  enabled?: boolean;
}
export const useGetAdIdentifiers = ({
  ad_id,
  enabled,
}: UseGetAdIdentifiersOptions) => {
  const getAdIdentifiers = async ({ queryKey }: QueryFunctionContext) => {
    const [, ad_id] = queryKey;
    if (!ad_id && typeof ad_id !== "string") {
      throw new Error("Ad Id is required");
    }

    const response = await axios.get(
      ROUTES.AD.GET_IDENTIFIERS(ad_id as string)
    );

    return response.data.data;
  };
  return useQuery<AdIdentifierMap>({
    queryKey: API_QUERIES.GET_AD_IDENTIFIERS(ad_id),
    queryFn: getAdIdentifiers,
    enabled: enabled && !!ad_id,
  });
};
