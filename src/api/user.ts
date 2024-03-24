import { ROUTES } from "@/config/api-config";
import API_QUERIES from "@/config/api-queries";
import { IUserAccount, IUserFacebookPost, IUserPage } from "@/interfaces/IUser";
import { Platform, SupportedPlatform, useUser } from "@/context/UserContext";
import {
  Query,
  QueryFunctionContext,
  UseQueryResult,
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { String } from "aws-sdk/clients/acm";
import axios, { AxiosError } from "axios";
import { access } from "fs";
import { ISnackbarData, SnackbarContext } from "@/context/SnackbarContext";
import { use, useCallback, useContext } from "react";
import { IAd, IAdCampaign, IAdSet } from "@/interfaces/ISocial";
import { ZipCodeResponseObject } from "@/components/ArtiBot/MessageItems/Deploy/Ad/components/Adset/Create/SelectZipCodes";
import { useSession } from "next-auth/react";
import { wait } from "@/helpers";
import useCampaignStore from "@/store/campaign";
import { omit } from "lodash";

function getAxiosResponseError(error: any) {
  if (error instanceof Error && error instanceof AxiosError) {
    return error;
  }
  return null;
}

// Axios interceptors
axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    const responseData = error.response?.data;
    if (responseData) {
      if (responseData.error?.fbtrace_id) {
        return Promise.reject({ message: responseData.error.error_user_msg });
      }
      return Promise.reject(error.response?.data);
    }

    return Promise.reject(error);
  }
);

export function useUserPages(
  accessToken?: string | null
): UseQueryResult<IUserPage[], Error> {
  const queryClient = useQueryClient();
  const { setUserPagesData } = useUser();
  const { accessToken: _accessToken } = useCredentials();

  const fetchUserPages = async ({ queryKey, meta }: QueryFunctionContext) => {
    const _accessToken = queryKey[1];
    if (!_accessToken) return null;
    const response = await axios.get(ROUTES.SOCIAL.PAGES, {
      params: {
        access_token: _accessToken,
      },
    });
    //   queryClient.invalidateQueries(API_QUERIES.USER_PAGES);
    setUserPagesData(SupportedPlatform.facebook, response.data.data);
    return response.data.data;
  };

  const query = useQuery<IUserPage[]>({
    queryKey: API_QUERIES.USER_PAGES(_accessToken),
    queryFn: fetchUserPages,
    networkMode: "offlineFirst",
    retry(failureCount, error) {
      if (error instanceof Error && error instanceof AxiosError) {
        return false;
      }
      return failureCount < 3;
    },
  });

  return {
    ...query,
  };
}

export function useGetFacebookPosts(pageId: string, pageAccessToken: string) {
  const queryClient = useQueryClient();

  const fetchFacebookPosts = async ({
    queryKey,
    meta,
  }: QueryFunctionContext) => {
    const response = await axios.get(ROUTES.SOCIAL.FACEBOOK_POSTS, {
      params: {
        page_id: pageId,
        access_token: pageAccessToken,
      },
    });

    if (response.status === 200) {
      // Handle the success case here
      return response.data.data;
    }

    // Handle the error case here
  };

  const query = useQuery<IUserFacebookPost[]>({
    queryKey: API_QUERIES.USER_FACEBOOK_POSTS(pageId, pageAccessToken),
    queryFn: fetchFacebookPosts,
  });

  return {
    ...query,
  };
}

// const response = await axios.post(ROUTES.SOCIAL.POSTS, {
//   post: {
//     url: getNextImageProxyUrl(
//       isImageReady ? imageUrl : selectedVariant.imageUrl!
//     ),
//     message: selectedVariant.text,
//   },
//   page_id: pageId,
//   access_token: pageAccessToken,
//   user_id: "6513be7a09527d141ebc30b8",
//   conversation_id: "6513be7a09527d141ebc30b8",
//   variant_id: "6513be7a09527d141ebc30b8",
//   ad_creative_id: "6513be7a09527d141ebc30b8",
// });

