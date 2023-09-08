export const emailRegExp = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)

export const freeTierLimit = +(process.env.FREE_TIER_MESSAGE_COUNT ?? 10);
