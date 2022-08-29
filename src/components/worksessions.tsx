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

const WorkSessions: React.FC<{
	currentDate: Date;
	setCurrentDate: Dispatch<SetStateAction<Date>>;
}> = ({ currentDate, setCurrentDate }) => {
	const workSessionWithWorkPhase = Prisma.validator<Prisma.WorkSessionArgs>()({
		include: { workPhase: true },
	});
	type WorkSessionWithWorkPhase = Prisma.WorkSessionGetPayload<
		typeof workSessionWithWorkPhase
	>;

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
			<div className="flex gap-1 items-center justify-left">
				<FireIcon className="w-5 h-5" />
				<h2 className="text-lg">Today's Work Sessions</h2>
			</div>
			<div>
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
			{!activeWorkSessionsLoading && sessionsByProject && (
				<div className="text-sm mt-4 px-2 grid grid-cols-1 sm:grid-cols-2">
					{Object.keys(sessionsByProject).map((project: string) => {
						return (
							<div key={project}>
								{sessionsByProject[project]?.map((x, i) => {
									const backgroundColor =
										i % 2 === 0 ? "bg-grey-500" : "bg-grey-600";
									return x.finishTime ? (
										<div
											key={x.id}
											className={`grid grid-cols-7 py-2 px-4 items-center ${backgroundColor}`}
										>
											<div className="col-span-4">{x.workPhase.name}</div>
											<div className="col-span-2">
												{getClockFromMilliseconds(
													getMillisecondsDifference(x.finishTime, x.startTime)
												)}
											</div>
											<TrashIcon
												onClick={() => deleteWorkSession({ id: x.id })}
												className="w-4 h-4 place-self-end self-center"
											/>
										</div>
									) : (
										<div
											key={x.id}
											className={`grid grid-cols-7 py-2 px-4 items-center ${backgroundColor}`}
										>
											<div className="col-span-4">{x.workPhase.name}</div>
											<div className="col-span-2">
												{getClockFromMilliseconds(
													getMillisecondsDifference(currentDate, x.startTime)
												)}
											</div>
											<StopIcon
												onClick={() => finishWorkSession({ id: x.id })}
												className="w-4 h-4 place-self-end self-center"
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
