import { CalendarIcon } from "@heroicons/react/solid";
import "datejs";
import { GetServerSidePropsContext } from "next";
import { unstable_getServerSession } from "next-auth";
import { useState } from "react";
import PageContainer from "../components/page-container";
import { WorkSessionWithWorkPhase } from "../components/worksessions";
import { groupBy } from "../utils/arrays";
import { trpc } from "../utils/trpc";
import { authOptions } from "./api/auth/[...nextauth]";

const timeFrames = ["Week", "Month", "Year"];

const Calendar = (): JSX.Element => {
	const [activeTimeFrame, setActiveTimeFrame] = useState<number>(1);

	const { data: workSessions } = trpc.useQuery([
		"worksessions.get-sessions-after",
		{ after: Date.today().add(-30).days() },
	]);

	const sessionsByProject: Record<string, WorkSessionWithWorkPhase[]> =
		workSessions && workSessions.length > 0
			? groupBy(workSessions, (x) => x.workPhaseId)
			: {};

	return (
		<PageContainer>
			<main className="overflow-hidden">
				<div className="flex items-center justify-between">
					<div className="flex gap-2 items-center">
						<CalendarIcon className="w-5 h-5" />
						<h2 className="text-lg">Calendar</h2>
					</div>
				</div>
				<div className="mt-6 w-full bg-grey-700 stats stats-vertical lg:stats-horizontal shadow">
					<div className="stat">
						<div className="stat-title text-grey-100 text-sm">Week</div>
						<div className="stat-value font-medium text-grey-100 text-xl">
							{Object.keys(sessionsByProject).map((project: string, i) => {
								return (
									<div>
										{sessionsByProject[project]?.map((x) => (
											<div>{x.startTime.toDateString()}</div>
										))}
									</div>
								);
							})}
						</div>
					</div>
					<div className="stat">
						<div className="stat-title text-grey-100 text-sm">Month</div>
						<div className="stat-value font-medium text-grey-100 text-xl">
							160 h
						</div>
					</div>
				</div>
				<div className="mt-5">
					<div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
						<ul className="flex flex-wrap -mb-px">
							{timeFrames.map((x, i) => {
								const classString =
									i == activeTimeFrame
										? "cursor-pointer text-base inline-block p-4 text-blue-400 rounded-t-lg border-b-2 border-blue-400 active"
										: "cursor-pointer text-base inline-block p-4 rounded-t-lg border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300";

								return (
									<li className="mr-2">
										<a
											onClick={() => setActiveTimeFrame(i)}
											className={classString}
										>
											{x}
										</a>
									</li>
								);
							})}
						</ul>
					</div>
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
