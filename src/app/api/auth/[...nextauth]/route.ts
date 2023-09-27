import NextAuth, {AuthOptions} from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import {PrismaAdapter} from "@auth/prisma-adapter";
import {PrismaClient} from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const authOptions: AuthOptions = {
	adapter: PrismaAdapter(prisma),
	providers: [
		GoogleProvider({
			clientId: process.env.OAUTH_CLIENT_ID || '',
			clientSecret: process.env.OAUTH_CLIENT_SECRET || '',
			checks: 'none',
		}),
		CredentialsProvider({
			name: 'credentials',
			credentials: {
				username: {label: 'Username', type: 'text', placeholder: 'saurabh'},
				password: {label: 'Password', type: 'password'},
				email: {label: 'Email', type: 'email'},
			},
			async authorize(credentials){
				console.log('credentials - ', credentials);
				if(!credentials?.email || !credentials?.password) return null;

				const user = await prisma.user.findUnique({
					where: {email: credentials.email}
				})

				if(!user) return null;

				const passwordsMatch = await bcrypt.compare(credentials.password, user.password);

				if(!passwordsMatch) return null;

				return user;
			}
		})
	],
	callbacks: {
		async signIn({user, account, profile}) {
			// TODO: REFACTOR THIS CODE
			if (account?.provider === 'google' && profile?.name) {
				// Split the "name" field into "first_name" and "last_name"
				const [first_name, last_name] = profile.name.split(' ');

				// Use the Prisma client to create or update the user
				const existingUser = await prisma.user.findUnique({
					where: { email: user.email },
				});
				console.log('Line 61: - ');

				if (existingUser) {
					// Update the user's first_name and last_name
					console.log('Line 65: - ');
					const accountObject = {
						type: account.type as string,
						id_token: account.id_token,
						token_type: account.token_type,
						access_token: account.access_token,
						scope: account.scope,
						expires_at: account.expires_at,
						provider: account.provider,
						providerAccountId: account.providerAccountId
					}

					const existingAccount = await prisma.account.findUnique({
						where: {
							provider_providerAccountId: {
								provider: account.provider,
								providerAccountId: account.providerAccountId
							}
						}
					});

					if(!existingAccount) {
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
									providerAccountId: account.providerAccountId
								}
							},
							data: accountObject,
						});
					}

					console.log('Line 112: - ');
					await prisma.user.update({
						where: { email: user.email },
						data: { accounts: {
							connect: {
								provider_providerAccountId: {
									provider: account.provider,
									providerAccountId: account.providerAccountId
								}
							}
						}},
					});
				} else {
					// Create a new user with first_name and last_name
					console.log('Line 71: - ');

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
							user: { connect: { id: _user.id,  } },
							id_token: account.id_token,
							token_type: account.token_type,
							access_token: account.access_token,
							scope: account.scope,
							expires_at: account.expires_at,
						},
					});

				}
			}
			return true;
		},
		async redirect({ url, baseUrl }) {
			return baseUrl
		},
		async session({ session, user, token }) {
			return session
		},
		async jwt({ token, user, account, profile, isNewUser }) {
			return token
		}
		// Other callback functions
	},
	pages: {

	},
	session: {
		strategy: 'jwt'
	},
	secret: process.env.NEXTAUTH_SECRET || 'dndeveloper-saurabh',
	debug: process.env.NODE_ENV === 'development'
}

const handler = NextAuth(authOptions)

export {handler as GET, handler as POST};
