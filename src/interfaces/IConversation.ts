import { ChatGPTMessageObj, ChatGPTRole } from "@/interfaces/IArtiBot";
import { IAdCreative } from "@/interfaces/IAdCreative";
import ObjectId from "bson-objectid";
import { ISODateString } from "next-auth";

export interface IConversation extends MongooseModel {
  id: string;
  messages: ChatGPTMessageObj[];
  last_activity: number | string | Date;
  title: string;
  has_activity?: boolean | undefined;
  json?: string | null | boolean;
  adCreatives?: IAdCreative[];
  adCampaigns?: ICampaignMongoDB[];
  conversation_type: ConversationType;
  lastAdCreativeCreatedAt?: ISODateString | Date;
  project_name: string;
  businessId: string;
  userId: string;
}

export enum ConversationType {
  /**@deprecated */
  "STRATEGY" = "strategy",
  "SOCIAL_MEDIA_POST" = "social_media_post",
  "AD_CREATIVE" = "ad_creative",
}

export const ValidConversationTypes = [
  ConversationType.STRATEGY,
  ConversationType.SOCIAL_MEDIA_POST,
  ConversationType.AD_CREATIVE,
];

export interface MongooseModel {
  createdAt?: ISODateString;
  updatedAt?: ISODateString;
}

export interface IMessageModel extends MongooseModel {
  id: string;
  role: ChatGPTRole;
  content: string | null;
  conversationId: string;
}

export interface IConversationModel extends MongooseModel {
  id: string;
  messages: IMessageModel[];
  userId: string;
  conversation_type: ConversationType;
}

// campaignId: "120207183720580340";
// adAccountId: "act_167093713134679";
// accessToken: "EAAJKrtHx2ZB8BO9orrlrw8nsIZC1484ZCHZAeDmf0Sm4FKECCTqJwbEHW5P3Cu1SNmNzKn06limWHzM67QXlrZCoiyoOZC632GiKwi0fGfAbDyRthGtmuxa2lZAKdyjmnZAPTqZABW3p1pVFY2h54wlnZCdhhix7DoRHCweOwYVdnRnuBwKdoJUkZAlCwED";
// variantId: null;
// userId: null;
// conversationId: "654da5504760184dfabb29ca";

export interface ICampaignMongoDB {
  id: string;
  campaignId: string;
  adAccountId: string;
  accessToken: string;
  variantId: string;
  userId: string;
  conversationId: string;
  adsets: IAdsetMongoDB[];
}

export interface IAdsetMongoDB {
  id: string;
  adsetId: string;
  adAccountId: string;
  accessToken: string;
  adCreativeId: string;
  campaignId: string;
  ads: IAdMongoDB[];
}

export interface IAdMongoDB {
  id: string;
  adId: string;
  adsetId: string;
  adAccountId: string;
  accessToken: string;
  variantId: string;
}
