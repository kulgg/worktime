import { z } from "zod";

export const startSessionValidator = z.object({
	startTime: z.date(),
	workPhaseId: z.string(),
});

export const finishSessionValidator = z.object({
	id: z.string().cuid(),
});

export type StartSessionInputType = z.infer<typeof startSessionValidator>;
