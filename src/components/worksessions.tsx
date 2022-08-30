import { trpc } from "../utils/trpc";
import { useFieldArray, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import {
	StartSessionInputType,
	startSessionValidator,
} from "../shared/work-session-validator";

import { useState, useEffect, SetStateAction, Dispatch } from "react";

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

const workSessionWithWorkPhase = Prisma.validator<Prisma.WorkSessionArgs>()({
	include: { workPhase: true },
});
export type WorkSessionWithWorkPhase = Prisma.WorkSessionGetPayload<
	typeof workSessionWithWorkPhase
>;

const WorkSessions: React.FC<{
	currentDate: Date;
	setCurrentDate: Dispatch<SetStateAction<Date>>;
}> = ({ currentDate, setCurrentDate }) => {
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

	let {
		data: workSessions,
		isLoading: activeWorkSessionsLoading,
		refetch: refetchWorkSessions,
	} = trpc.useQuery(["worksessions.get-todays-sessions"], {});

	const { data: workPhases, isLoading: workPhasesIsLoading } = trpc.useQuery([
		"workphases.get-all",
	]);

	const qc = useQueryClient();

	const { mutate: createWorkSession, isLoading: createWorkSessionIsLoading } =
		trpc.useMutation(["worksessions.create"], {
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
		});

	const { mutate: finishWorkSession, isLoading: finishWorkSessionIsLoading } =
		trpc.useMutation(["worksessions.finish"], {
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
		});

	const { mutate: deleteWorkSession, isLoading: deleteWorkSessionIsLoading } =
		trpc.useMutation(["worksessions.delete"], {
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
		});

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentDate(new Date());
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	}, []);

	let sessionsByProject: Record<string, WorkSessionWithWorkPhase[]> = {};
	if (workSessions && workSessions.length > 0) {
		sessionsByProject = groupBy(workSessions, (x) => x.workPhaseId);
	}

	return (
		<div>
			<div className="flex gap-1 items-center justify-left px-3">
				<FireIcon className="w-5 h-5" />
				<h2 className="text-lg">Today's Work Sessions</h2>
			</div>
			<div className="px-3">
				{!workPhasesIsLoading && (
					<form
						onSubmit={handleSubmit((data) => {
							console.log(data);
							if (data.workPhaseId === "" && workPhases && workPhases[0]) {
								data.workPhaseId = workPhases[0].id;
							}
							createWorkSession({ ...data, startTime: getCurrentDate() });
						})}
						className="w-full px-2 flex justify-center items-center gap-2 mt-2"
					>
						<select
							{...register("workPhaseId")}
							className="input w-[300px] rounded-xl p-2 bg-grey-700 text-grey-100 text-sm"
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
								className="w-24 h-8 bg-blue-500 rounded-md text-sm"
							>
								Start
							</button>
						</div>
					</form>
				)}
			</div>
			{!activeWorkSessionsLoading &&
				sessionsByProject &&
				Object.keys(sessionsByProject).length > 0 && (
					<div className="bg-grey-700 py-6 text-sm mt-4 px-4 grid grid-flow-row-dense grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 sm:gap-2 gap-4">
						{Object.keys(sessionsByProject).map((project: string, i) => {
							return (
								<div key={project} className="bg-grey-500">
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
											<span className="text-blue-400 text-base">
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
												className={`grid grid-cols-7 py-2 px-4 items-center bg-grey-500`}
											>
												<div className="col-span-1 text-grey-200 text-xs">
													Finished
												</div>
												<div className="col-span-3"></div>
												<div className="col-span-2">
													{getClockFromMilliseconds(
														getMillisecondsDifference(x.finishTime, x.startTime)
													)}
												</div>
												<TrashIcon
													onClick={() => deleteWorkSession({ id: x.id })}
													className="w-4 h-4 place-self-end self-center cursor-pointer"
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
												<div className="col-span-2">
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
