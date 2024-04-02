import { Reaction } from "@/interfaces/index";
import ObjectId from "bson-objectid";
import { AdJSONInput, IAdVariant } from "@/interfaces/IArtiBot";
import { MongooseModel } from "./IConversation";

export interface Feedback {
  feedback_message: string;
  reaction: Reaction;
  updated_at: Date | string;
}

export type FeedbackData = Partial<
  Record<FeedBackKeyProperty, Feedback | undefined>
>;

export type FeedBackKeyProperty =
  | "overall"
  | "one_liner"
  | "ad_orientation"
  | "image_description"
  | "rationale"
  | "ad_variant_image"
  | "image_text";

export enum FEEDBACK {
  "OVERALL" = "overall",
  "ONE_LINER" = "one_liner",
  "AD_ORIENTATION" = "ad_orientation",
  "IMAGE_DESCRIPTION" = "image_description",
  "RATIONALE" = "rationale",
  "AD_VARIANT_IMAGE" = "ad_variant_image",
  "IMAGE_TEXT" = "image_text",
}

export interface AdCreativeVariant extends IAdVariant {
  feedback?: FeedbackData;
}

/** @deprecated */
export interface IAdCreative extends AdJSONInput {
  id: string;
  conversationId: string;
  messageId: string;
  json: string;
}

export interface IAdCreativeNew extends MongooseModel {
  id: string;
  conversationId: string;
  disclaimer: string;
  companyName: string;
  summary: string;
  adObjective: string;
  messageId: string;
  json: string;
}

export interface IAdCreativeWithVariants extends IAdCreativeNew {
  variants: AdCreativeVariant[];
}
