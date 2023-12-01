import {IConversation, IConversationModel} from '@/interfaces/IConversation';

export function humanFileSize(bytes: number, si=false, dp=1) {
	const thresh = si ? 1000 : 1024;

	if (Math.abs(bytes) < thresh) {
		return bytes + ' B';
	}

	const units = si
		? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
		: ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
	let u = -1;
	const r = 10**dp;

	do {
		bytes /= thresh;
		++u;
	} while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);


	return bytes.toFixed(dp) + ' ' + units[u];
}

export const wait = (duration: number) => new Promise(res => setTimeout(res, duration));

export const waitWithCleanup = (duration: number) => {
	let timeoutId;
	const promise = new Promise((resolve) => {
		timeoutId = setTimeout(resolve, duration);
	});

	// Return both the timeoutId and the promise
	return { timeoutId, promise } as {timeoutId: NodeJS.Timeout | undefined, promise: Promise<void>};
}

export function timeSince(date: number | Date | string) {

	const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);

	let interval = seconds / 31536000;

	if (interval > 1) {
		return Math.floor(interval) + " year" + (Math.floor(interval) > 1 ? 's' : '');
	}
	interval = seconds / 2592000;
	if (interval > 1) {
		return Math.floor(interval) + " month" + (Math.floor(interval) > 1 ? 's' : '');
	}
	interval = seconds / 86400;
	if (interval > 1) {
		return Math.floor(interval) + " d";
	}
	interval = seconds / 3600;
	if (interval > 1) {
		return Math.floor(interval) + " h";
	}
	interval = seconds / 60;
	if (interval > 1) {
		return Math.floor(interval) + " min" + (Math.floor(interval) > 1 ? 's' : '');
	}

	// return 'just now';

	return Math.floor(seconds) + " sec" + (Math.floor(seconds) > 1 ? 's' : '');
}

export default function getJSONObjectFromAString(inputString: string) {
	let jsonObjects = [];

	let startIndex = 0;

	while (startIndex < inputString.length) {
		let startBracketIndex = inputString.indexOf('{', startIndex);
		let endBracketIndex = inputString.indexOf('}', startBracketIndex);

		if (startBracketIndex !== -1 && endBracketIndex !== -1) {
			let jsonObject = inputString.substring(startBracketIndex, endBracketIndex + 1);

			// Check if the extracted JSON object contains nested objects
			while (jsonObject.indexOf('{', 1) !== -1) {
				let nestedStartIndex = jsonObject.indexOf('{', 1);
				let nestedEndIndex = inputString.indexOf('}', endBracketIndex + 1);
				if (nestedEndIndex !== -1) {
					jsonObject += inputString.substring(endBracketIndex + 1, nestedEndIndex + 1);
					endBracketIndex = nestedEndIndex;
				} else {
					break;
				}
			}

			jsonObjects.push(jsonObject);
			startIndex = endBracketIndex + 1;
		} else {
			break;
		}
	}

	return jsonObjects[0]
}

export function isValidJsonWithAdsArray(inputString: string, isIndentedString?: boolean): boolean {
	try {
		const jsonObject = JSON.parse(inputString);

		console.log('inputString - ', jsonObject);

		return (
			typeof jsonObject === 'object' &&
			jsonObject !== null &&
			jsonObject.hasOwnProperty('variants') &&
			Array.isArray(jsonObject.variants)
		);
	} catch (error) {
		return false; // JSON parsing error
	}
}

export const getConversationURL = (id: IConversation['id'], conversationParams: IConversation | IConversation['conversation_type']) => {
	if(typeof conversationParams === 'string') return `/artibot/${endPoint}/${id}`;
	const endPoint = conversationParams.conversation_type === 'strategy' ? 'strategy' : 'ad_creative';
	return `/artibot/${endPoint}/${id}`;
}

export const isProduction = process.env.NODE_ENV === 'production';