export function useCreatePost() {
  const queryClient = useQueryClient();
  const [, setSnackBarData] = useContext(SnackbarContext).snackBarData;
  const session = useSession();

  const createPost = async ({
    pageId,
    pageAccessToken,
    imageUrl,
    message,
    conversationId,
    variantId,
    adCreativeId,
  }: {
    pageId: string;
    pageAccessToken: string;
    imageUrl: string;
    message: string;
    conversationId: string;
    variantId: string;
    adCreativeId: string;
  }) => {
    const response = await axios.post(
      ROUTES.SOCIAL.FACEBOOK_POSTS,
      {
        post: {
          url: imageUrl,
          message,
        },
        page_id: pageId,
        access_token: pageAccessToken,
        conversation_id: conversationId,
        variant_id: variantId,
        ad_creative_id: adCreativeId,
      },
      {
        headers: {
          Authorization: `Bearer ${(session?.data?.user as any)?.token?.accessToken}`,
        },
      }
    );

    return response.data.data;
  };

  return useMutation({
    mutationKey: API_QUERIES.CREATE_SOCIAL_POST,
    mutationFn: createPost,
    onSuccess: (data) => {
      setSnackBarData({
        message: "Post created successfully!",
        status: "success",
      });
    },
    onError: (error) => {
      setSnackBarData({
        message: error.message ?? "Couldn't create post, Please try again!",
        status: "error",
      });
    },
    retry(failureCount, error) {
      if (error instanceof Error) {
        return false;
      }
      return failureCount < 3;
    },
  });
}

export interface AdAccount {
  name: string;
  id: string;
}

export function useGetAdAccounts(): UseQueryResult<AdAccount[]> {
  const { accessToken } = useCredentials();

  const getAdAccounts = async ({ queryKey }: QueryFunctionContext) => {
    const accessToken = queryKey[1];
    if (!accessToken) throw new Error("Access token is required");
    const response = await axios.get(ROUTES.ADS.GET_AD_ACCOUNTS, {
      params: {
        access_token: accessToken,
      },
    });
    return response.data.data;
  };

  return useQuery<AdAccount[]>({
    queryKey: API_QUERIES.GET_AD_ACCOUNTS(accessToken),
    queryFn: getAdAccounts,
    enabled: !!accessToken,
    retry(failureCount, error) {
      if (!accessToken && failureCount < 10) {
        return true;
      }
      return failureCount < 3;
    },
    retryDelay: (retryCount) => {
      return retryCount * 1000;
    },
    staleTime: 1000 * 60,
  });
}

/**@deprecated */
export function useGetAdAccountId(accessToken: string | null) {
  const getAdAccountId = async ({ queryKey }: QueryFunctionContext) => {
    const accessToken = queryKey[1];
    if (!accessToken) throw new Error("Access token is required");
    const response = await axios.get(ROUTES.ADS.GET_AD_ACCOUNT_ID, {
      params: {
        access_token: accessToken,
      },
    });

    return response.data.data;
  };

  const query = useQuery({
    queryKey: API_QUERIES.GET_AD_ACCOUNT_ID(accessToken),
    queryFn: getAdAccountId,
    staleTime: Infinity,
    enabled: !!accessToken,
    retry(failureCount, error) {
      if (error instanceof Error && error instanceof AxiosError) {
        return false;
      }
      return failureCount < 3;
    },
  });

  return query;
}

export function useGetFacebookUserAccessToken() {
  const { state } = useUser();

  const getFacebookUserAccessToken = async () => {
    if (!state.data?.id) throw new Error("User not found, Please login again!");

    const response = await axios.get(ROUTES.USERS.ACCOUNTS(state.data?.id));
    const facebookAccounts = response.data.filter(
      (c: any) => c.provider === "facebook"
    );
    if (facebookAccounts.length === 0) {
      throw new Error("No Facebook account found");
    }
    const userAccessToken = facebookAccounts[0].access_token;

    if (!userAccessToken) {
      throw new Error("Access token was invalid");
    }

    return userAccessToken;
  };

  return useQuery({
    queryKey: API_QUERIES.GET_FACEBOOK_USER_ACCESS_TOKEN,
    queryFn: getFacebookUserAccessToken,
    retry(failureCount, error) {
      if (error instanceof Error) {
        return false;
      }
      return failureCount < 3;
    },
  });
}

export function useValidateFacebookAccessToken() {
  const [, setSnackBarData] = useContext(SnackbarContext).snackBarData;
  const { setPlatform } = useUser();

  const validateFacebookAccessToken = useCallback(
    async (variables: { accessToken: string }) => {
      const { accessToken } = variables;
      if (!accessToken) throw new Error("Access token is required");
      const response = await axios.post(
        ROUTES.USERS.VALIDATE_FACEBOOK_ACCESS_TOKEN,
        {
          access_token: accessToken,
        }
      );
      return response.data.data;
    },
    []
  );

  return useMutation({
    mutationKey: API_QUERIES.VALIDATE_FACEBOOK_ACCESS_TOKEN,
    mutationFn: validateFacebookAccessToken,
    onError: (error) => {
      setPlatform({ needsLogin: true, userAccessToken: null });
      setSnackBarData({
        message: error.message,
        status: "error",
      });
    },
  });
}

