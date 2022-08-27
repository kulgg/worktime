import { createProtectedRouter } from "./protected-router";
import { z } from "zod";
import {
	createWorkPhaseValidator,
	finishSessionValidator,
} from "../../shared/work-session-validator";

// Example router with queries that can only be hit if the user requesting is signed in
export const workPhasesRouter = createProtectedRouter()
	.query("get-all", {
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
	})
	.query("get-all-with-session-counts", {
		async resolve({ ctx }) {
			return await ctx.prisma.workPhase.findMany({
				where: {
					userId: ctx.session.user.id,
				},
				include: {
					_count: {
						select: {
							workSessions: true,
						},
					},
				},
				orderBy: {
					workSessions: {
						_count: "desc",
					},
				},
			});
		},
	})
	.mutation("create", {
		input: createWorkPhaseValidator,
		async resolve({ input, ctx }) {
			return await ctx.prisma.workPhase.create({
				data: {
					name: input.name,
					userId: ctx.session.user.id,
				},
				include: {
					_count: {
						select: {
							workSessions: true,
						},
					},
				},
			});
		},
	})
	.mutation("delete", {
		input: finishSessionValidator,
		async resolve({ input, ctx }) {
			return await ctx.prisma.workPhase.delete({
				where: {
					id: input.id,
				},
			});
		},
	});
