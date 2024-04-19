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
