import { WorkPhase } from "@prisma/client";
import { WorkSessionWithWorkPhase } from "../components/worksessions";
import { getSessionMilliseconds } from "./worksessions";

interface WorkphaseWithTotalTime {
	workPhase: WorkPhase | undefined;
	milliseconds: number;
}

const getListOfWorkPhasesWithSessions = (
	x: Record<string, WorkSessionWithWorkPhase[]>
): WorkphaseWithTotalTime[] => {
	let results: WorkphaseWithTotalTime[] = [];
	Object.keys(x).forEach((project, i) => {
		let entry: WorkphaseWithTotalTime = {
			milliseconds: 0,
			workPhase: undefined,
		};
		x[project]?.forEach((session) => {
			entry.milliseconds += getSessionMilliseconds(new Date(), session);
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
