import { trpc } from "../utils/trpc";
import { useFieldArray, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import {
	StartSessionInputType,
	startSessionValidator,
} from "../shared/work-session-validator";

import { useState, useEffect } from "react";

import {
	getMillisecondsDifference,
	getClockFromMilliseconds,
	getCurrentDate,
} from "../utils/timespan";
import { constants } from "buffer";
import { Prisma, WorkPhase, WorkSession } from "@prisma/client";

import { FireIcon, StopIcon } from "@heroicons/react/solid";
import { TrashIcon } from "@heroicons/react/outline";

const WorkSessions: React.FC<{}> = () => {
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

	const [workSessions, setWorkSessions] = useState<WorkSessionWithWorkPhase[]>(
		[]
	);

	let { isLoading: activeWorkSessionsLoading } = trpc.useQuery(
		["worksessions.get-todays-sessions"],
		{
			onSuccess: (data: WorkSessionWithWorkPhase[]) => {
				setWorkSessions(data);
			},
		}
	);

	const { data: workPhases, isLoading: workPhasesIsLoading } = trpc.useQuery([
		"workphases.get-all",
	]);

	const { mutate: createWorkSession, isLoading: createWorkSessionIsLoading } =
		trpc.useMutation(["worksessions.create"], {
			onSuccess: (data: WorkSessionWithWorkPhase) => {
				setWorkSessions((x) => [...x, data]);
			},
		});

	const { mutate: finishWorkSession, isLoading: finishWorkSessionIsLoading } =
		trpc.useMutation(["worksessions.finish"], {
			onSuccess: (data: WorkSessionWithWorkPhase) => {
				setWorkSessions((x) =>
					x.map((y) => {
						return y.id === data.id ? data : y;
					})
				);
			},
		});

	const { mutate: deleteWorkSession, isLoading: deleteWorkSessionIsLoading } =
		trpc.useMutation(["worksessions.delete"], {
			onSuccess: (data: WorkSession) => {
				setWorkSessions((x) =>
					x.filter((y) => {
						return y.id !== data.id;
					})
				);
			},
		});

	const [currentDate, setCurrentDate] = useState<Date>(new Date());

	useEffect(() => {
		setInterval(() => setCurrentDate(new Date()), 1000);
	}, []);

	return (
		<div>
			<div className="flex gap-1 items-center justify-left">
				<FireIcon className="w-5 h-5" />
				<h2 className="text-lg">Work Sessions</h2>
			</div>
			<div>
				<form
					onSubmit={handleSubmit((data) => {
						createWorkSession({ ...data, startTime: getCurrentDate() });
					})}
					className="w-full px-2 flex items-center gap-2 mt-2"
				>
					{!workPhasesIsLoading && (
						<select
							{...register("workPhaseId")}
							className="input w-full rounded-xl p-2 bg-grey-700 text-grey-100 text-sm"
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
					)}
					<div className="">
						<button
							type="submit"
							className="w-24 h-8 bg-blue-500 rounded-md text-sm"
						>
							Start Session
						</button>
					</div>
				</form>
			</div>
			{!activeWorkSessionsLoading && workSessions && workSessions.length > 0 && (
				<div className="text-sm mt-4 px-2">
					{workSessions.map((x, i) => {
						const backgroundColor = i % 2 === 0 ? "bg-grey-500" : "bg-grey-600";
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
									className="w-5 h-5 place-self-end"
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
									className="w-5 h-5 place-self-end"
								/>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
};

export default WorkSessions;
