import { ROUTES } from "@/config/api-config";
import API_QUERIES from "@/config/api-queries";
import { IUserAccount, IUserFacebookPost, IUserPage } from "@/interfaces/IUser";
import { SupportedPlatform, useUser } from "@/context/UserContext";
import {
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
import { SnackbarContext } from "@/context/SnackbarContext";
import { useCallback, useContext } from "react";
import { IAd, IAdCampaign, IAdSet } from "@/interfaces/ISocial";

export function useUserPages(
  accessToken?: string | null
): UseQueryResult<IUserPage[], Error> {
  const queryClient = useQueryClient();
  const { setUserPagesData } = useUser();

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
    queryKey: API_QUERIES.USER_PAGES(accessToken),
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

  const createPost = async ({
    pageId,
    pageAccessToken,
    imageUrl,
    message,
  }: {
    pageId: string;
    pageAccessToken: string;
    imageUrl: string;
    message: string;
  }) => {
    // const response = await axios.post(ROUTES.SOCIAL.FACEBOOK_POSTS, {
    //   post: {
    //     url: imageUrl,
    //     message,
    //   },
    //   page_id: pageId,
    //   access_token: pageAccessToken,
    //   user_id:
    // });

    // const mutation = useMutation(API_QUERIES.CREATE_SOCIAL_POST(pageId, pageAccessToken), {

    // });

    if (response.status === 200) {
      // Handle the success case here
    }

    // Handle the error case here
  };

  return useMutation({
    // mutationKey: API_QUERIES.CREATE_SOCIAL_POST,
    mutationFn: createPost,
  });
}

export function useGetAdAccountId(accessToken: string | null) {
  const getAdAccountId = async ({ queryKey }: QueryFunctionContext) => {
    const accessToken = queryKey[1];
    if (!accessToken) throw new Error("Access token is required");
    const response = await axios.post(ROUTES.ADS.GET_AD_ACCOUNT_ID, {
      access_token: accessToken,
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
      setSnackBarData({
        message: error.message ?? "An error occurred!",
        status: "error",
      });
    },
  });
}

export function useGetCampaigns({
  accessToken,
  accountId,
}: {
  accessToken: string | null;
  accountId: string | null;
}): UseQueryResult<IAdCampaign[], Error> {
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

  return useQuery<IAdCampaign[]>({
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
}

export function useGetAdSets({
  accessToken,
  accountId,
  campaignIds,
}: {
  accessToken: string | null;
  accountId: string | null;
  campaignIds?: string[] | null;
}): UseQueryResult<IAdSet[], Error> {
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
      },
    });
    return response.data.data;
  };

  return useQuery({
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
}

export function useGetAds({
  accessToken,
  accountId,
  adSetIds,
}: {
  accessToken: string | null;
  accountId: string | null;
  adSetIds?: string[] | null;
}): UseQueryResult<IAd[], Error> {
  const getAds = async ({ queryKey }: QueryFunctionContext) => {
    const [, accessToken, accountId, adSetIds] = queryKey;
    if (!accessToken) throw new Error("Access token is required");
    if (!accountId) throw new Error("Account id is required");
    if (!adSetIds) throw new Error("Ad set id is required");
    const response = await axios.get(ROUTES.ADS.AD_ENTITIES, {
      params: {
        access_token: accessToken,
        account_id: accountId,
        adset_ids: adSetIds,
      },
    });
    return response.data.data;
  };

  return useQuery({
    queryKey: API_QUERIES.GET_ADS(accessToken, accountId, adSetIds),
    queryFn: getAds,
    enabled: !!accessToken && !!accountId && !!adSetIds,
    retry(failureCount, error) {
      if (error instanceof Error && error instanceof AxiosError) {
        return false;
      }
      return failureCount < 3;
    },
  });
}
