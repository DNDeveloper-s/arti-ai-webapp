import { TimeRange } from "@/api/conversation";

const API_QUERIES = {
  GET_LEADS: (
    accessToken?: string | null,
    type?: string | null,
    id?: string | null,
    timeRange?: string | null
  ) => ["get-leads", accessToken, type, id, timeRange],
  GET_SUBSCRIPTIONS: ["get-subscriptions"],
  GET_CREDIT_BALANCE: ["get-credit-balance"],
  GET_USER_BUSINESSES: ["get-user-businesses"],
  USER_PAGES: (access_token?: string | null) => ["user-pages", access_token],
  USER_FACEBOOK_POSTS: (page_id: string, page_access_token: string) => [
    "user-facebook-posts",
    page_id,
    page_access_token,
  ],
  CREATE_SOCIAL_POST: ["create-social-post"],
  GET_AD_ACCOUNT_ID: (access_token?: string | null) => [
    "get-ad-account-id",
    access_token,
  ],
  GET_SOCIAL_POST: (
    page_id?: string | null,
    page_access_token?: string | null,
    period?: "week"
  ) => ["get-social-post", page_id, page_access_token, period],
  GET_AD_IDENTIFIERS: (ad_id?: string | null) => ["get-ad-identifiers", ad_id],
  GET_CAMPAIGN: (
    access_token?: string | null,
    campaign_id?: string | null,
    timeRange?: string | null,
    get_leads?: boolean | null
  ) => ["get-campaign", access_token, campaign_id, timeRange, get_leads],
  GET_AD_ACCOUNTS: (access_token?: string | null) => [
    "get-ad-accounts",
    access_token,
  ],
  GET_VARIANT: (
    id?: string | null,
    ad_id?: string | null,
    post_id?: string | null
  ) => ["get-variant", id, ad_id, post_id],
  GET_PRODUCTS: ["get-products"],
  GET_CREATIVE_AUTO_COMPLETE: (adCreativeId?: string) => [
    "get-creative-auto-complete",
    adCreativeId,
  ],
  GET_INFINITE_LEADS: (
    accessToken?: string | null,
    type?: string | null,
    id?: string | null,
    parsedTimeRange?: string | null
  ) => ["get-infinite-leads", accessToken, type, id, parsedTimeRange],
  GET_ME: ["get-me"],
  GET_FACEBOOK_USER_ACCESS_TOKEN: ["get-facebook-user-access-token"],
  VALIDATE_FACEBOOK_ACCESS_TOKEN: ["validate-facebook-access-token"],
  GET_FACEBOOK_POST: (access_token?: string, post_id?: string) => [
    "get-variant-post",
    access_token,
    post_id,
  ],
  GET_LOCATIONS: (access_token?: string | null, query?: string) => [
    "get-locations",
    access_token,
    query,
  ],
  GET_LEADGEN_FORMS: (pageId?: string, pageAccessToken?: string | null) => [
    "get-leadgen-forms",
    pageId,
    pageAccessToken,
  ],
  GET_USER_CAMPAIGNS: ["get-user-campaigns"],
  VARIANTS_BY_CONVERSATION: (businessId?: string | null) => [
    "variants-by-conversation",
    businessId,
  ],
  GET_USER_ACCOUNTS: ["get-user-accounts"],
  LINK_ACCOUNT: ["link-account"],
  GET_FACEBOOK_PAGE: (access_token?: string | null, page_id?: string) => [
    "get-facebook-page",
    access_token,
    page_id,
  ],
  GET_CAMPAIGNS: (access_token?: string | null, account_id?: string | null) => [
    "get-campaigns",
    access_token,
    account_id,
  ],
  GET_INFINITE_CAMPAIGNS: (
    account_id?: string | null,
    access_token?: string | null,
    get_insights?: boolean | null,
    time_range?: string | null
  ) => [
    "get-infinite-campaigns",
    account_id,
    access_token,
    get_insights,
    time_range,
  ],
  GET_CONVERSATION: (conversation_id?: string | null) => [
    "get-conversation",
    conversation_id,
  ],
  GET_MESSAGES: (conversation_id: string | null) => [
    "get-messages",
    conversation_id,
  ],
  GET_ADSETS: (
    access_token?: string | null,
    account_id?: string | null,
    campaign_ids?: string[] | null,
    parsedTimeRange?: string | null,
    get_leads?: boolean | null
  ) => [
    "get-adsets",
    access_token,
    account_id,
    campaign_ids,
    parsedTimeRange,
    get_leads,
  ],
  GET_ADSET: (access_token?: string | null, adset_id?: string | null) => [
    "get-adset",
    access_token,
    adset_id,
  ],
  GET_USER_BUSINESS: (business_id?: string | null) => [
    "get-user-business",
    business_id,
  ],
  GET_ADS: (
    access_token?: string | null,
    account_id?: string | null,
    adset_ids?: string[] | null,
    campaign_ids?: string[] | null,
    ad_ids?: string[] | null,
    parsedTimeRange?: string | null,
    get_leads?: boolean | null
  ) => [
    "get-ads",
    access_token,
    account_id,
    adset_ids,
    campaign_ids,
    ad_ids,
    parsedTimeRange,
    get_leads,
  ],
  CREATE_CAMPAIGN: ["create-campaign"],
  CREATE_ADSET: ["create-adset"],
  CREATE_AD: ["create-ad"],
  GET_ALL_COUNTRIES: ["get-all-countries"],
  GET_ZIP_CODES: (zipCode: string, accessToken?: string | null) => [
    "get-zipcodes",
    zipCode,
    accessToken,
  ],
  GET_INTERESTS: (
    query: string,
    accountId?: string | null,
    access_token?: string | null
  ) => ["get-interests", query, accountId, access_token],
  UPLOAD_AD_IMAGE: (accountId?: string, accessToken?: string | null) => [
    "upload-ad-image",
    accountId,
    accessToken,
  ],
  CREATE_FACEBOOK_AD_CREATIVE: (
    accountId?: string,
    accessToken?: string | null
  ) => ["create-facebook-ad-creative", accountId, accessToken],
  UPDATE_ADSET: (accountId?: string | null, accessToken?: string | null) => [
    "update-adset",
    accountId,
    accessToken,
  ],
  UPDATE_CAMPAIGN: (accountId?: string | null, accessToken?: string | null) => [
    "update-campaign",
    accountId,
    accessToken,
  ],
  UPDATE_AD: (accountId?: string | null, accessToken?: string | null) => [
    "update-ad",
    accountId,
    accessToken,
  ],
  SEND_MESSAGE: ["send-message"],
  UPDATE_ME: ["update-me"],
  GET_INFINITE_CONVERSATIONS: (businessId?: string | null) => [
    "get-infinite-conversations",
    businessId,
  ],
};

export default API_QUERIES;
