import { trpc } from "../utils/trpc";
import { useFieldArray, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import {
	StartSessionInputType,
	startSessionValidator,
} from "../shared/work-session-validator";

import { useState, useEffect, SetStateAction, Dispatch, useMemo } from "react";

import {
	getMillisecondsDifference,
	getClockFromMilliseconds,
	getCurrentDate,
} from "../utils/timespan";
import { constants } from "buffer";
import { Prisma, WorkPhase, WorkSession } from "@prisma/client";

import { FireIcon, StopIcon } from "@heroicons/react/solid";
import { TrashIcon } from "@heroicons/react/outline";
import { QueryClient, useQueryClient } from "react-query";
import { groupBy } from "../utils/arrays";
import { copyWorkTimeToClipboard } from "../utils/clipboard";
import { totalMilliseconds } from "../utils/worksessions";
import { Session } from "next-auth";

const workSessionWithWorkPhase = Prisma.validator<Prisma.WorkSessionArgs>()({
	include: { workPhase: true },
});
export type WorkSessionWithWorkPhase = Prisma.WorkSessionGetPayload<
	typeof workSessionWithWorkPhase
>;

const WorkSessions = (): JSX.Element => {
	const [currentDate, setCurrentDate] = useState<Date>(new Date());

	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm<StartSessionInputType>({
		resolver: zodResolver(startSessionValidator),
		defaultValues: {
			startTime: new Date(),
		},
	});

	const {
		data: workSessions,
		isLoading: activeWorkSessionsLoading,
		refetch: refetchWorkSessions,
	} = trpc.useQuery(["worksessions.get-todays-sessions"], {});

	const { data: workPhases, isLoading: workPhasesIsLoading } = trpc.useQuery([
		"workphases.get-all",
	]);

	const qc = useQueryClient();

	const { mutate: createWorkSession } = trpc.useMutation(
		["worksessions.create"],
		{
			onSuccess: (data: WorkSessionWithWorkPhase) => {
				qc.setQueryData(
					["worksessions.get-todays-sessions"],
					(old: WorkSessionWithWorkPhase[] | undefined) => {
						if (!old) {
							return [data];
						}
						return [...old, data];
					}
				);
			},
		}
	);

	const { mutate: finishWorkSession } = trpc.useMutation(
		["worksessions.finish"],
		{
			onSuccess: (data: WorkSessionWithWorkPhase) => {
				qc.setQueryData(
					["worksessions.get-todays-sessions"],
					(old: WorkSessionWithWorkPhase[] | undefined) => {
						if (!old) {
							return [data];
						}
						return old.map((x) => {
							return x.id === data.id ? data : x;
						});
					}
				);
			},
		}
	);

	const { mutate: deleteWorkSession } = trpc.useMutation(
		["worksessions.delete"],
		{
			onSuccess: (data: WorkSession) => {
				qc.setQueryData(
					["worksessions.get-todays-sessions"],
					(old: WorkSessionWithWorkPhase[] | undefined) => {
						if (!old) {
							return [];
						}
						return old.filter((x) => x.id !== data.id);
					}
				);
			},
		}
	);

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentDate(new Date());
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	}, []);

	let sessionsByProject: Record<string, WorkSessionWithWorkPhase[]> =
		useMemo(() => {
			return workSessions && workSessions.length > 0
				? (sessionsByProject = groupBy(workSessions, (x) => x.workPhaseId))
				: {};
		}, [workSessions]);

	const totalMillisecondsToday =
		workSessions && workSessions.length > 0
			? workSessions
					.map((x) => {
						return x.finishTime
							? getMillisecondsDifference(x.finishTime, x.startTime)
							: getMillisecondsDifference(currentDate, x.startTime);
					})
					.reduce((acc, x) => acc + x)
			: 0;

	return (
		<div>
			<div className="block sm:flex flex-row justify-between items-center">
				<div className="flex gap-1 items-center justify-left">
					<FireIcon className="w-5 h-5" />
					<h2 className="text-lg">Today</h2>
					<span className="text-grey-200 text-[10px] mt-1">
						{currentDate.toDateString()}
					</span>
				</div>
				<div className="text-center hidden sm:flex flex-row gap-2 items-center justify-center">
					<span className="text-grey-200 text-xs">Total</span>
					<div
						className="flex flex-row justify-center gap-1 items-center cursor-pointer"
						onClick={() => copyWorkTimeToClipboard(totalMillisecondsToday)}
					>
						<span className="text-grey-100 font-sans">
							{getClockFromMilliseconds(totalMillisecondsToday)}
						</span>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.2}
							stroke="currentColor"
							className="w-4 h-4"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
							/>
						</svg>
					</div>
				</div>
			</div>
			<div className="py-2"></div>
			{!workPhasesIsLoading && (
				<form
					onSubmit={handleSubmit((data) => {
						console.log(data);
						if (data.workPhaseId === "" && workPhases && workPhases[0]) {
							data.workPhaseId = workPhases[0].id;
						}
						createWorkSession({ ...data, startTime: getCurrentDate() });
					})}
					className="flex justify-between items-center gap-2 mt-2"
				>
					<select
						{...register("workPhaseId")}
						className="input w-full h-9 rounded-xl bg-grey-700 text-grey-100 text-sm"
						defaultValue={0}
					>
						{workPhases &&
							workPhases.map((x) => {
								return (
									<option value={x.id} key={x.id}>
										{x.name}
									</option>
								);
							})}
					</select>
					<div className="">
						<button
							type="submit"
							className="w-32 h-8 bg-blue-500 rounded-md text-sm"
						>
							Start
						</button>
					</div>
				</form>
			)}
			{!activeWorkSessionsLoading &&
				sessionsByProject &&
				Object.keys(sessionsByProject).length > 0 && (
					<div className="bg-grey-600 py-6 text-sm mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
						{Object.keys(sessionsByProject).map((project: string, i) => {
							return (
								<div key={project} className="bg-grey-500 shadow-md">
									<div className="px-4 py-2 bg-grey-400 text-grey-100 flex justify-between items-center">
										<span>
											{sessionsByProject[project]?.at(0)?.workPhase.name}
										</span>
										<div
											className="flex flex-row justify-center gap-1 items-center cursor-pointer"
											onClick={() =>
												copyWorkTimeToClipboard(
													totalMilliseconds(
														currentDate,
														sessionsByProject[project]
													)
												)
											}
										>
											<span className="text-blue-400 font-sans font-medium">
												{getClockFromMilliseconds(
													totalMilliseconds(
														currentDate,
														sessionsByProject[project]
													)
												)}
											</span>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												strokeWidth={1.2}
												stroke="currentColor"
												className="w-4 h-4"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
												/>
											</svg>
										</div>
									</div>
									{sessionsByProject[project]?.map((x, i) => {
										return x.finishTime ? (
											<div
												key={x.id}
												className={`grid grid-cols-7 py-2 px-4 items-center bg-grey-500 group`}
											>
												<div className="col-span-1 text-grey-200 text-xs">
													Finished
												</div>
												<div className="col-span-3"></div>
												<div className="col-span-2 font-sans">
													{getClockFromMilliseconds(
														getMillisecondsDifference(x.finishTime, x.startTime)
													)}
												</div>
												<TrashIcon
													onClick={() => deleteWorkSession({ id: x.id })}
													className="hidden group-hover:block hover:text-red-500 w-4 h-4 place-self-end self-center cursor-pointer text-red-400"
												/>
											</div>
										) : (
											<div
												key={x.id}
												className={`grid grid-cols-7 py-2 px-4 items-center bg-grey-500`}
											>
												<div className="col-span-1 flex justify-center items-center text-white bg-green-600 text-xs rounded-sm">
													<span className="py-[2px]">Active</span>
												</div>
												<div className="col-span-3"></div>
												<div className="col-span-2 font-sans">
													{getClockFromMilliseconds(
														getMillisecondsDifference(currentDate, x.startTime)
													)}
												</div>
												<StopIcon
													onClick={() => finishWorkSession({ id: x.id })}
													className="w-4 h-4 place-self-end self-center cursor-pointer"
												/>
											</div>
										);
									})}
								</div>
							);
						})}
					</div>
				)}
		</div>
	);
};

export default WorkSessions;
