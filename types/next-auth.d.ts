import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      token?: {
        accessToken?: string;
        email: string;
        exp: number;
        iat: number;
        picture: null | string;
        sub: string;
        type: "ACCESS" | "REFRESH";
      };
      id?: string;
      first_name?: string;
      last_name?: string;
    } & DefaultSession["user"];
  }
}
