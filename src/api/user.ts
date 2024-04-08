import { ROUTES } from "@/config/api-config";
import API_QUERIES from "@/config/api-queries";
import {
  IUserAccount,
  IUserFacebookPost,
  IUserPage,
  UserSettingsToUpdate,
} from "@/interfaces/IUser";
import { Platform, SupportedPlatform, useUser } from "@/context/UserContext";
import {
  Query,
  QueryFunctionContext,
  UseMutationResult,
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
import { getSession, signIn, useSession } from "next-auth/react";
import { wait } from "@/helpers";
import useCampaignStore from "@/store/campaign";
import { omit } from "lodash";
import { getServerSession } from "next-auth";
import { RedirectType, redirect } from "next/navigation";

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

axios.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    // try {
    //   const response = await fetch("/api/auth/session");
    //   const session = await response.json();
    //   console.log("session from axios interceptor - ", session);
    // } catch (e) {
    //   console.log(
    //     "error in fetching the session from axios interceptors - ",
    //     e
    //   );
    // }
    const tokenObj = session?.user.token;
    let token = tokenObj?.accessToken;

    // Check for the expiration of the tokenObj
    // which has exp property containing the timestamp in unix
    const isTokenExpired = !tokenObj?.exp || tokenObj?.exp * 1000 < Date.now();

    if (!token || isTokenExpired) {
      // await signIn();
      // const session = await getSession();
      // const tokenObj = session?.user.token;
      // token = tokenObj?.accessToken;
      // if (!token) {
      //   return redirect("/auth", RedirectType.push);
      // }
    }
    // const token = localStorage.getItem("accessToken");
    // if (token) {
    // config.headers.Authorization = `Bearer ${token}`;
    // decode the token and check if (token.exp < Date.now() / 1000)
    // if (isTokenExpired(token)) {
    // Call your refresh token endpoint
    // you have to implement an endpoint to get the refresh token
    // if you use 3rd party auth servers, you make requests to their /refreh enpoints
    // const newToken = await refreshToken();
    // if (newToken) {
    // Token refreshed, update the Authorization header with the new token
    // config.headers.Authorization = `Bearer ${newToken}`;
    // Retry the original request
    // }
    // }
    // }
    // }
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
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
  const getFacebookUserAccessToken = async () => {
    const response = await axios.get(ROUTES.USERS.ACCOUNTS);
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

export interface IUserProvider {
  id: string;
  provider: string;
  type: string;
  name: string;
  image: string;
  email: string;
  emailVerified: boolean;
  providerAccountId: string;
  refresh_token: string;
  access_token: string;
  expires_at: number;
  token_type: string;
  scope: string;
  id_token: string;
  session_state: string;
  createdAt: string;
  updatedAt: string;
}

type GetUserProvidersResponse = IUserProvider[];

export function useGetUserProviders() {
  const { state } = useUser();

  const getUserProviders = async ({ queryKey }: QueryFunctionContext) => {
    const response = await axios.get(ROUTES.USERS.ACCOUNTS);
    return response.data;
  };

  return useQuery<GetUserProvidersResponse>({
    queryKey: API_QUERIES.GET_USER_ACCOUNTS,
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
    staleTime: 1000 * 60 * 15,
  });
}

export function useLinkAccount() {
  const queryClient = useQueryClient();
  const [, setSnackBarData] = useContext(SnackbarContext).snackBarData;

  const linkAccount = useCallback(
    async (variables: { account: IUserAccount }) => {
      const { account } = variables;
      const response = await axios.post(ROUTES.USERS.LINK_ACCOUNT, {
        account,
      });
      return response.data;
    },
    []
  );

  return useMutation({
    mutationKey: API_QUERIES.LINK_ACCOUNT,
    mutationFn: linkAccount,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: API_QUERIES.GET_USER_ACCOUNTS,
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
  enabled = true,
}: {
  campaignIds?: string[] | null;
  enabled?: boolean;
}): UseQueryResult<IAdSet[], Error> {
  const { accessToken, accountId, isFetching } = useCredentials();
  console.log(
    " enabled && !!accessToken && !!accountId && !!campaignIds - ",
    enabled,
    !!accessToken,
    !!accountId,
    !!campaignIds
  );
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
    enabled: enabled && !!accessToken && !!accountId && !!campaignIds,
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
  enabled = true,
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
  campaignIds,
  adIds,
  enabled = true,
  accountId,
}: {
  campaignIds?: string[] | null;
  adsetIds?: string[] | null;
  adIds?: string[] | null;
  enabled?: boolean;
  accountId?: string | null;
}): UseQueryResult<IAd[], Error> {
  const { accessToken, accountId: defaultAccountId } = useCredentials();
  const getAds = async ({ queryKey }: QueryFunctionContext) => {
    const [, accessToken, accountId, adsetIds, campaignIds, adIds] = queryKey;
    if (!accessToken) throw new Error("Access token is required");
    if (!accountId) throw new Error("Account id is required");
    const response = await axios.get(ROUTES.ADS.AD_ENTITIES, {
      params: {
        access_token: accessToken,
        account_id: accountId,
        adset_ids: adsetIds,
        campaign_ids: campaignIds,
        ad_ids: adIds,
        get_insights: true,
      },
    });
    return response.data.data;
  };

  const _accountId = accountId ?? defaultAccountId;

  return useQuery({
    queryKey: API_QUERIES.GET_ADS(
      accessToken,
      _accountId,
      adsetIds,
      campaignIds,
      adIds
    ),
    queryFn: getAds,
    enabled: !!enabled && !!accessToken && !!_accountId,
    retry(failureCount, error) {
      if (error instanceof Error && error instanceof AxiosError) {
        return false;
      }
      return failureCount < 3;
    },
  });
}

export interface ICreateCampaign {
  name: string;
  objective: string;
  status: string;
  conversation_id: string;
}
export interface CreateCampaignResponse {
  accessToken: string;
  adAccountId: string;
  campaignId: string;
  conversationId: string;
  /** @description This is the mongoDB Id */
  id: string;
  userId: string;
}
export const useCreateCampaign = (): UseMutationResult<
  CreateCampaignResponse,
  Error,
  { campaign: ICreateCampaign }
> => {
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

interface CreateAdsetResponse {
  id: string;
  adsetId: string;
  adAccountId: string;
  accessToken: string;
  userId: string;
  conversationId: string;
  adCreativeId: string;
  campaignId: string;
  campaignRecordId: string;
}

export const useCreateAdset = (): UseMutationResult<
  CreateAdsetResponse,
  Error,
  { adset: ICreateAdset }
> => {
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
    imageUrl?: string | File;
  }) => {
    if (!accessToken) throw new Error("Access token is required");
    if (!accountId) throw new Error("Account id is required");

    const formData = new FormData();
    imageUrl && formData.append("imageUrl", imageUrl);

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

const locations = [
  {
    key: "IN",
    name: "India",
    type: "country",
    country_code: "IN",
    country_name: "India",
    supports_region: true,
    supports_city: true,
  },
  {
    key: "1025279",
    name: "Gaya",
    type: "city",
    country_code: "IN",
    country_name: "India",
    region: "Bihar",
    region_id: 1752,
    supports_region: true,
    supports_city: true,
  },
  {
    key: "1038870",
    name: "Patiala",
    type: "city",
    country_code: "IN",
    country_name: "India",
    region: "Punjab region",
    region_id: 1742,
    supports_region: true,
    supports_city: true,
  },
  {
    key: "1041825",
    name: "Salem",
    type: "city",
    country_code: "IN",
    country_name: "India",
    region: "Tamil Nadu",
    region_id: 1744,
    supports_region: true,
    supports_city: true,
  },
  {
    key: "1029800",
    name: "Karjat",
    type: "city",
    country_code: "IN",
    country_name: "India",
    region: "Maharashtra",
    region_id: 1735,
    supports_region: true,
    supports_city: true,
  },
  {
    key: "1034377",
    name: "Mandi",
    type: "city",
    country_code: "IN",
    country_name: "India",
    region: "Himachal Pradesh",
    region_id: 1731,
    supports_region: true,
    supports_city: true,
  },
  {
    key: "1016128",
    name: "Ambala",
    type: "city",
    country_code: "IN",
    country_name: "India",
    region: "Haryana",
    region_id: 1730,
    supports_region: true,
    supports_city: true,
  },
  {
    key: "1015670",
    name: "Agartala",
    type: "city",
    country_code: "IN",
    country_name: "India",
    region: "Tripura",
    region_id: 1745,
    supports_region: true,
    supports_city: true,
  },
  {
    key: "2674292",
    name: "Bathinda",
    type: "city",
    country_code: "IN",
    country_name: "India",
    region: "Punjab region",
    region_id: 1742,
    supports_region: true,
    supports_city: true,
  },
  {
    key: "1046969",
    name: "Vijayawada",
    type: "city",
    country_code: "IN",
    country_name: "India",
    region: "Andhra Pradesh",
    region_id: 1724,
    supports_region: true,
    supports_city: true,
  },
  {
    key: "2676083",
    name: "Manesar",
    type: "city",
    country_code: "IN",
    country_name: "India",
    region: "Haryana",
    region_id: 1730,
    supports_region: true,
    supports_city: true,
  },
  {
    key: "1022591",
    name: "Daman",
    type: "city",
    country_code: "IN",
    country_name: "India",
    region: "Gujarat",
    region_id: 1729,
    supports_region: true,
    supports_city: true,
  },
  {
    key: "2676422",
    name: "Seshadripuram",
    type: "neighborhood",
    country_code: "IN",
    country_name: "India",
    region: "Karnataka",
    region_id: 1738,
    supports_region: true,
    supports_city: true,
    geo_hierarchy_level: "NEIGHBORHOOD",
    geo_hierarchy_name: "NEIGHBORHOOD",
  },
  {
    key: "1047253",
    name: "Warangal",
    type: "city",
    country_code: "IN",
    country_name: "India",
    region: "Telangana",
    region_id: 4100,
    supports_region: true,
    supports_city: true,
  },
  {
    key: "1015813",
    name: "Ajnala",
    type: "city",
    country_code: "IN",
    country_name: "India",
    region: "Punjab region",
    region_id: 1742,
    supports_region: true,
    supports_city: true,
  },
  {
    key: "1024628",
    name: "Faridkot",
    type: "city",
    country_code: "IN",
    country_name: "India",
    region: "Punjab region",
    region_id: 1742,
    supports_region: true,
    supports_city: true,
  },
  {
    key: "1035473",
    name: "Mohali",
    type: "city",
    country_code: "IN",
    country_name: "India",
    region: "Punjab region",
    region_id: 1742,
    supports_region: true,
    supports_city: true,
  },
  {
    key: "1033610",
    name: "Madurai",
    type: "city",
    country_code: "IN",
    country_name: "India",
    region: "Tamil Nadu",
    region_id: 1744,
    supports_region: true,
    supports_city: true,
  },
  {
    key: "1023040",
    name: "Delhi",
    type: "city",
    country_code: "IN",
    country_name: "India",
    region: "Delhi",
    region_id: 1728,
    supports_region: true,
    supports_city: true,
  },
  {
    key: "2794868",
    name: "India Gate",
    type: "neighborhood",
    country_code: "IN",
    country_name: "India",
    region: "Delhi",
    region_id: 1728,
    supports_region: true,
    supports_city: true,
    geo_hierarchy_level: "NEIGHBORHOOD",
    geo_hierarchy_name: "NEIGHBORHOOD",
  },
  {
    key: "1021534",
    name: "Chennai",
    type: "city",
    country_code: "IN",
    country_name: "India",
    region: "Tamil Nadu",
    region_id: 1744,
    supports_region: true,
    supports_city: true,
  },
  {
    key: "1017930",
    name: "Bangalore",
    type: "city",
    country_code: "IN",
    country_name: "India",
    region: "Karnataka",
    region_id: 1738,
    supports_region: true,
    supports_city: true,
  },
  {
    key: "1031366",
    name: "Kochi",
    type: "city",
    country_code: "IN",
    country_name: "India",
    region: "Kerala",
    region_id: 1733,
    supports_region: true,
    supports_city: true,
  },
  {
    key: "1015741",
    name: "Ahmedabad",
    type: "city",
    country_code: "IN",
    country_name: "India",
    region: "Gujarat",
    region_id: 1729,
    supports_region: true,
    supports_city: true,
  },
  {
    key: "1027344",
    name: "Indore",
    type: "city",
    country_code: "IN",
    country_name: "India",
    region: "Madhya Pradesh",
    region_id: 1753,
    supports_region: true,
    supports_city: true,
  },
  {
    key: "BD:11",
    name: "11",
    type: "zip",
    country_code: "BD",
    country_name: "Bangladesh",
    region: "Dhaka Division",
    region_id: 4373,
    primary_city: "Dhaka",
    primary_city_id: 153176,
    supports_region: true,
    supports_city: true,
  },
  {
    key: "SK:956 11",
    name: "956 11",
    type: "zip",
    country_code: "SK",
    country_name: "Slovakia",
    region: "Nitra Region",
    region_id: 3424,
    primary_city: "Dvorany nad Nitrou",
    primary_city_id: 2167282,
    supports_region: true,
    supports_city: true,
  },
  {
    key: "CZ:542 11",
    name: "542 11",
    type: "zip",
    country_code: "CZ",
    country_name: "Czech Republic",
    region: "Hradec Králové Region",
    region_id: 798,
    primary_city: "Radvanice, Trutnov",
    primary_city_id: 530962,
    supports_region: true,
    supports_city: true,
  },
  {
    key: "PL:11-042",
    name: "11-042",
    type: "zip",
    country_code: "PL",
    country_name: "Poland",
    region: "Warmian-Masurian Voivodeship",
    region_id: 3006,
    primary_city: "Jonkowo",
    primary_city_id: 1851661,
    supports_region: true,
    supports_city: true,
  },
  {
    key: "PL:11-015",
    name: "11-015",
    type: "zip",
    country_code: "PL",
    country_name: "Poland",
    region: "Warmian-Masurian Voivodeship",
    region_id: 3006,
    primary_city: "Olsztynek gmina",
    primary_city_id: 2694514,
    supports_region: true,
    supports_city: true,
  },
  {
    key: "PL:11-600",
    name: "11-600",
    type: "zip",
    country_code: "PL",
    country_name: "Poland",
    region: "Warmian-Masurian Voivodeship",
    region_id: 3006,
    primary_city: "Węgorzewo gmina",
    primary_city_id: 2694825,
    supports_region: true,
    supports_city: true,
  },
  {
    key: "SK:023 11",
    name: "023 11",
    type: "zip",
    country_code: "SK",
    country_name: "Slovakia",
    region: "Žilina Region",
    region_id: 3428,
    primary_city: "Zakopcie",
    primary_city_id: 2172604,
    supports_region: true,
    supports_city: true,
  },
  {
    key: "PL:11-200",
    name: "11-200",
    type: "zip",
    country_code: "PL",
    country_name: "Poland",
    region: "Warmian-Masurian Voivodeship",
    region_id: 3006,
    primary_city: "Bartoszyce gmina",
    primary_city_id: 2694094,
    supports_region: true,
    supports_city: true,
  },
  {
    key: "CZ:471 11",
    name: "471 11",
    type: "zip",
    country_code: "CZ",
    country_name: "Czech Republic",
    region: "Liberec Region",
    region_id: 817,
    primary_city: "Horní Libchava",
    primary_city_id: 521406,
    supports_region: true,
    supports_city: true,
  },
  {
    key: "PL:11-100",
    name: "11-100",
    type: "zip",
    country_code: "PL",
    country_name: "Poland",
    region: "Warmian-Masurian Voivodeship",
    region_id: 3006,
    primary_city: "Lidzbark Warmiński gmina",
    primary_city_id: 2694399,
    supports_region: true,
    supports_city: true,
  },
  {
    key: "PL:11-400",
    name: "11-400",
    type: "zip",
    country_code: "PL",
    country_name: "Poland",
    region: "Warmian-Masurian Voivodeship",
    region_id: 3006,
    primary_city: "Kętrzyn gmina",
    primary_city_id: 2694388,
    supports_region: true,
    supports_city: true,
  },
  {
    key: "CZ:679 11",
    name: "679 11",
    type: "zip",
    country_code: "CZ",
    country_name: "Czech Republic",
    region: "South Moravian Region",
    region_id: 812,
    primary_city: "Doubravice nad Svitavou",
    primary_city_id: 519359,
    supports_region: true,
    supports_city: true,
  },
  {
    key: "CZ:382 11",
    name: "382 11",
    type: "zip",
    country_code: "CZ",
    country_name: "Czech Republic",
    region: "South Bohemian Region",
    region_id: 813,
    primary_city: "Vetrni, Jihočeský Kraj",
    primary_city_id: 535831,
    supports_region: true,
    supports_city: true,
  },
  {
    key: "CZ:751 11",
    name: "751 11",
    type: "zip",
    country_code: "CZ",
    country_name: "Czech Republic",
    region: "Olomouc Region",
    region_id: 818,
    primary_city: "Radslavice, Olomoucký Kraj",
    primary_city_id: 530952,
    supports_region: true,
    supports_city: true,
  },
  {
    key: "PL:11-700",
    name: "11-700",
    type: "zip",
    country_code: "PL",
    country_name: "Poland",
    region: "Warmian-Masurian Voivodeship",
    region_id: 3006,
    primary_city: "Mrągowo gmina",
    primary_city_id: 2694462,
    supports_region: true,
    supports_city: true,
  },
  {
    key: "SK:922 11",
    name: "922 11",
    type: "zip",
    country_code: "SK",
    country_name: "Slovakia",
    region: "Trnava Region",
    region_id: 3427,
    primary_city: "Prasnik",
    primary_city_id: 2170663,
    supports_region: true,
    supports_city: true,
  },
  {
    key: "CZ:691 11",
    name: "691 11",
    type: "zip",
    country_code: "CZ",
    country_name: "Czech Republic",
    region: "South Moravian Region",
    region_id: 812,
    primary_city: "Brumovice, Jihomoravký Kraj",
    primary_city_id: 517248,
    supports_region: true,
    supports_city: true,
  },
  {
    key: "CZ:739 11",
    name: "739 11",
    type: "zip",
    country_code: "CZ",
    country_name: "Czech Republic",
    region: "Moravian-Silesian Region",
    region_id: 819,
    primary_city: "Frýdlant nad Ostravicí",
    primary_city_id: 520038,
    supports_region: true,
    supports_city: true,
  },
  {
    key: "GR:840 11",
    name: "840 11",
    type: "zip",
    country_code: "GR",
    country_name: "Greece",
    region: "Southern Aegean",
    region_id: 4175,
    primary_city: "Folégandros, Kikladhes",
    primary_city_id: 862072,
    supports_region: true,
    supports_city: true,
  },
  {
    key: "CZ:400 11",
    name: "400 11",
    type: "zip",
    country_code: "CZ",
    country_name: "Czech Republic",
    region: "Ústí nad Labem Region",
    region_id: 823,
    primary_city: "Ústí nad Labem",
    primary_city_id: 535315,
    supports_region: true,
    supports_city: true,
  },
  {
    key: "CZ:330 11",
    name: "330 11",
    type: "zip",
    country_code: "CZ",
    country_name: "Czech Republic",
    region: "Plzeň Region",
    region_id: 821,
    primary_city: "Hromnice, Plzeňský Kraj",
    primary_city_id: 521932,
    supports_region: true,
    supports_city: true,
  },
  {
    key: "SK:949 11",
    name: "949 11",
    type: "zip",
    country_code: "SK",
    country_name: "Slovakia",
    region: "Nitra Region",
    region_id: 3424,
    primary_city_id: 0,
    supports_region: true,
    supports_city: true,
  },
  {
    key: "GR:730 11",
    name: "730 11",
    type: "zip",
    country_code: "GR",
    country_name: "Greece",
    region: "Crete",
    region_id: 4170,
    primary_city: "Sfakiá",
    primary_city_id: 875446,
    supports_region: true,
    supports_city: true,
  },
  {
    key: "CZ:190 11",
    name: "190 11",
    type: "zip",
    country_code: "CZ",
    country_name: "Czech Republic",
    region: "Prague",
    region_id: 809,
    primary_city: "Prague",
    primary_city_id: 530281,
    supports_region: true,
    supports_city: true,
  },
  {
    key: "SK:985 11",
    name: "985 11",
    type: "zip",
    country_code: "SK",
    country_name: "Slovakia",
    region: "Banská Bystrica Region",
    region_id: 3421,
    primary_city: "Halic, Banskobystrický",
    primary_city_id: 2167722,
    supports_region: true,
    supports_city: true,
  },
];

export interface GenericLocationObject {
  key: string;
  name: string;
  type: string;
  country_code: string;
  country_name: string;
  region?: string;
  region_id?: number;
  supports_region: boolean;
  supports_city: boolean;
  primary_city?: string;
  primary_city_id?: number;
  geo_hierarchy_level?: string;
  geo_hierarchy_name?: string;
  /** Local Key to handle the local state */
  label?: boolean;
}

type GetGenericLocationResponse = GenericLocationObject[];

export const useGetGenericLocations = (
  query: string,
  initialData?: any,
  enabled: boolean = true
) => {
  const { accessToken } = useCredentials();
  const getLocations = async ({ queryKey }: QueryFunctionContext) => {
    const [, accessToken, query] = queryKey;
    const response = await axios.get(ROUTES.LOCATION.GENERIC, {
      params: {
        access_token: accessToken,
        query,
      },
    });

    return response.data.data;
  };

  return useQuery<GetGenericLocationResponse>({
    queryKey: API_QUERIES.GET_LOCATIONS(accessToken, query),
    queryFn: getLocations,
    enabled: enabled && query.length > 0 && !!accessToken,
    retry(failureCount, error) {
      if (error instanceof Error) {
        return false;
      }
      return failureCount < 3;
    },
    placeholderData: initialData,
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

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const { state } = useUser();
  const [, setSnackBarData] = useContext(SnackbarContext).snackBarData;

  const updateUser = async (variables: UserSettingsToUpdate) => {
    if (!state.data?.id) throw new Error("User not found, Please login again!");

    const formData = new FormData();

    formData.append("first_name", variables.first_name);
    formData.append("last_name", variables.last_name);
    formData.append("settings", JSON.stringify(variables.settings));

    if (variables.imageBlob) {
      formData.append("file", variables.imageBlob);
    }

    const response = await axios.patch(ROUTES.USERS.UPDATE_ME, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  };

  return useMutation({
    mutationKey: API_QUERIES.UPDATE_ME,
    mutationFn: updateUser,
    onSuccess: (data) => {
      setSnackBarData({
        message: "User updated successfully!",
        status: "success",
      });
    },
    onError: (error) => {
      setSnackBarData({
        message: error.message ?? "Couldn't update user, Please try again!",
        status: "error",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: API_QUERIES.GET_ME,
      });
    },
  });
};

export interface IUserMeResponse {
  createdAt: null | string;
  email: string;
  emailVerified: null | boolean;
  first_name: string;
  id: string;
  image: null | string;
  last_name: string;
  updatedAt: null | string;
}
export const useGetMe = (): UseQueryResult<IUserMeResponse> => {
  const getMe = async () => {
    const response = await axios.get(ROUTES.USERS.ME);
    return response.data;
  };

  return useQuery({
    queryKey: API_QUERIES.GET_ME,
    queryFn: getMe,
    retry(failureCount, error) {
      if (error instanceof Error) {
        return false;
      }
      return failureCount < 3;
    },
  });
};
