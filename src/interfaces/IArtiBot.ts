import { IconType } from "react-icons";
import {
  FEEDBACK,
  FeedbackData,
  FeedBackKeyProperty,
  IAdCreative,
} from "@/interfaces/IAdCreative";
import { IMessageModel, MongooseModel } from "@/interfaces/IConversation";
import { SupportedPlatform } from "aws-sdk/clients/redshift";

export interface HandleChunkArgs {
  done?: boolean;
  chunk?: string;
  index?: number;
  is_ad_json?: boolean;
  json?: string;
  data?: any;
}

export interface TabItem {
  id: TabId;
  label: string;
  icon?: IconType;
  color: string;
}

export interface FeedBackKey {
  id: FeedBackKeyProperty;
  label: string;
}

export interface FileObject {
  id: number;
  url: string;
  type: string;
  name: string;
  size: number;
}

type MessageType = "text" | "attachment" | "ad-json";

export interface MessageObj {
  id: string;
  is_ai_response: boolean;
  message: string;
  timestamp: string;
  type: MessageType;
  attachments?: FileObject[];
  json?: string;
}

// export type MessageObj = ChatGPTMessageObj;
export enum ChatGPTRole {
  "USER" = "user",
  "ASSISTANT" = "assistant",
}

export interface ChatGPTMessageObj extends IMessageModel {
  // id?: string;
  role: ChatGPTRole;
  // content: string | null;
  generating?: boolean;
  type?: "ad-json" | "text" | "attachment";
  json?: string;
  adCreatives: IAdCreative[];
}

export interface ArtiBotData {
  tabItems: TabItem[];
  feedBackKeys: FeedBackKey[];
}

export type AdType =
  | "Instagram Story Ad"
  | "LinkedIn Sponsored Content"
  | "Google Display Ad"
  | "YouTube Pre-roll Ad"
  | "Facebook Ad";

type VersionKey = "latest" | `v${number}` | string;

export interface VariantImageObj {
  bgImage: string;
  canvasState?: string | null;
  url: string;
  timestamp: string;
}

export interface IAdVariantImageMap {
  main: string;
  canvasState?: string;
  versionInfo?: {
    totalVersions: number;
    list: VersionKey[];
  };
  versions?: Record<
    VersionKey,
    {
      image: string;
      timestamp: string;
    }
  >;
  generatedImages: { url: string; timestamp: string }[];
}

export interface VariantPost {
  conversationId: string;
  userId: string;
  id: string;
  pageId: string;
  postId: string;
  provider: SupportedPlatform;
}

export interface IAdVariant extends MongooseModel {
  id: string;
  adCreativeId: string;
  variantNo: string;
  adType: string;
  confidence?: string;
  image?: string;
  text: string;
  imageUrl: string;
  images?: VariantImageObj[];
  posts?: VariantPost[];
  oneLiner: string;
  imageDescription: string;
  adOrientation: string;
  rationale: string;
  canvasState?: string;
  feedback?: FeedbackData;
}

export interface AdJSONInput extends MongooseModel {
  adObjective: string;
  companyName: string;
  disclaimer: string;
  summary: string;
  variants: IAdVariant[];
}

export type TabId =
  | "Facebook"
  | "YouTube"
  | "Google"
  | "LinkedIn"
  | "Instagram";