export function useGetFacebookPage({
  accessToken,
  pageId,
  isInView = true,
}: {
  accessToken?: string;
  pageId?: string;
  isInView?: boolean;
}) {
  const { state } = useUser();

  const getFacebookPage = useCallback(
    async ({ queryKey }: QueryFunctionContext) => {
      const [, accessToken, pageId] = queryKey;
      if (!accessToken) throw new Error("Access token is required");
      if (!pageId || typeof pageId !== "string")
        throw new Error("Page id is required and should be string only");
      const response = await axios.get(ROUTES.SOCIAL.FACEBOOK_PAGE(pageId), {
        params: {
          access_token: accessToken,
        },
      });
      return response.data.data;
    },
    []
  );

  return useQuery({
    queryKey: API_QUERIES.GET_FACEBOOK_PAGE(accessToken, pageId),
    queryFn: getFacebookPage,
    staleTime: 1000 * 60 * 60,
    enabled: isInView && !!accessToken && !!pageId,
    retry(failureCount, error) {
      if (error instanceof Error) {
        return false;
      }
      return failureCount < 3;
    },
  });
}

export function useGetVariantPost({
  accessToken,
  postId,
  isInView = true,
}: {
  accessToken?: string;
  postId?: string;
  isInView?: boolean;
}) {
  const getVariantPost = useCallback(
    async ({ queryKey }: QueryFunctionContext) => {
      const [, accessToken, postId] = queryKey;
      if (!accessToken) throw new Error("Access token is required");
      if (!postId || typeof postId !== "string")
        throw new Error("Post id is required and should be string only");
      const response = await axios.get(ROUTES.SOCIAL.FACEBOOK_POST(postId), {
        params: {
          access_token: accessToken,
        },
      });
      return response.data.data;
    },
    []
  );

  return useQuery({
    queryKey: API_QUERIES.GET_FACEBOOK_POST(accessToken, postId),
    queryFn: getVariantPost,
    enabled: isInView && !!accessToken && !!postId,
    staleTime: 1000 * 60 * 5,
    retry(failureCount, error) {
      if (error instanceof Error) {
        return false;
      }
      return failureCount < 3;
    },
  });
}

export function useGetVariantPosts({
  accessToken,
  postIds,
  isInView = true,
}: {
  accessToken?: string;
  postIds?: string[];
  isInView?: boolean;
}) {
  const getVariantPost = useCallback(
    async ({ queryKey }: QueryFunctionContext) => {
      const [, accessToken, postId] = queryKey;
      if (!accessToken) throw new Error("Access token is required");
      if (!postId || typeof postId !== "string")
        throw new Error("Post id is required and should be string only");
      const response = await axios.get(ROUTES.SOCIAL.FACEBOOK_POST(postId), {
        params: {
          access_token: accessToken,
        },
      });
      return response.data.data;
    },
    []
  );

  // return useQuery({
  //   queryKey: API_QUERIES.GET_FACEBOOK_POST(accessToken, postId),
  //   queryFn: getVariantPost,
  //   enabled: !!accessToken && !!postIds,
  //   staleTime: 1000 * 60 * 2,
  // });

  return useQueries({
    queries:
      postIds?.map((postId) => ({
        queryKey: API_QUERIES.GET_FACEBOOK_POST(accessToken, postId),
        queryFn: getVariantPost,
        enabled: isInView && !!accessToken && !!postId,
        staleTime: 1000 * 60 * 5,
      })) ?? [],
    combine: (results) => {
      return {
        data: results.map((r) => r.data),
        pending: results.some((r) => r.isPending),
        fetching: results.some((r) => r.isFetching),
        isEnabled: results.length > 0,
      };
    },
  });
}

export function useGetUserProviders() {
  const { state } = useUser();

  const getUserProviders = async ({ queryKey }: QueryFunctionContext) => {
    const userId = queryKey[1];
    if (!userId || typeof userId !== "string")
      throw new Error("User not found, Please login again!");
    const response = await axios.get(ROUTES.USERS.ACCOUNTS(userId));
    return response.data;
  };

  return useQuery({
    queryKey: API_QUERIES.GET_USER_ACCOUNTS(state.data?.id),
    queryFn: getUserProviders,
    retry(failureCount, error) {
      if (!state.data?.id && failureCount < 10) {
        return true;
      }
      return failureCount < 3;
    },
    retryDelay: (retryCount) => {
      return retryCount * 1000;
    },
  });
}

