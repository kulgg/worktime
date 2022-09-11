import { WorkSessionWithWorkPhase } from "../components/worksessions";
import { getMillisecondsDifference } from "./timespan";

export function getTotalMilliseconds(
	currentDate: Date,
	workSessions?: WorkSessionWithWorkPhase[]
) {
	return workSessions && workSessions.length > 0
		? workSessions
				.map((x) => {
					return getSessionMilliseconds(currentDate, x);
				})
				.reduce((acc, x) => acc + x)
		: 0;
}

const getSessionMilliseconds = (
	currentDate: Date,
	x: WorkSessionWithWorkPhase
): number => {
	return x.finishTime
		? getMillisecondsDifference(x.finishTime, x.startTime)
		: getMillisecondsDifference(currentDate, x.startTime);
};

export { getSessionMilliseconds };
