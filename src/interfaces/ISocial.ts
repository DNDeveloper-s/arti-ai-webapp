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
  status: string;
  objective: string;
  effective_status: string;
  id: string;
}

export interface IAdSet {
  id: string;
  name: string;
  optimization_goal: string;
  bid_strategy: string;
  status: string;
  effective_status: string;
  campaign_id: string;
}

export interface IAd {
  id: string;
  name: string;
  status: string;
  effective_status: string;
  adset_id: string;
  campaign_id: string;
  adlabels?: string[];
  adset: {
    name: string;
    id: string;
    bid_strategy: string;
  };
  bid_amount: number;
  last_updated_by_app_id: string;
  preview_shareable_link?: string;
  ad_active_time: string;
}