export function useLinkAccount() {
  const { state } = useUser();
  const queryClient = useQueryClient();
  const [, setSnackBarData] = useContext(SnackbarContext).snackBarData;

  const linkAccount = useCallback(
    async (variables: { account: IUserAccount }) => {
      const { account } = variables;
      if (!state.data?.id)
        throw new Error("User not found, Please login again!");
      const response = await axios.post(
        ROUTES.USERS.LINK_ACCOUNT(state.data?.id),
        {
          account,
        }
      );
      return response.data;
    },
    [state.data?.id]
  );

  return useMutation({
    mutationKey: API_QUERIES.LINK_ACCOUNT(state.data?.id),
    mutationFn: linkAccount,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: API_QUERIES.GET_USER_ACCOUNTS(state.data?.id),
      });
      setSnackBarData({
        message: "Account linked successfully!",
        status: data.ok ? "success" : "error",
      });
    },
    onError: (error) => {
      console.log("error - ", error);
      setSnackBarData({
        message: error.message ?? "An error occurred!",
        status: "error",
      });
    },
  });
}

export function useGetCampaigns(): UseQueryResult<IAdCampaign[], Error> {
  const { accessToken, accountId, isFetching } = useCredentials();

  const getCampaigns = async ({ queryKey }: QueryFunctionContext) => {
    const [, accessToken, accountId] = queryKey;
    if (!accessToken) throw new Error("Access token is required");
    if (!accountId) throw new Error("Account id is required");
    const response = await axios.get(ROUTES.ADS.CAMPAIGNS, {
      params: {
        access_token: accessToken,
        account_id: accountId,
      },
    });
    return response.data.data;
  };

  const query = useQuery<IAdCampaign[]>({
    queryKey: API_QUERIES.GET_CAMPAIGNS(accessToken, accountId),
    queryFn: getCampaigns,
    enabled: !!accessToken && !!accountId,
    retry(failureCount, error) {
      if (error instanceof Error && error instanceof AxiosError) {
        return false;
      }
      return failureCount < 3;
    },
  });

  return {
    ...query,
    isFetching: isFetching || query.isFetching,
  };
}

export function useGetAdSets({
  campaignIds,
}: {
  campaignIds?: string[] | null;
}): UseQueryResult<IAdSet[], Error> {
  const { accessToken, accountId, isFetching } = useCredentials();
  const getAdSets = async ({ queryKey }: QueryFunctionContext) => {
    const [, accessToken, accountId, campaignIds] = queryKey;
    if (!accessToken) throw new Error("Access token is required");
    if (!accountId) throw new Error("Account id is required");
    if (!campaignIds) throw new Error("Campaign id is required");
    const response = await axios.get(ROUTES.ADS.ADSETS, {
      params: {
        access_token: accessToken,
        account_id: accountId,
        campaign_ids: campaignIds,
        get_insights: true,
      },
    });
    return response.data.data;
  };

  const query = useQuery({
    queryKey: API_QUERIES.GET_ADSETS(accessToken, accountId, campaignIds),
    queryFn: getAdSets,
    enabled: !!accessToken && !!accountId && !!campaignIds,
    retry(failureCount, error) {
      if (error instanceof Error && error instanceof AxiosError) {
        return false;
      }
      return failureCount < 3;
    },
  });

  return {
    ...query,
    isFetching: isFetching || query.isFetching,
  };
}

export function useGetAdSet({
  adsetId,
  enabled,
}: {
  adsetId?: string;
  enabled?: boolean;
}): UseQueryResult<IAdSet, Error> {
  const { accessToken } = useCredentials();
  const getAdSet = async ({ queryKey }: QueryFunctionContext) => {
    const [, accessToken, adsetId] = queryKey;
    if (!accessToken) throw new Error("Access token is required");
    if (!adsetId) throw new Error("Ad set id is required");
    const response = await axios.get(ROUTES.ADS.ADSET(adsetId as string), {
      params: {
        access_token: accessToken,
        get_insights: true,
      },
    });
    return response.data.data;
  };

  const query = useQuery({
    queryKey: API_QUERIES.GET_ADSET(accessToken, adsetId),
    queryFn: getAdSet,
    enabled: enabled && !!accessToken && !!adsetId,
    retry(failureCount, error) {
      if (error instanceof Error && error instanceof AxiosError) {
        return false;
      }
      return failureCount < 3;
    },
  });

  return query;
}

