import { ROUTES } from "@/config/api-config";
import axios from "axios";

const getAllCountries = async () => {
  try {
    const response = await axios.get(ROUTES.LOCATION.GET_ALL_COUNTRIES);

    if (response.status == 200) {
      return { data: response.data.data };
    }
    return { getAllCountriesError: "Error" };
  } catch (e: any) {
    console.log(e.response.data);
    return { getAllCountriesError: "Error" };
  }
};

const getAllCampaigns = async (accountId: string, accessToken: string) => {
  try {
    const response = await axios.get(ROUTES.ADS.CAMPAIGNS, {
      params: {
        account_id: accountId,
        access_token: accessToken,
      },
    });

    if (response.status == 200) {
      return { data: response.data.data };
    }
    return { getAllCampaignsError: "Error" };
  } catch (e: any) {
    return { getAllCampaignsError: "Error" };
  }
};

const getAdsets = async ({
  campaignId,
  accountId,
  accessToken,
}: {
  campaignId?: string;
  accountId: string;
  accessToken: string;
}) => {
  try {
    const response = await axios.get(ROUTES.ADS.ADSETS, {
      params: {
        account_id: accountId,
        access_token: accessToken,
        campaign_id: campaignId,
      },
    });

    if (response.status == 200) {
      return { data: response.data.data };
    }
    return { getAdsetsError: "Error" };
  } catch (e: any) {
    return { getAdsetsError: "Error" };
  }
};

const getAds = async ({
  adsetId,
  accountId,
  accessToken,
}: {
  adsetId?: string;
  accountId: string;
  accessToken: string;
}) => {
  try {
    const response = await axios.get(ROUTES.ADS.AD_ENTITIES, {
      params: {
        account_id: accountId,
        access_token: accessToken,
        adset_id: adsetId,
      },
    });

    if (response.status == 200) {
      return { data: response.data.data };
    }
    return { getAdsError: "Error" };
  } catch (e: any) {
    return { getAdsError: "Error" };
  }
};

const createCampaign = async (
  campaign: any,
  accountId: string,
  accessToken: string
) => {
  try {
    const campaignObject = {
      campaign: campaign,
      account_id: accountId,
      access_token: accessToken,
    };

    const response = await axios.post(ROUTES.ADS.CAMPAIGNS, campaignObject);

    if (response.status == 200) {
      return { campaignId: response.data.data };
    }
    return { createCampaignError: "An unknown error occurred" };
  } catch (e: any) {
    return { createCampaignError: e.response.data.message };
  }
};

const createAdSet = async (adSet: any, accountId: any, accessToken: any) => {
  try {
    const response = await axios.post(ROUTES.ADS.ADSETS, {
      adSet: adSet,
      account_id: accountId,
      access_token: accessToken,
    });

    if (response.status == 200) {
      return { adSetId: response.data.data };
    }
    return { createAdSetError: "An unknown error occurred!" };
  } catch (e: any) {
    return { createAdSetError: e.response.data.message };
  }
};

const uploadImage = async (
  imageBytes: any,
  accountId: any,
  accessToken: any
) => {
  try {
    if (!imageBytes) {
      return { uploadImageError: `Please select an image.` };
    }

    const url = `https://graph.facebook.com/v19.0/${accountId}/adimages`;

    const response = await axios.post(url, {
      bytes: imageBytes,
      access_token: accessToken,
    });

    if (response.status == 200) {
      return { imageHash: response.data["images"]["bytes"]["hash"] };
    }
    return { imageHash: `uploadImageError in API: ${response}` };
  } catch (e: any) {
    console.log(e.response.data);
    return { uploadImageError: "e.response" };
  }
};

const createAdCreative = async (
  adCreative: any,
  imageHash: any,
  accountId: any,
  accessToken: any,
  pageId: string
) => {
  try {
    const url = `https://graph.facebook.com/v19.0/${accountId}/adcreatives`;

    const response = await axios.post(url, {
      name: adCreative.name,
      object_story_spec: {
        page_id: pageId,
        link_data: {
          call_to_action: {
            type: adCreative.call_to_action_type,
            value: {
              link: "http://www.facebook.com/gaming/play/645064660474863/",
            },
          },
          image_hash: imageHash,
          link: "http://www.facebook.com/gaming/play/645064660474863/",
          message: adCreative.message,
        },
      },
      degrees_of_freedom_spec: {
        creative_features_spec: {
          standard_enhancements: {
            enroll_status: "OPT_OUT",
          },
        },
      },
      access_token: accessToken,
    });
    if (response.status == 200) {
      return { creativeId: response.data["id"] };
    }
    return { createAdCreativeError: "An unknown error occurred!" };
  } catch (e: any) {
    if (e.response) {
      if (e.response.data.error.error_user_msg) {
        return { createAdCreativeError: e.response.data.error.error_user_msg };
      } else if (e.response.data.error.message) {
        const msg = e.response.data.error.message;
        const list = msg.split(":");
        return { createAdCreativeError: list[list.length - 1] };
      }
    }
    return { createAdCreativeError: "An unknown error occurred!" };
  }
};

const createAd = async (ad: any, accountId: any, accessToken: any) => {
  try {
    const reqBody = {
      ad: ad,
      account_id: accountId,
      access_token: accessToken,
    };

    const response = await axios.post(ROUTES.ADS.AD_ENTITIES, reqBody);

    if (response.status == 200) {
      return { adId: response.data.data };
    }
    return { createAdError: "An unknown error occurred!" };
  } catch (e: any) {
    return { createAdError: e.message };
  }
};

const getAdAccountId = async (accessToken: any) => {
  try {
    const response = await axios.post(ROUTES.ADS.GET_AD_ACCOUNT_ID, {
      access_token: accessToken,
    });

    if (response.status == 200) {
      return { adAccountId: response.data.data };
    }
    return { getAdAccountIdError: "An unknown error occurred" };
  } catch (e: any) {
    return { getAdAccountIdError: e.message };
  }
};

const combinedExports = {
  getAdAccountId,
  createCampaign,
  createAdSet,
  uploadImage,
  createAdCreative,
  createAd,
  getAllCountries,
  getAllCampaigns,
  getAdsets,
  getAds,
};

export default combinedExports;
