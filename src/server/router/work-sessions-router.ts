import { createProtectedRouter } from "./protected-router";
import { z } from "zod";
import {
	finishSessionValidator,
	startSessionValidator,
} from "../../shared/work-session-validator";

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
	.mutation("finish", {
		input: finishSessionValidator,
		async resolve({ input, ctx }) {
			return await ctx.prisma.workSession.update({
				where: {
					id: input.id,
				},
				data: {
					finishTime: new Date(),
				},
			});
		},
	})
	.mutation("delete", {
		input: finishSessionValidator,
		async resolve({ input, ctx }) {
			return await ctx.prisma.workSession.delete({
				where: {
					id: input.id,
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
	})
	.query("get-todays-sessions", {
		async resolve({ ctx }) {
			const midnight = new Date();
			midnight.setHours(0, 0, 0, 0);
			return await ctx.prisma.workSession.findMany({
				where: {
					userId: ctx.session.user.id,
					startTime: {
						gte: midnight,
					},
				},
			});
		},
	});