export function useGetAds({
  adsetIds,
}: {
  adsetIds?: string[] | null;
}): UseQueryResult<IAd[], Error> {
  const { accessToken, accountId, isFetching } = useCredentials();
  const getAds = async ({ queryKey }: QueryFunctionContext) => {
    const [, accessToken, accountId, adsetIds] = queryKey;
    if (!accessToken) throw new Error("Access token is required");
    if (!accountId) throw new Error("Account id is required");
    if (!adsetIds) throw new Error("Ad set id is required");
    const response = await axios.get(ROUTES.ADS.AD_ENTITIES, {
      params: {
        access_token: accessToken,
        account_id: accountId,
        adset_ids: adsetIds,
        get_insights: true,
      },
    });
    return response.data.data;
  };

  const query = useQuery({
    queryKey: API_QUERIES.GET_ADS(accessToken, accountId, adsetIds),
    queryFn: getAds,
    enabled: !!accessToken && !!accountId && !!adsetIds,
    retry(failureCount, error) {
      if (error instanceof Error && error instanceof AxiosError) {
        return false;
      }
      return failureCount < 3;
    },
  });

  return {
    ...query,
    isFetching: isFetching || query.isFetching,
  };
}

export interface ICreateCampaign {
  name: string;
  objective: string;
  status: string;
}
export const useCreateCampaign = () => {
  const queryClient = useQueryClient();
  const [, setSnackBarData] = useContext(SnackbarContext).snackBarData;
  const { accessToken, accountId } = useCredentials();

  const createCampaign = async ({
    campaign,
  }: {
    campaign: ICreateCampaign;
  }) => {
    if (!accessToken) throw new Error("Access token is required");
    const response = await axios.post(ROUTES.ADS.CAMPAIGNS, campaign, {
      params: {
        access_token: accessToken,
        account_id: accountId,
      },
    });

    return response.data.data;
  };

  return useMutation({
    mutationKey: API_QUERIES.CREATE_CAMPAIGN,
    mutationFn: createCampaign,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: API_QUERIES.GET_CAMPAIGNS(accessToken, accountId),
      });
      setSnackBarData({
        message: "Campaign created successfully!",
        status: "success",
      });
    },
    onError: (error) => {
      setSnackBarData({
        message: error.message ?? "Couldn't create campaign, Please try again!",
        status: "error",
      });
    },
    retry(failureCount, error) {
      if (error instanceof Error) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

export const useUpdateCampaign = () => {
  const queryClient = useQueryClient();
  const [, setSnackBarData] = useContext(SnackbarContext).snackBarData;

  const { accessToken, accountId } = useCredentials();

  const updateCampaign = async ({
    campaignId,
    campaign,
    errorMessage,
    successMessage,
  }: {
    campaignId: string;
    campaign: Partial<ICreateCampaign>;
    successMessage?: string;
    errorMessage?: string;
  }) => {
    if (!accessToken) throw new Error("Access token is required");
    if (!accountId) throw new Error("Account id is required");
    const response = await axios.patch(
      ROUTES.ADS.CAMPAIGN(campaignId),
      campaign,
      {
        params: {
          access_token: accessToken,
          account_id: accountId,
        },
      }
    );

    return response.data;
  };

  return useMutation({
    mutationKey: API_QUERIES.UPDATE_CAMPAIGN(accountId, accessToken),
    mutationFn: updateCampaign,
    onSuccess: (data, variables) => {
      setSnackBarData({
        message: variables.successMessage ?? "Campaign updated successfully!",
        status: data.ok ? "success" : "error",
      });
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({
        queryKey: API_QUERIES.GET_CAMPAIGNS(accessToken, accountId),
      });
    },
    onError: (error, variables) => {
      setSnackBarData({
        message:
          variables.errorMessage ??
          error.message ??
          "Couldn't update campaign, Please try again!",
        status: "error",
      });
    },
  });
};

export interface ICreateAdset {
  name: string;
  daily_budget: number;
  bid_amount: number;
  billing_event: string;
  optimization_goal: string;
  status: string;
  campaign_id: string;
  bid_strategy: string;
  start_time: string;
  end_time: string;
  targeting?: {
    age_min?: number;
    age_max?: number;
    geo_locations?: {
      countries: string[];
      regions: string[];
    };
    device_platforms?: string[];
    facebook_positions?: string[];
    publisher_platforms?: string[];
    flexible_spec?: any;
  };
  promoted_object?: {
    application_id?: string;
    object_store_url?: string;
    product_catalog_id?: string;
  };
}

export const useCreateAdset = () => {
  const queryClient = useQueryClient();
  const [, setSnackBarData] = useContext(SnackbarContext).snackBarData;

  const { accessToken, accountId } = useCredentials();

  const createAdset = async ({ adset }: { adset: ICreateAdset }) => {
    if (!accessToken) throw new Error("Access token is required");
    if (!accountId) throw new Error("Account id is required");
    const response = await axios.post(ROUTES.ADS.ADSETS, adset, {
      params: {
        access_token: accessToken,
        account_id: accountId,
      },
    });

    return response.data.data;
  };

  return useMutation({
    mutationKey: API_QUERIES.CREATE_ADSET,
    mutationFn: createAdset,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        predicate: (query: Query) => {
          const cond =
            query.queryKey[0] === API_QUERIES.GET_ADSETS()[0] &&
            query.queryKey[1] === accessToken &&
            query.queryKey[2] === accountId &&
            (query.queryKey[3] === null ||
              query.queryKey[3] === undefined ||
              (query.queryKey[3] as string[]).includes(
                variables.adset.campaign_id
              ) ||
              (query.queryKey[3] as string[])?.length === 0);
          return cond;
        },
      });
      setSnackBarData({
        message: "Adset created successfully!",
        status: "success",
      });
    },
    onError: (error) => {
      setSnackBarData({
        message: error.message ?? "Couldn't create adset, Please try again!",
        status: "error",
      });
    },
  });
};

