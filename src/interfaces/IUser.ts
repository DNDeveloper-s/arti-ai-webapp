export interface IUserAccount {
  userId: string;
  type: "oauth";
  provider: "facebook" | "google";
  providerAccountId: string;
  access_token: string;
  expires_at: number;
  token_type: "bearer";
}
