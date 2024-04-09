import { CTA_AD } from "@/api/user";
import { String } from "aws-sdk/clients/ec2";

export type ADMANAGER_STATUS_TYPE = "ACTIVE" | "PAUSED";

export interface IFacebookPostDetailsResponse {
  details: IFacebookPost;
  insights: IFacebookPostInsight[];
}

export interface IFacebookPost {
  full_picture: string;
  likes?: LikesData;
  comments?: CommentsData;
  shares?: Shares;
  created_time: string;
  message?: string;
  id: string;
}

export interface IFacebookPostInsight {
  name: string;
  period: string;
  values: IFacebookPostInsightValue[];
  title: string;
  description: string;
  id: string;
}

export interface IFacebookPostInsightValue {
  value: number;
  end_time?: string;
}

export interface LikesData {
  data: Like[];
  paging: Paging;
}

export interface Like {
  id: string;
  name: string;
}

export interface Paging {
  cursors: Cursors;
}

export interface Cursors {
  before: string;
  after: string;
}

export interface Shares {
  count: number;
}

export interface CommentsData {
  data: Comment[];
  paging: Paging;
}

export interface Comment {
  created_time: string;
  from: {
    name: string;
    id: string;
  };
  message: string;
  id: string;
}

export interface IAdCampaign {
  name: string;
  status: "ACTIVE" | "PAUSED";
  objective: string;
  effective_status: string;
  id: string;
}

interface IAdSetInterest {
  id: string;
  name: string;
}

interface IAdSetRegion {
  country: string;
  key: string | number;
  name: string;
}

interface IAdSetZip {
  key: string;
  name?: string;
  primary_city_id?: number;
  region_id?: number;
  country?: string;
}

export type FlexibleSpec = Record<
  "interests" | "behaviors" | "work_employers" | "work_positions",
  IAdSetInterest[]
>;

type CampaignNested = Pick<IAdCampaign, "objective" | "id">;
type AdSetNested = Pick<
  IAdSet,
  "name" | "bid_strategy" | "optimization_goal" | "id" | "promoted_object"
>;

type DestinationType =
  | "APP"
  | "WEBSITE"
  | "MESSENGER"
  | "PHONE_CALL"
  | "ON_AD"
  | "UNDEFINED";

export interface IAdSet {
  id: string;
  name: string;
  optimization_goal: OptimisationGoal;
  bid_strategy: string;
  destination_type?: DestinationType;
  status: string;
  effective_status: string;
  campaign: CampaignNested;
  billing_event: string;
  daily_budget: string;
  start_time: string;
  end_time: string;
  targeting: {
    flexible_spec: FlexibleSpec[];
    geo_locations: {
      countries?: string[];
      regions?: IAdSetRegion[];
      zips?: IAdSetZip[];
      location_types?: string[];
    };
  };
  insights?: {
    data: [undefined] | IFacebookAdInsight[];
    paging: Paging;
  };
  promoted_object?: {
    application_id: string;
    object_store_url: string;
  };
  bid_amount?: string;
}

export interface IFacebookAdInsightAction {
  action_type: string;
  value: string;
}

export interface IFacebookAdInsight {
  actions: IFacebookAdInsightAction[];
  cpm?: string;
  ctr?: string;
  date_start?: string;
  date_stop?: string;
  impressions?: string;
  reach?: string;
  spend?: string;
  unique_clicks?: string;
}

export interface IAd {
  id: string;
  name: string;
  status: "ACTIVE" | "PAUSED";
  effective_status: string;
  campaign: CampaignNested;
  adlabels?: string[];
  adset: AdSetNested;
  creative: {
    id: string;
    image_url?: string;
    status: "ACTIVE" | "PAUSED";
    object_story_spec?: {
      page_id?: string;
      link_data?: {
        call_to_action?: CTA_AD[keyof CTA_AD];
        link?: string;
        message: string;
        image_hash: string;
      };
    };
  };
  insights?: {
    data: [undefined] | IFacebookAdInsight[];
    paging: Paging;
  };
  bid_amount: number;
  last_updated_by_app_id: string;
  preview_shareable_link?: string;
  ad_active_time: string;
}

export type OptimisationGoal =
  | "APP_INSTALLS"
  | "AD_RECALL_LIFT"
  | "ENGAGED_USERS"
  | "EVENT_RESPONSES"
  | "IMPRESSIONS"
  | "LEAD_GENERATION"
  | "LINK_CLICKS"
  | "OFFSITE_CONVERSIONS"
  | "PAGE_LIKES"
  | "POST_ENGAGEMENT"
  | "REACH"
  | "LANDING_PAGE_VIEWS"
  | "VALUE"
  | "THRUPLAY"
  | "APP_INSTALLS_AND_OFFSITE_CONVERSIONS"
  | "CONVERSATIONS"
  | "SOCIAL_IMPRESSIONS";