interface MutateSnackbarData {
  status?: ISnackbarData["status"];
  message?: string;
}

interface MutateParams {
  onSuccess?: {
    snackbarData?: MutateSnackbarData;
    fn?: (data: any, variables: any) => void;
  };
  onError?: {
    snackbarData?: MutateSnackbarData;
    fn?: (error: any, variables: any) => void;
  };
}

export const useUpdateAdset = () => {
  const queryClient = useQueryClient();
  const [, setSnackBarData] = useContext(SnackbarContext).snackBarData;

  const { accessToken, accountId } = useCredentials();

  const updateAdset = async ({
    adsetId,
    adset,
  }: {
    adsetId: string;
    adset: Partial<ICreateAdset>;
  } & MutateParams) => {
    if (!accessToken) throw new Error("Access token is required");
    if (!accountId) throw new Error("Account id is required");
    const response = await axios.patch(ROUTES.ADS.ADSET(adsetId), adset, {
      params: {
        access_token: accessToken,
        account_id: accountId,
      },
    });

    return response.data;
  };

  return useMutation({
    mutationKey: API_QUERIES.UPDATE_ADSET(accountId, accessToken),
    mutationFn: updateAdset,
    onSuccess: (data, variables) => {
      if (!data.ok) {
        throw new Error("Couldn't update adset, Please try again!");
      }
      if (variables.onSuccess?.fn)
        return variables.onSuccess?.fn?.(data, variables);
      setSnackBarData({
        message: "Adset updated successfully!",
        status: "success",
        ...(variables.onSuccess?.snackbarData ?? {}),
      });
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({
        predicate: (query: Query) => {
          const cond =
            query.queryKey[0] === API_QUERIES.GET_ADSETS()[0] &&
            query.queryKey[1] === accessToken &&
            query.queryKey[2] === accountId &&
            (!variables.adset.campaign_id ||
              query.queryKey[3] === null ||
              query.queryKey[3] === undefined ||
              (query.queryKey[3] as string[]).includes(
                variables.adset.campaign_id
              ) ||
              (query.queryKey[3] as string[])?.length === 0);
          return !!cond;
        },
      });
    },
    onError: (error, variables) => {
      if (variables.onError?.fn)
        return variables.onError?.fn?.(error, variables);
      setSnackBarData({
        message: error.message ?? "Couldn't update adset, Please try again!",
        status: "error",
        ...(variables.onError?.snackbarData ?? {}),
      });
    },
  });
};

interface ICreateAd {
  name: string;
  status: string;
  adsetId: string;
  campaignId: string;
  creativeId?: string;
}

interface ICreateAdCreative {
  ad_creative: {
    name: string;
    call_to_action_type: string;
    message: string;
  };
  imageHash?: string;
  pageId: string;
}

