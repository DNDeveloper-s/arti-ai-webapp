// import { GTM_ID } from '../config'; // Replace with your GTM container ID
import * as TagManager from 'react-gtm-module';

export enum GTM_EVENT {
	'VISIT_PAGE' = 'visit-page',
	'TIME_SPENT' = 'time-spent',
	'SCROLL_DEPTH' = 'scroll-depth',
	'CONTACT_FORM_SUBMISSION' = 'contact_form_submission',
}

export const initGTM = () => {
	const tagManagerArgs = {
		// gtmId: 'AW-11408559506',
		gtmId: 'GTM-PSDW4ZV4',
		events: {
			[`${GTM_EVENT.VISIT_PAGE}`]: 'pageview',
			[`${GTM_EVENT.TIME_SPENT}`]: 'time-spent',
			[`${GTM_EVENT.CONTACT_FORM_SUBMISSION}`]: 'contact_form_submission',
		}
	}

	TagManager.initialize(tagManagerArgs)
};

interface GTMEvent {
	event: GTM_EVENT,
	page?: string,
	[key: string]: any,
}

export const logEvent = (dataLayer: any) => {
	TagManager.dataLayer({
		dataLayer
	});
};
