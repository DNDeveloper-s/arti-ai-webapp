import { ROUTES } from "@/config/api-config";
import API_QUERIES from "@/config/api-queries";
import {
  IUserAccount,
  IUserFacebookPost,
  IUserPage,
  Paging,
  UserSettingsToUpdate,
} from "@/interfaces/IUser";
import { Platform, SupportedPlatform, useUser } from "@/context/UserContext";
import {
  Query,
  QueryFunctionContext,
  QueryKey,
  UseInfiniteQueryResult,
  UseMutationResult,
  UseQueryResult,
  useInfiniteQuery,
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { String } from "aws-sdk/clients/acm";
import axios, { AxiosError } from "axios";
import { access } from "fs";
import { ISnackbarData, SnackbarContext } from "@/context/SnackbarContext";
import { use, useCallback, useContext, useMemo } from "react";
import {
  ADMANAGER_STATUS_TYPE,
  IAd,
  IAdCampaign,
  IAdSet,
  PaginatedResponse,
} from "@/interfaces/ISocial";
import { ZipCodeResponseObject } from "@/components/ArtiBot/MessageItems/Deploy/Ad/components/Adset/Create/SelectZipCodes";
import { getSession, signIn, useSession } from "next-auth/react";
import { wait } from "@/helpers";
import useCampaignStore from "@/store/campaign";
import { omit } from "lodash";
import { getServerSession } from "next-auth";
import { RedirectType, redirect } from "next/navigation";
import { LinkData } from "@/components/ArtiBot/MessageItems/Deploy/Ad/components/Ads/Create/CreateAd";
import { ICampaignInfinite } from "./admanager";
import { TimeRange, prepareTimeRange } from "./conversation";
import { useTimeRange } from "@/context/TimeRangeContext";

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

export function useUserPages() {
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

  const facebookPages = useMemo(() => {
    return query.data?.filter((c) => c.account_type === "facebook");
  }, [query.data]);

  const instagramPages = useMemo(() => {
    return query.data?.filter((c) => c.account_type === "instagram");
  }, [query.data]);

  return {
    ...query,
    facebookPages,
    instagramPages,
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
    messageId,
    platform,
  }: {
    pageId: string;
    pageAccessToken: string;
    imageUrl: string;
    message: string;
    conversationId: string;
    variantId: string;
    adCreativeId: string;
    messageId?: string;
    platform: "facebook" | "instagram";
  }) => {
    const response = await axios.post(
      ROUTES.SOCIAL.POSTS(platform),
      {
        post: {
          url: imageUrl,
          message,
        },
        conversation_id: conversationId,
        variant_id: variantId,
        ad_creative_id: adCreativeId,
        message_id: messageId,
      },
      {
        params: {
          page_id: pageId,
          page_access_token: pageAccessToken,
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

interface FacebookPageObject {
  account_type: string;
  id: string;
  name: string;
  picture: string;
  page_access_token: string;
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

  return useQuery<FacebookPageObject>({
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
  platform = "facebook",
  isInView = true,
}: {
  accessToken?: string;
  postIds?: string[];
  platform?: "facebook" | "instagram";
  isInView?: boolean;
}) {
  const getVariantPost = useCallback(
    async ({ queryKey }: QueryFunctionContext) => {
      const [, postId, accessToken, platform] = queryKey;
      if (!accessToken) throw new Error("Access token is required");
      if (!postId || typeof postId !== "string")
        throw new Error("Post id is required and should be string only");
      const response = await axios.get(
        ROUTES.SOCIAL.POST(
          postId as string,
          platform as "facebook" | "instagram"
        ),
        {
          params: {
            access_token: accessToken,
            get_insights: true,
          },
        }
      );
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
        queryKey: API_QUERIES.GET_SOCIAL_POST_BY_ID(
          postId,
          accessToken,
          platform
        ),
        queryFn: getVariantPost,
        enabled: isInView && !!accessToken && !!postId,
        staleTime: 1000 * 60 * 5,
      })) ?? [],
    combine: (results) => {
      return {
        data: results.map((r) => r.data).filter((r) => r !== undefined),
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

  const query = useQuery<GetUserProvidersResponse>({
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

  const facebookProvider = useMemo(() => {
    return query.data?.find((c) => c.provider === "facebook");
  }, [query?.data]);

  return {
    ...query,
    facebookProvider,
  };
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

interface UseGetCampaignsProps {
  get_insights?: boolean;
  enabled?: boolean;
  time_range?: TimeRange;
  status?: ADMANAGER_STATUS_TYPE;
}

interface GetCampaignsInifiniteResponse {
  data: ICampaignInfinite[];
  paging: Paging;
}

export function useGetCampaigns(props?: UseGetCampaignsProps) {
  const LIMIT = 5;
  const { accessToken, accountId } = useCredentials();
  const parsedTimeRange = prepareTimeRange(props?.time_range);

  const fetchCampaigns = async (
    pageParam: undefined | string,
    queryKey: QueryKey
  ) => {
    const [, accountId, accessToken, get_insights, parsedTimeRange] = queryKey;

    console.log("account_id - ", accountId);

    if (!accessToken) throw new Error("Access token is required");
    if (!accountId) throw new Error("Account id is required");

    const response = await axios.get(ROUTES.CAMPAIGN.QUERY_INFINITE, {
      params: {
        account_id: accountId,
        access_token: accessToken,
        limit: LIMIT,
        get_insights: !!get_insights,
        after: pageParam,
        time_range: parsedTimeRange,
        status: props?.status,
      },
    });

    // pushCampaignsToState(response.data.data ?? []);

    return response.data.data;
  };

  return useInfiniteQuery<GetCampaignsInifiniteResponse>({
    queryKey: API_QUERIES.GET_INFINITE_CAMPAIGNS(
      accountId,
      accessToken,
      props?.get_insights,
      parsedTimeRange
    ),
    queryFn: ({ pageParam, queryKey }: any) =>
      fetchCampaigns(pageParam, queryKey),
    initialPageParam: undefined,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage?.data.length === 0 || lastPage?.data.length < LIMIT)
        return undefined;
      return lastPage.paging.cursors.after;
    },
    getPreviousPageParam: (firstPage, allPages) => {
      if (firstPage?.data.length === 0 || firstPage?.data.length < LIMIT)
        return undefined;
      return firstPage.paging.cursors.before;
    },
  });
}

export function useGetAdSets({
  campaignIds,
  enabled = true,
  providedAccountId,
  timeRange,
  get_leads,
}: {
  campaignIds?: string[] | null;
  providedAccountId?: string | null;
  enabled?: boolean;
  timeRange?: TimeRange;
  get_leads?: boolean;
}) {
  const LIMIT = 5;
  const { accessToken, accountId: defaultAccountId } = useCredentials();

  const accountId = providedAccountId ?? defaultAccountId;

  const parsedTimeRange = useMemo(
    () => prepareTimeRange(timeRange),
    [timeRange]
  );

  const getAdSets = async (
    pageParam: undefined | string,
    queryKey: QueryKey
  ) => {
    const [, accessToken, accountId, campaignIds, timeRange, get_leads] =
      queryKey;
    if (!accessToken) throw new Error("Access token is required");
    if (!accountId) throw new Error("Account id is required");
    if (!campaignIds) throw new Error("Campaign id is required");
    const response = await axios.get(ROUTES.ADS.ADSETS, {
      params: {
        access_token: accessToken,
        account_id: accountId,
        campaign_ids: campaignIds,
        get_insights: true,
        after: pageParam,
        time_range: timeRange,
        get_leads: !!get_leads,
      },
    });
    return response.data.data;
  };

  return useInfiniteQuery<PaginatedResponse<IAdSet>>({
    queryKey: API_QUERIES.GET_ADSETS(
      accessToken,
      accountId,
      campaignIds,
      parsedTimeRange,
      get_leads
    ),
    enabled: enabled && !!accessToken && !!accountId && !!campaignIds,
    queryFn: ({ pageParam, queryKey }: any) => getAdSets(pageParam, queryKey),
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
    retry(failureCount, error) {
      if (error instanceof Error && error instanceof AxiosError) {
        return false;
      }
      return failureCount < 3;
    },
  });
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
  timeRange,
  get_leads,
}: {
  campaignIds?: string[] | null;
  adsetIds?: string[] | null;
  adIds?: string[] | null;
  enabled?: boolean;
  accountId?: string | null;
  timeRange?: TimeRange;
  get_leads?: boolean;
}) {
  const LIMIT = 5;
  const { accessToken, accountId: defaultAccountId } = useCredentials();

  const parsedTimeRange = useMemo(
    () => prepareTimeRange(timeRange),
    [timeRange]
  );

  const getAds = async (pageParam: undefined | string, queryKey: QueryKey) => {
    const [
      ,
      accessToken,
      accountId,
      adsetIds,
      campaignIds,
      adIds,
      parsedTimeRange,
      get_leads,
    ] = queryKey;
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
        after: pageParam,
        time_range: parsedTimeRange,
        get_leads: !!get_leads,
      },
    });
    return response.data.data;
  };

  const _accountId = accountId ?? defaultAccountId;

  return useInfiniteQuery<PaginatedResponse<IAd>>({
    queryKey: API_QUERIES.GET_ADS(
      accessToken,
      _accountId,
      adsetIds,
      campaignIds,
      adIds,
      parsedTimeRange,
      get_leads
    ),
    enabled: !!enabled && !!accessToken && !!_accountId,
    queryFn: ({ pageParam, queryKey }: any) => getAds(pageParam, queryKey),
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
  const { timeRange } = useTimeRange();
  const parsedTimeRange = prepareTimeRange(timeRange);

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
      queryClient.invalidateQueries({
        queryKey: API_QUERIES.GET_CAMPAIGN(
          accessToken,
          variables.campaignId,
          parsedTimeRange,
          true
        ),
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
  adset_id: string;
  campaign_id: string;
  creative_id?: string;
  variant_id?: string;
  ad_creative_id?: string;
  message_id?: string;
  conversation_id?: string;
}

// interface ICreateAdCreative {
//   ad_creative: {
//     name: string;
//     call_to_action_type: string;
//     message: string;
//   };
//   imageHash?: string;
//   pageId: string;
// }

export interface CTA_AD {
  CALL_NOW: {
    type: "CALL_NOW";
    value: {
      link: string;
    };
  };
  MESSAGE_PAGE: {
    type: "MESSAGE_PAGE";
    value: {
      app_destination: string;
    };
  };
  LEAD_AD: {
    type: "SIGN_UP";
    value: {
      lead_gen_form_id: string;
    };
  };
  WATCH_MORE: {
    type: "WATCH_MORE";
  };
}

interface ICreateAdCreative {
  name: string;
  status: "ACTIVE" | "PAUSED";
  object_story_spec: {
    page_id: string;
    instagram_actor_id?: string;
    link_data: LinkData;
  };
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
        ...adCreativeData,
        object_story_spec: {
          ...adCreativeData.object_story_spec,
          link_data: {
            ...adCreativeData.object_story_spec.link_data,
            image_hash: imageHash,
          },
        },
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
        creative_id: adCreativeId,
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
    ad: Pick<ICreateAd, "adset_id"> & Partial<ICreateAd>;
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

export function prefixAccountId(account_id?: string) {
  if (!account_id) return account_id;
  if (account_id.startsWith("act_")) return account_id;
  return `act_${account_id}`;
}

export const useCredentials = () => {
  const { facebookProvider, isFetching } = useGetUserProviders();
  const { selectedAccountId } = useCampaignStore();
  const accessToken = facebookProvider?.access_token;

  return {
    accessToken,
    accountId: prefixAccountId(selectedAccountId),
    isFetching,
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