export const useCreateAd = () => {
  const queryClient = useQueryClient();
  const [, setSnackBarData] = useContext(SnackbarContext).snackBarData;
  const { accessToken, accountId } = useCredentials();

  const createAd = async ({
    ad,
    adCreativeData,
    imageUrl,
  }: {
    ad: ICreateAd;
    adCreativeData: ICreateAdCreative;
    imageUrl: string | File;
  }) => {
    if (!accessToken) throw new Error("Access token is required");
    if (!accountId) throw new Error("Account id is required");

    const formData = new FormData();
    formData.append("imageUrl", imageUrl);

    const uploadImageresponse = await axios.post(
      ROUTES.ADS.ADIMAGES,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        params: {
          access_token: accessToken,
          account_id: accountId,
        },
      }
    );

    const imageHash = uploadImageresponse.data.data;

    const adCreativeResponse = await axios.post(
      ROUTES.ADS.ADCREATIVES,
      {
        ad_creative: adCreativeData.ad_creative,
        image_hash: imageHash,
        page_id: adCreativeData.pageId,
      },
      {
        params: {
          access_token: accessToken,
          account_id: accountId,
        },
      }
    );

    const adCreativeId = adCreativeResponse.data.data;

    const response = await axios.post(
      ROUTES.ADS.AD_ENTITIES,
      {
        ...ad,
        creativeId: adCreativeId,
      },
      {
        params: {
          access_token: accessToken,
          account_id: accountId,
        },
      }
    );

    return response.data;
  };

  return useMutation({
    mutationKey: API_QUERIES.CREATE_AD,
    mutationFn: createAd,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        predicate: (query: Query) => {
          const cond =
            query.queryKey[0] === API_QUERIES.GET_ADS()[0] &&
            query.queryKey[1] === accessToken &&
            query.queryKey[2] === accountId &&
            (query.queryKey[3] === null ||
              query.queryKey[3] === undefined ||
              (query.queryKey[3] as string[]).includes(variables.ad.adsetId) ||
              (query.queryKey[3] as string[])?.length === 0);
          return cond;
        },
      });
      setSnackBarData({
        message: "Ad created successfully!",
        status: "success",
      });
    },
    onError: (error) => {
      setSnackBarData({
        message: error.message ?? "Couldn't create ad, Please try again!",
        status: "error",
      });
    },
  });
};

export const useUpdateAd = () => {
  const queryClient = useQueryClient();
  const [, setSnackBarData] = useContext(SnackbarContext).snackBarData;

  const { accessToken, accountId } = useCredentials();

  const updateAd = async ({
    adId,
    ad,
  }: {
    adId: string;
    ad: { adsetId: string } & Partial<ICreateAd>;
    successMessage?: string;
    errorMessage?: string;
  } & MutateParams) => {
    if (!accessToken) throw new Error("Access token is required");
    if (!accountId) throw new Error("Account id is required");

    const response = await axios.patch(ROUTES.ADS.AD(adId), ad, {
      params: {
        access_token: accessToken,
        account_id: accountId,
      },
    });

    return response.data;
  };

  return useMutation({
    mutationKey: API_QUERIES.UPDATE_AD(accountId, accessToken),
    mutationFn: updateAd,
    onSuccess: (data, variables) => {
      if (!data.ok) {
        throw new Error("Couldn't update ad, Please try again!");
      }
      if (variables.onSuccess?.fn)
        return variables.onSuccess?.fn?.(data, variables);
      setSnackBarData({
        message: "Ad updated successfully!",
        status: "success",
        ...(variables.onSuccess?.snackbarData ?? {}),
      });
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({
        predicate: (query: Query) => {
          const cond =
            query.queryKey[0] === API_QUERIES.GET_ADS()[0] &&
            query.queryKey[1] === accessToken &&
            query.queryKey[2] === accountId &&
            (query.queryKey[3] === null ||
              query.queryKey[3] === undefined ||
              (query.queryKey[3] as string[]).includes(variables.ad.adsetId) ||
              (query.queryKey[3] as string[])?.length === 0);
          return cond;
        },
      });
    },
    onError: (error, variables) => {
      if (variables.onError?.fn)
        return variables.onError?.fn?.(error, variables);
      setSnackBarData({
        message: error.message ?? "Couldn't update ad, Please try again!",
        status: "error",
        ...(variables.onError?.snackbarData ?? {}),
      });
    },
  });
};

interface Country {
  iso2: string;
  lat: number;
  long: number;
  name: string;
}

type Countries = ({ uid: string } & Country)[];

