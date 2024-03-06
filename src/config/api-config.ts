import { REGENERATE_SECTION } from "@/components/ArtiBot/EditAdVariant/EditAdVariant";

export const apiConfig = {
	baseUrl: process.env.NODE_ENV === 'production' ? 'https://api.artiai.org' : 'http://localhost:8081',
	// baseUrl: 'https://api.artiai.org',
	// baseUrl: 'http://localhost:8081',
	version: '/v1'
}

function apiUrl(url: string, searchParams?: URLSearchParams) {
	const urlObject = new URL(apiConfig.version + url, apiConfig.baseUrl);
	if (searchParams) {
		urlObject.search = searchParams.toString();
	}
	return urlObject.toString();
}

const pickValidKeys = (obj: object): Record<string, string> => {
	return Object.keys(obj).reduce<{ [key: string]: unknown }>((finalObj, key) => {
		if (
			obj &&
			Object.hasOwnProperty.call(obj, key) &&
			obj[key as keyof typeof obj] !== undefined &&
			obj[key as keyof typeof obj] !== null &&
			obj[key as keyof typeof obj] !== ''
		) {
			finalObj[key] = obj[key as keyof typeof obj];
		}
		return finalObj;
	}, {}) as Record<string, string>;
}

export const ROUTES = {
	UTIL: {
		TEXT_TO_IMAGE: apiUrl('/utils/text-to-image'),
		UPLOAD_IMAGE: apiUrl('/utils/image/upload'),
	},
	CONVERSATION: {
		CREATE: (id: string) => apiUrl(`/conversations/${id}`),
		GET: (id: string) => apiUrl(`/conversations/${id}`),
		QUERY: (limit?: number, page?: number, sortBy?: 'asc' | 'desc') => apiUrl('/conversations', new URLSearchParams(pickValidKeys({ limit, page, sortBy }))),
		GENERATE_IMAGES: (conversationId: string) => apiUrl(`/ad_creatives/generate-images/${conversationId}`),
	},
	ADCREATIVE: {
		QUERY: (limit?: number, page?: number, sortBy?: 'asc' | 'desc') => apiUrl('/ad_creatives', new URLSearchParams(pickValidKeys({ limit, page, sortBy }))),
	},
	MESSAGE: {
		SEND_FREE_TIER: apiUrl('/messages/send/free-tier'),
		SEND: apiUrl('/messages/send'),
		SAVE: apiUrl('/messages/save'),
		SAVE_AD_CREATIVE: apiUrl('/messages/save-ad-creative'),
		GET_AD_JSON: apiUrl('/messages/generate-ad-json'),
	},
	TOKEN: {
		GENERATE: apiUrl('/tokens/generate'),
		DECODE: apiUrl('/tokens/decode'),
	},
	VARIANT: {
		UPDATE: (variantId: string) => apiUrl(`/variants/${variantId}/keys`),
		UPDATE_IMAGE: (variantId: string) => apiUrl(`/variants/${variantId}/image`),
		REGENERATE_DATA: (variantId: string, key: REGENERATE_SECTION, extraInput?: string | null) => apiUrl(`/variants/regenerate/${variantId}/${key}`, new URLSearchParams(pickValidKeys({ extraInput })))
	},
	SOCIAL: {
		POSTS: apiUrl(`/social/posts`),
		PAGES: apiUrl(`/social/pages`),
	},
	ADS: {
		CAMPAIGNS: apiUrl('/ads/campaigns'),
		ADSETS: apiUrl('/ads/adsets'),
		ADCREATIVES: apiUrl('/ads/adcreatives'),
		ADIMAGES: apiUrl('/ads/adimages'),
		AD_ENTITIES: apiUrl('/ads/ad_entities'),
		GET_AD_ACCOUNT_ID: apiUrl('/ads/get_ad_account_id'),
		GET_ALL_COUNTRIES: apiUrl('/ads/get_all_countries'),
		INTERESTS: apiUrl('/ads/interests'),
		TEMPLATES: apiUrl('/ads/templates'),
		MAILCHIMP_CAMPAIGNS: apiUrl('/ads/mailchimp_campaigns'),
		SEND_CAMPAIGN: apiUrl('/ads/send_campaign'),
		CUSTOM_AUDIENCE: apiUrl('/ads/custom_audience')
	},
	LOCATION: {
		ZIPCODE: apiUrl('/location/zipcode')
	},
	USERS: {
		ACCOUNTS: (userId: string) => apiUrl(`/users/${userId}/accounts`),
	}
}
