import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../server/db/client";
import { env } from "../../../env/server.mjs";

export const authOptions: NextAuthOptions = {
	// Include user.id on session
	callbacks: {
		session({ session, user }) {
			if (session.user) {
				session.user.id = user.id;
			}
			return session;
		},
		async signIn({ user }) {
			const workPhasesCount = await prisma.workPhase.count({
				where: {
					userId: user.id,
				},
			});
			console.log(workPhasesCount);
			if (workPhasesCount === 0) {
				await prisma.workPhase.create({
					data: {
						userId: user.id,
						name: "Untitled Project",
					},
				});
			}
			return true;
		},
	},
	// Configure one or more authentication providers
	adapter: PrismaAdapter(prisma),
	providers: [
		GoogleProvider({
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
			authorization: {
				params: {
					access_type: "offline",
				},
			},
		}),
		// ...add more providers here
	],
};

export default NextAuth(authOptions);
