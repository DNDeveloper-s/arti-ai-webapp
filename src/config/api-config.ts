import { REGENERATE_SECTION } from "@/components/ArtiBot/EditAdVariant/EditAdVariant";

export const apiConfig = {
  //   baseUrl:
  // process.env.NODE_ENV === "production"
  //   ? "https://api.artiai.org"
  //   : "http://localhost:8081",
  // baseUrl: 'https://api.artiai.org',
  baseUrl: "http://localhost:8081",
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
  },
  ADS: {
    CAMPAIGNS: apiUrl("/account/campaigns"),
    ADSETS: apiUrl("/account/adsets"),
    ADCREATIVES: apiUrl("/account/adcreatives"),
    ADIMAGES: apiUrl("/account/adimages"),
    AD_ENTITIES: apiUrl("/account/ad_entities"),
    GET_AD_ACCOUNT_ID: apiUrl("/account/account_id_info?preventAdblock=true"),
    GET_ALL_COUNTRIES: apiUrl("/account/get_all_countries"),
    INTERESTS: apiUrl("/account/interests"),
    TEMPLATES: apiUrl("/account/templates"),
    MAILCHIMP_CAMPAIGNS: apiUrl("/account/mailchimp_campaigns"),
    SEND_CAMPAIGN: apiUrl("/account/send_campaign"),
    CUSTOM_AUDIENCE: apiUrl("/account/custom_audience"),
  },
  LOCATION: {
    ZIPCODE: apiUrl("/location/zipcode"),
  },
  USERS: {
    ACCOUNTS: (userId: string) => apiUrl(`/users/${userId}/accounts`),
    LINK_ACCOUNT: (userId: string) => apiUrl(`/users/${userId}/link-account`),
  },
};
