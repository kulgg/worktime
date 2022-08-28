import { z } from "zod";

export const startSessionValidator = z.object({
	startTime: z.date(),
	workPhaseId: z.string().cuid(),
});

export const finishSessionValidator = z.object({
	id: z.string().cuid(),
});

export const createWorkPhaseValidator = z.object({
	name: z.string().min(1),
});

export type StartSessionInputType = z.infer<typeof startSessionValidator>;
export type CreateWorkPhaseInputType = z.infer<typeof createWorkPhaseValidator>;
