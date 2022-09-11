import { WorkPhase } from "@prisma/client";
import { WorkSessionWithWorkPhase } from "../components/worksessions";
import { getSessionMilliseconds } from "./worksessions";

interface WorkphaseWithTotalTime {
	workPhase: WorkPhase | undefined;
	milliseconds: number;
	sessions: number;
}

const getListOfWorkPhasesWithSessions = (
	x: Record<string, WorkSessionWithWorkPhase[]>
): WorkphaseWithTotalTime[] => {
	const results: WorkphaseWithTotalTime[] = [];
	Object.keys(x).forEach((project, i) => {
		const entry: WorkphaseWithTotalTime = {
			milliseconds: 0,
			sessions: 0,
			workPhase: undefined,
		};
		x[project]?.forEach((session) => {
			entry.milliseconds += getSessionMilliseconds(new Date(), session);
			entry.sessions += 1;
		});

		if (entry && entry.milliseconds > 0) {
			entry.workPhase = x[project]![0]!.workPhase;
			results.push(entry);
		}
	});
	return results;
};

export { getListOfWorkPhasesWithSessions };
export type { WorkphaseWithTotalTime };
