import { createProtectedRouter } from "./protected-router";
import { z } from "zod";
import { startSessionValidator } from "../../shared/start-session-validator";

// Example router with queries that can only be hit if the user requesting is signed in
export const workSessionsRouter = createProtectedRouter()
	.query("getSession", {
		resolve({ ctx }) {
			return ctx.session;
		},
	})
	.mutation("create", {
		input: startSessionValidator,
		async resolve({ input, ctx }) {
			return await ctx.prisma.workSession.create({
				data: {
					userId: ctx.session.user.id,
					name: input.name,
					startTime: input.startTime,
				},
			});
		},
	})
	.query("get-active-sessions", {
		async resolve({ ctx }) {
			return await ctx.prisma.workSession.findMany({
				where: {
					userId: ctx.session.user.id,
					finishTime: null,
				},
			});
		},
	});
