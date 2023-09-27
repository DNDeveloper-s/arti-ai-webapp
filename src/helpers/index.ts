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

export function timeSince(date: number | Date | string) {

	const seconds = Math.floor((new Date() - new Date(date)) / 1000);

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
	return Math.floor(seconds) + " sec" + (Math.floor(seconds) > 1 ? 's' : '');
}

export function isValidJsonWithAdsArray(inputString: string): boolean {
	try {
		const jsonObject = JSON.parse(inputString);
		return (
			typeof jsonObject === 'object' &&
			jsonObject !== null &&
			jsonObject.hasOwnProperty('Ads') &&
			Array.isArray(jsonObject.Ads)
		);
	} catch (error) {
		return false; // JSON parsing error
	}
}
