import { CalendarIcon } from "@heroicons/react/solid";
import { GetServerSidePropsContext } from "next";
import { unstable_getServerSession } from "next-auth";
import Image from "next/image";
import { useState } from "react";
import LoadingSVG from "../assets/puff.svg";
import ClipboardTimer from "../components/clipboard-timer";
import PageContainer from "../components/page-container";
import { WorkSessionWithWorkPhase } from "../components/worksessions";
import { groupBy } from "../utils/arrays";
import {
	getStartOfMonth,
	getStartOfWeek,
	getStartOfYear,
} from "../utils/date-helper";
import { getHoursClockFromMilliseconds } from "../utils/time-helper";
import { trpc } from "../utils/trpc";
import {
	getListOfWorkPhasesWithSessions,
	WorkphaseWithTotalTime,
} from "../utils/workphase-helper";
import { authOptions } from "./api/auth/[...nextauth]";

interface TimeFrameStats {
	name: string;
	afterDate: Date;
}

const timeFrames: TimeFrameStats[] = [
	{ name: "Week", afterDate: getStartOfWeek() },
	{ name: "Month", afterDate: getStartOfMonth() },
	{ name: "Year", afterDate: getStartOfYear() },
];

const Calendar = (): JSX.Element => {
	const [activeTimeFrameIndex, setActiveTimeFrameIndex] = useState<number>(1);
	const activeTimeFrame = timeFrames[activeTimeFrameIndex];

	if (!activeTimeFrame) {
		return <div>What da? Are you hacking??</div>;
	}

	const { data: workSessions, isLoading: workSessionsIsLoading } =
		trpc.useQuery([
			"worksessions.get-sessions-after",
			{ after: activeTimeFrame.afterDate },
		]);

	const sessionsByProject: Record<string, WorkSessionWithWorkPhase[]> =
		workSessions && workSessions.length > 0
			? groupBy(workSessions, (x) => x.workPhaseId)
			: {};

	const projectList: WorkphaseWithTotalTime[] =
		getListOfWorkPhasesWithSessions(sessionsByProject);

	const now = new Date();

	const totalMilliseconds: number = projectList.reduce(
		(acc, curr) => acc + curr.milliseconds,
		0
	);

	return (
		<PageContainer>
			<main className="overflow-hidden">
				<div className="flex items-center justify-between">
					<div className="flex gap-2 items-center">
						<CalendarIcon className="w-5 h-5" />
						<h2 className="text-lg">Calendar</h2>
					</div>
				</div>
				<div className="mt-5">
					<div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
						<ul className="flex flex-wrap -mb-px">
							{timeFrames.map((x, i) => {
								const classString =
									i == activeTimeFrameIndex
										? "cursor-pointer text-base inline-block p-4 text-blue-400 rounded-t-lg border-b-2 border-blue-400 active"
										: "cursor-pointer text-base inline-block p-4 rounded-t-lg border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300";

								return (
									<li key={i} className="mr-2">
										<a
											onClick={() => setActiveTimeFrameIndex(i)}
											className={classString}
										>
											{x.name}
										</a>
									</li>
								);
							})}
						</ul>
					</div>
					{workSessionsIsLoading ? (
						<div className="flex animate-fade-in-delay justify-center mt-5">
							<Image src={LoadingSVG} alt="loading..." width={50} height={50} />
						</div>
					) : (
						<div>
							<div className="mt-2 stat bg-grey-700">
								<div className="stat-title text-grey-100 text-sm">
									Total Work Time
								</div>
								<ClipboardTimer
									clock={getHoursClockFromMilliseconds(totalMilliseconds)}
									clockClassName="stat-value font-medium text-grey-100 text-xl"
								/>
							</div>
							<div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
								{projectList.map((x) => {
									return (
										<div key={x.workPhase?.id} className="shadow-md">
											<div className="bg-grey-400 text-grey-100 flex items-center text-sm h-10 px-2">
												{x.workPhase?.name}
											</div>
											<div className="flex items-center justify-between px-3 bg-grey-500">
												<div className="text-grey-200 text-xs">
													{x.sessions} Session{x.sessions > 1 ? "s" : ""}
												</div>
												<ClipboardTimer
													clock={getHoursClockFromMilliseconds(x.milliseconds)}
													clockClassName="font-semibold text-blue-400 flex items-center justify-center h-8"
												/>
											</div>
										</div>
									);
								})}
							</div>
						</div>
					)}
				</div>
			</main>
		</PageContainer>
	);
};

export const getServerSideProps = async (
	context: GetServerSidePropsContext
) => {
	const session = await unstable_getServerSession(
		context.req,
		context.res,
		authOptions
	);

	if (!session) {
		return {
			redirect: {
				destination: "/",
				permanent: false,
			},
		};
	}

	return {
		props: {
			session: session,
		},
	};
};

export default Calendar;