type CountryResponse = Country[];
export const useGetCountries = () => {
  const getCountries = async () => {
    const response = await axios.get(ROUTES.LOCATION.GET_ALL_COUNTRIES);

    const countries: CountryResponse = response.data.data;

    const countryArr = countries.map((country) => {
      return {
        ...country,
        uid: country.iso2,
      };
    });

    return countryArr;
  };

  return useQuery<Countries>({
    queryKey: API_QUERIES.GET_ALL_COUNTRIES,
    queryFn: getCountries,
    retry(failureCount, error) {
      if (error instanceof Error) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

export const useGetZipCodes = (
  zipCode: string,
  initialData?: any
): UseQueryResult<ZipCodeResponseObject[]> => {
  const { accessToken } = useCredentials();
  const getZipCodes = async ({ queryKey }: QueryFunctionContext) => {
    const [, zipCode, accessToken] = queryKey;
    const response = await axios.get(ROUTES.LOCATION.ZIPCODE, {
      params: {
        zip_code: zipCode,
        access_token: accessToken,
      },
    });

    return response.data.data;
  };

  console.log("zipCode - ", zipCode, accessToken);

  return useQuery<ZipCodeResponseObject[]>({
    queryKey: API_QUERIES.GET_ZIP_CODES(zipCode, accessToken),
    queryFn: getZipCodes,
    enabled: zipCode.length > 0 && !!accessToken,
    retry(failureCount, error) {
      if (error instanceof Error) {
        return false;
      }
      return failureCount < 3;
    },
    placeholderData: initialData,
  });
};

interface IInterestsResponseObject {
  id: string;
  name: string;
  audience_size_lower_bound: number;
  audience_size_upper_bound: number;
  path: string[];
  type: string;
  initial?: boolean;
}
export const useGetInterests = (
  query: string,
  initialData?: any
): UseQueryResult<IInterestsResponseObject[]> => {
  const { accessToken, accountId } = useCredentials();

  const getInterests = async ({ queryKey }: QueryFunctionContext) => {
    const [, query, accountId, accessToken] = queryKey;
    const response = await axios.get(ROUTES.ADS.INTERESTS, {
      params: {
        account_id: accountId,
        access_token: accessToken,
        query,
      },
    });

    return response.data.data;
  };

  return useQuery<IInterestsResponseObject[]>({
    queryKey: API_QUERIES.GET_INTERESTS(query, accountId, accessToken),
    queryFn: getInterests,
    enabled: query.length > 0 && !!accountId && !!accessToken,
    retry(failureCount, error) {
      if (error instanceof Error) {
        return false;
      }
      return failureCount < 3;
    },
    placeholderData: initialData,
  });
};

export const useCredentials = () => {
  const { state } = useUser();
  const accessToken = Platform.getPlatform(
    state.data?.facebook
  ).userAccessToken;
  const { selectedAccountId } = useCampaignStore();
  return {
    accessToken,
    accountId: selectedAccountId,
    /**@deprecated */
    isFetching: false,
  };
};

export const useAdImageUpload = () => {
  const { accessToken, accountId } = useCredentials();
  const [, setSnackBarData] = useContext(SnackbarContext).snackBarData;
  const uploadImage = async ({ imageBytes }: { imageBytes: any }) => {
    const response = await axios.post(
      ROUTES.ADS.ADIMAGES,
      { bytes: imageBytes, access_token: accessToken },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data["images"]["bytes"]["hash"];
  };

  return useMutation({
    mutationKey: API_QUERIES.UPLOAD_AD_IMAGE(accountId, accessToken),
    mutationFn: uploadImage,
    retry(failureCount, error) {
      if (error instanceof Error) {
        return false;
      }
      return failureCount < 3;
    },
    onError: (error) => {
      setSnackBarData({
        message: error.message ?? "Couldn't upload the image for the Ad!",
        status: "error",
      });
    },
  });
};

export const useCreateFacebookAdCreative = () => {
  const { accessToken, accountId } = useCredentials();
  const [, setSnackBarData] = useContext(SnackbarContext).snackBarData;
  const createFacebookAdCreative = async ({
    adCreative,
    imageHash,
    pageId,
  }: {
    adCreative: any;
    imageHash: string;
    pageId: string;
  }) => {
    const response = await axios.post(ROUTES.ADS.ADCREATIVES, {
      ad_creative: adCreative,
      image_hash: imageHash,
      account_id: accountId,
      access_token: accessToken,
      page_id: pageId,
    });

    return response.data["id"];
  };

  return useMutation({
    mutationKey: API_QUERIES.CREATE_FACEBOOK_AD_CREATIVE(
      accountId,
      accessToken
    ),
    mutationFn: createFacebookAdCreative,
    retry(failureCount, error) {
      if (error instanceof Error) {
        return false;
      }
      return failureCount < 3;
    },
    onError: (error) => {
      setSnackBarData({
        message: error.message ?? "Couldn't create the Ad Creative!",
        status: "error",
      });
    },
  });
};
