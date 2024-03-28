import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import moment from "moment";
import { JWT } from "next-auth/jwt";
import { facebookScopes } from "@/config/meta";

const prisma = new PrismaClient();

function generateNewToken(token: JWT) {
  // Set your JWT secret and options
  const secret = "thisisasecretkey"; // Replace with your secret key
  const accessTokenExpires = moment().add(15, "days");

  // Create a new token with the user data and new expiration time
  return jwt.sign(
    {
      sub: token.sub,
      iat: moment().unix(),
      exp: accessTokenExpires.unix(),
      email: token.email,
      picture: token.picture,
      type: "ACCESS",
    },
    secret
  );
}

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */
async function refreshAccessToken(token) {
  try {
    const url = "https://api.artiai.org/v1/tokens/generate";

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
      method: "POST",
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    };
  } catch (error) {
    console.log(error);

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.OAUTH_CLIENT_ID || "",
      clientSecret: process.env.OAUTH_CLIENT_SECRET || "",
      checks: "none",
    }),

    // when testing facbook auth in dev mode:
    // npx local-ssl-proxy --key localhost-key.pem --cert localhost.pem --source 3001 --target 3000

    // update npm i command
    FacebookProvider({
      clientId:
        process.env.NODE_ENV == "development"
          ? process.env.FACEBOOK_DEV_CLIENT_ID
          : process.env.FACEBOOK_PROD_CLIENT_ID,
      clientSecret:
        process.env.NODE_ENV == "development"
          ? process.env.FACEBOOK_DEV_CLIENT_SECRET
          : process.env.FACEBOOK_PROD_CLIENT_SECRET,
      authorization: `https://www.facebook.com/v11.0/dialog/oauth?scope=${facebookScopes}`,
      // idToken: true,
      // profile(profile: any, token: any) {
      // 	console.log(`Facebook Profile: ${JSON.stringify(profile)} and token: ${JSON.stringify(token)}`);
      // 	return {
      // 		id: profile.id,
      // 		name: profile.name,
      // 		email: profile.email,
      // 		image: profile.image,
      // 	}
      // },
      // userinfo: {
      // 	url: "https://graph.facebook.com/me",
      // 	params: { fields: "id,name,email,picture" },
      // 	async request({ tokens, client, provider }) {
      // 		console.log('making user info request')
      // 		const userInfo = await client.userinfo(tokens.access_token!, {
      // 			// @ts-expect-error
      // 			params: provider.userinfo?.params,
      // 		})
      // 		console.log(JSON.stringify(userInfo))
      // 		return userInfo;
      // 	},
      // },
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "saurabh" },
        password: { label: "Password", type: "password" },
        email: { label: "Email", type: "email" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) return null;

        const passwordsMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!passwordsMatch) return null;

        return user;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, ...rest }) {
      try {
        if (profile?.name) {
          // Split the "name" field into "first_name" and "last_name"
          const [first_name, last_name] = profile.name.split(" ");

          // Use the Prisma client to create or update the user
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
          });

          if (existingUser) {
            // Update the user's first_name and last_name
            const accountObject = {
              type: account.type as string,
              id_token: account.id_token,
              token_type: account.token_type,
              access_token: account.access_token,
              scope: account.scope,
              expires_at: account.expires_at,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
            };

            const existingAccount = await prisma.account.findUnique({
              where: {
                provider_providerAccountId: {
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                },
              },
            });

            if (!existingAccount) {
              await prisma.account.create({
                data: {
                  provider: account.provider as string,
                  providerAccountId: account.providerAccountId as string,
                  type: account.type as string,
                  user: { connect: { id: existingUser.id as string } },
                  id_token: account.id_token,
                  token_type: account.token_type,
                  access_token: account.access_token,
                  scope: account.scope,
                  expires_at: account.expires_at,
                },
              });
            } else {
              await prisma.account.update({
                where: {
                  provider_providerAccountId: {
                    provider: account.provider,
                    providerAccountId: account.providerAccountId,
                  },
                },
                data: accountObject,
              });
            }

            await prisma.user.update({
              where: { email: user.email },
              data: {
                accounts: {
                  connect: {
                    provider_providerAccountId: {
                      provider: account.provider,
                      providerAccountId: account.providerAccountId,
                    },
                  },
                },
              },
            });
          } else {
            // Create a new user with first_name and last_name
            const _user = await prisma.user.create({
              data: {
                email: user.email,
                first_name,
                last_name,
                // Other user properties
              },
            });

            await prisma.account.create({
              data: {
                provider: account.provider as string,
                providerAccountId: account.providerAccountId as string,
                type: account.type as string,
                user: { connect: { id: _user.id } },
                id_token: account.id_token,
                token_type: account.token_type,
                access_token: account.access_token,
                scope: account.scope,
                email: profile.email,
                name: profile.name,
                expires_at: account.expires_at,
              },
            });
          }
        }
      } catch (e) {
        console.log(JSON.stringify(e));
      }
      return true;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
    async session({ session, user, token }) {
      if (!session || !session.user || !session.user.email) return session;

      const existingUser = await prisma.user.findUnique({
        where: { email: session.user.email },
      });

      if (!existingUser) {
        return session;
      }

      return {
        ...session,
        user: {
          first_name: existingUser.first_name,
          last_name: existingUser.last_name,
          email: existingUser.email,
          id: existingUser.id,
          token,
        },
      };
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      // // Return previous token if the access token has not expired yet
      // if (Date.now() < token.accessTokenExpires) {
      //   return token;
      // }
      // // Access token has expired, try to update it
      // return refreshAccessToken(token);
      return token;
    },
  },
  pages: {
    signIn: "/auth",
    error: "/auth", // Error code passed in query string as ?error=
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 30, // 30 days,
  },
  jwt: {
    maxAge: 60 * 60 * 24 * 30, // 30 days
    encode: async ({ secret, token, maxAge }) => {
      if (!token) return "";
      const accessTokenExpires = moment().add(30, "days");

      // Create a new token with the user data and new expiration time
      return jwt.sign(
        {
          sub: token.sub,
          iat: moment().unix(),
          exp: accessTokenExpires.unix(),
          email: token.email,
          picture: token.picture,
          type: "ACCESS",
        },
        "thisisasecretkey"
      );
    },
    decode: async ({ secret, token }) => {
      return {
        ...jwt.decode(token),
        accessToken: token,
      };
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "dndeveloper-saurabh",
  // debug: process.env.NODE_ENV === 'development'
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
