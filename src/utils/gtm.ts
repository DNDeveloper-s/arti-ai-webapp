// import { GTM_ID } from '../config'; // Replace with your GTM container ID
import * as TagManager from 'react-gtm-module';

export enum GTM_EVENT {
	'VISIT_PAGE' = 'visit-page',
}

export const initGTM = () => {
	const tagManagerArgs = {
		gtmId: 'AW-11408559506\n',
		events: {
			[`${GTM_EVENT.VISIT_PAGE}`]: 'pageview',
		}
	}

	TagManager.initialize(tagManagerArgs)
};

export const logEvent = (event: {event: GTM_EVENT, page: string}) => {
	TagManager.dataLayer({
		dataLayer: {
			event
		}
	});
};
