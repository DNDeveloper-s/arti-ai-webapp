export interface IUserAccount {
  userId: string;
  type: "oauth";
  provider: "facebook" | "google";
  providerAccountId: string;
  access_token: string;
  expires_at: number;
  token_type: "bearer";
  scope: string;
  image?: string;
  name?: string;
}

export interface IUserPages {}

export interface IUserData {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  image?: string;
  token?: string;
  accounts: IUserAccount[];
  pages: IUserPages[];
}

export interface IUserPage {
  account_type: "facebook" | "instagram" | "google";
  id: string;
  name: string;
  page_access_token: string | null;
  picture: string;
}

export interface IUserFacebookPost {
  full_picture: string;
  likes?: LikesData;
  comments?: CommentsData;
  shares?: Shares;
  created_time: string;
  message?: string;
  id: string;
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

export interface LikesData {
  data: Like[];
  paging: Paging;
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

export interface Shares {
  count: number;
}

export interface UserSettingsToUpdate {
  settings: {
    should_send_weekly_insights_email: boolean;
  };
  first_name: string;
  last_name: string;
  imageBlob?: File | null;
}
