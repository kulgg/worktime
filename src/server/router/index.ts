// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { workSessionsRouter } from "./work-sessions-router";
import { workPhasesRouter } from "./work-phases-router";

export const appRouter = createRouter()
	.transformer(superjson)
	.merge("worksessions.", workSessionsRouter)
	.merge("workphases.", workPhasesRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
