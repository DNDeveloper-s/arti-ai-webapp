import {threshold} from '@/config/thresholds';

export const emailRegExp = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)

export const freeTierLimit = +(process.env.FREE_TIER_MESSAGE_COUNT ?? threshold.freeTierMessageLimit);

export const personalData = {
	email: 'contact_us@artiai.org'
}
