import { createProtectedRouter } from "./protected-router";
import { z } from "zod";

// Example router with queries that can only be hit if the user requesting is signed in
export const workPhasesRouter = createProtectedRouter().query("get-all", {
	async resolve({ ctx }) {
		return await ctx.prisma.workPhase.findMany({
			where: {
				userId: ctx.session.user.id,
			},
			orderBy: {
				workSessions: {
					_count: "desc",
				},
			},
		});
	},
});
