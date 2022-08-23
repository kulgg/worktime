import { z } from "zod";

export const startSessionValidator = z.object({
	startTime: z.date(),
	name: z.string().min(1),
});

export const finishSessionValidator = z.object({
	id: z.string().cuid(),
});

export type StartSessionInputType = z.infer<typeof startSessionValidator>;
