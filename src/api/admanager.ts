import { ROUTES } from "@/config/api-config";
import API_QUERIES from "@/config/api-queries";
import { IFacebookAdInsight, Paging } from "@/interfaces/ISocial";
import { QueryKey, useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { useCredentials } from "./user";

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
}

export const useGetInifiniteCampaigns = (
  props?: UseGetInifiniteCampaignsProps
) => {
  const LIMIT = 4;
  const { accessToken, accountId } = useCredentials();
  //   const { pushCampaignsToState } = useCampaign();

  const fetchCampaigns = async (
    pageParam: undefined | string,
    queryKey: QueryKey
  ) => {
    const [, accountId, accessToken, get_insights] = queryKey;
    const response = await axios.get(ROUTES.CAMPAIGN.QUERY_INFINITE, {
      params: {
        account_id: accountId ?? "act_167093713134679",
        access_token: accessToken,
        limit: LIMIT,
        get_insights: !!get_insights,
        after: pageParam,
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
    queryFn: ({ pageParam, queryKey }: any) =>
      fetchCampaigns(pageParam, queryKey),
    initialPageParam: undefined,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.data.length === 0 || lastPage.data.length < LIMIT)
        return undefined;
      return lastPage.paging.cursors.after;
    },
    getPreviousPageParam: (firstPage, allPages) => {
      if (firstPage.data.length === 0 || firstPage.data.length < LIMIT)
        return undefined;
      return firstPage.paging.cursors.before;
    },
  });
};
