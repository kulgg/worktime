import { z } from "zod";

export const startSessionValidator = z.object({
	startTime: z.date(),
	name: z.string(),
});

export type StartSessionInputType = z.infer<typeof startSessionValidator>;
