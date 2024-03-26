import { REGENERATE_SECTION } from "@/components/ArtiBot/EditAdVariant/EditAdVariant";

export const apiConfig = {
  // baseUrl:
  // process.env.NODE_ENV === "production"
  // ? "https://api.artiai.org"
  // : "http://localhost:8081",
  baseUrl: "https://api.artiai.org",
  // baseUrl: "http://localhost:8081",
  // baseUrl: "http://192.168.107.6:8081",
  version: "/v1",
};

function apiUrl(url: string, searchParams?: URLSearchParams) {
  const urlObject = new URL(apiConfig.version + url, apiConfig.baseUrl);
  if (searchParams) {
    urlObject.search = searchParams.toString();
  }
  return urlObject.toString();
}

const pickValidKeys = (obj: object): Record<string, string> => {
  return Object.keys(obj).reduce<{ [key: string]: unknown }>(
    (finalObj, key) => {
      if (
        obj &&
        Object.hasOwnProperty.call(obj, key) &&
        obj[key as keyof typeof obj] !== undefined &&
        obj[key as keyof typeof obj] !== null &&
        obj[key as keyof typeof obj] !== ""
      ) {
        finalObj[key] = obj[key as keyof typeof obj];
      }
      return finalObj;
    },
    {}
  ) as Record<string, string>;
};

export const ROUTES = {
  UTIL: {
    TEXT_TO_IMAGE: apiUrl("/utils/text-to-image"),
    UPLOAD_IMAGE: apiUrl("/utils/image/upload"),
  },
  CONVERSATION: {
    CREATE: (id: string) => apiUrl(`/conversations/${id}`),
    GET: (id: string) => apiUrl(`/conversations/${id}`),
    QUERY: (limit?: number, page?: number, sortBy?: "asc" | "desc") =>
      apiUrl(
        "/conversations",
        new URLSearchParams(pickValidKeys({ limit, page, sortBy }))
      ),
    GENERATE_IMAGES: (conversationId: string) =>
      apiUrl(`/ad_creatives/generate-images/${conversationId}`),
  },
  ADCREATIVE: {
    QUERY: (limit?: number, page?: number, sortBy?: "asc" | "desc") =>
      apiUrl(
        "/ad_creatives",
        new URLSearchParams(pickValidKeys({ limit, page, sortBy }))
      ),
  },
  MESSAGE: {
    SEND_FREE_TIER: apiUrl("/messages/send/free-tier"),
    SEND: apiUrl("/messages/send"),
    SAVE: apiUrl("/messages/save"),
    SAVE_AD_CREATIVE: apiUrl("/messages/save-ad-creative"),
    GET_AD_JSON: apiUrl("/messages/generate-ad-json"),
  },
  TOKEN: {
    GENERATE: apiUrl("/tokens/generate"),
    DECODE: apiUrl("/tokens/decode"),
  },
  VARIANT: {
    UPDATE: (variantId: string) => apiUrl(`/variants/${variantId}/keys`),
    UPDATE_IMAGE: (variantId: string) => apiUrl(`/variants/${variantId}/image`),
    REGENERATE_DATA: (
      variantId: string,
      key: REGENERATE_SECTION,
      extraInput?: string | null
    ) =>
      apiUrl(
        `/variants/regenerate/${variantId}/${key}`,
        new URLSearchParams(pickValidKeys({ extraInput }))
      ),
  },
  SOCIAL: {
    PAGES: apiUrl(`/social/pages`),
    FACEBOOK_POSTS: apiUrl(`/social/posts/facebook`),
    INSTAGRAM_POSTS: apiUrl(`/social/posts/instagram`),
    FACEBOOK_POST: (post_id: string) =>
      apiUrl(`/social/posts/facebook/${post_id}`),
    FACEBOOK_PAGE: (page_id: string) =>
      apiUrl(`/social/pages/facebook/${page_id}`),
  },
  ADS: {
    CAMPAIGNS: apiUrl("/marketing/campaigns"),
    CAMPAIGN: (campaignId: string) =>
      apiUrl(`/marketing/campaigns/${campaignId}`),
    ADSETS: apiUrl("/marketing/adsets"),
    ADSET: (adsetId: string) => apiUrl(`/marketing/adsets/${adsetId}`),
    ADCREATIVES: apiUrl("/marketing/adcreatives"),
    ADIMAGES: apiUrl("/marketing/adimages"),
    AD_ENTITIES: apiUrl("/marketing/ad_entities"),
    AD: (adId: string) => apiUrl(`/marketing/ad_entities/${adId}`),
    GET_AD_ACCOUNT_ID: apiUrl("/marketing/account_id"),
    GET_AD_ACCOUNTS: apiUrl("/marketing/accounts"),
    INTERESTS: apiUrl("/marketing/interests"),
    TEMPLATES: apiUrl("/marketing/templates"),
    MAILCHIMP_CAMPAIGNS: apiUrl("/marketing/mailchimp_campaigns"),
    SEND_CAMPAIGN: apiUrl("/marketing/send_campaign"),
    CUSTOM_AUDIENCE: apiUrl("/marketing/custom_audience"),
  },
  LOCATION: {
    ZIPCODE: apiUrl("/location/zipcode"),
    GET_ALL_COUNTRIES: apiUrl("/location/countries"),
  },
  USERS: {
    UPDATE: (userId: string) => apiUrl(`/users/${userId}/settings`),
    ACCOUNTS: (userId: string) => apiUrl(`/users/${userId}/accounts`),
    LINK_ACCOUNT: (userId: string) => apiUrl(`/users/${userId}/link-account`),
    VALIDATE_FACEBOOK_ACCESS_TOKEN: apiUrl(
      `/tokens/validate/facebook-access-token`
    ),
  },
};
