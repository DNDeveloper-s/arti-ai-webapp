const API_QUERIES = {
  USER_PAGES: (access_token?: string | null) => ["user-pages", access_token],
  USER_FACEBOOK_POSTS: (page_id: string, page_access_token: string) => [
    "user-facebook-posts",
    page_id,
    page_access_token,
  ],
  CREATE_SOCIAL_POST: [
    "create-social-post",
  ],
  GET_AD_ACCOUNT_ID: (access_token?: string | null) => [
    "get-ad-account-id",
    access_token,
  ],
  GET_FACEBOOK_USER_ACCESS_TOKEN: ["get-facebook-user-access-token"],
  VALIDATE_FACEBOOK_ACCESS_TOKEN: ["validate-facebook-access-token"],
  GET_FACEBOOK_POST: (access_token?: string, post_id?: string) => [
    "get-variant-post",
    access_token,
    post_id,
  ],
  GET_USER_ACCOUNTS: (user_id?: string) => ["get-user-accounts", user_id],
  LINK_ACCOUNT: (user_id?: string) => ["link-account", user_id],
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
  GET_ADSETS: (
    access_token?: string | null,
    account_id?: string | null,
    campaign_ids?: string[] | null
  ) => ["get-adsets", access_token, account_id, campaign_ids],
  GET_ADS: (
    access_token?: string | null,
    account_id?: string | null,
    adset_ids?: string[] | null
  ) => ["get-ads", access_token, account_id, adset_ids],
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
};

export default API_QUERIES;
