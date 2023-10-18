export const apiConfig = {
	// baseUrl: 'https://api.artiai.org',
	baseUrl: 'http://localhost:8081',
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
	},
	CONVERSATION: {
		CREATE: (id: string) => apiUrl(`/conversations/${id}`),
		GET: (id: string) => apiUrl(`/conversations/${id}`),
		QUERY: (limit?: number, page?: number, sortBy?: 'asc' | 'desc') => apiUrl('/conversations', new URLSearchParams(pickValidKeys({limit, page, sortBy}))),
	},
	ADCREATIVE: {
		QUERY: (limit?: number, page?: number, sortBy?: 'asc' | 'desc') => apiUrl('/ad_creatives', new URLSearchParams(pickValidKeys({limit, page, sortBy}))),
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
		UPDATE_IMAGE: (variantId: string) => apiUrl(`/variants/${variantId}/image`),
	}
}
