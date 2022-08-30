import { WorkSessionWithWorkPhase } from "../components/worksessions";
import { getMillisecondsDifference } from "./timespan";

export function totalMilliseconds(
	currentDate: Date,
	workSessions?: WorkSessionWithWorkPhase[]
) {
	return workSessions && workSessions.length > 0
		? workSessions
				.map((x) => {
					return x.finishTime
						? getMillisecondsDifference(x.finishTime, x.startTime)
						: getMillisecondsDifference(currentDate, x.startTime);
				})
				.reduce((acc, x) => acc + x)
		: 0;
}
