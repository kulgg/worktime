import router, { useRouter } from "next/router";
import { trpc } from "../utils/trpc";
import { useFieldArray, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import {
	StartSessionInputType,
	startSessionValidator,
} from "../shared/work-session-validator";

import { useState, useEffect } from "react";

import { getTimeDifference, getClockFromMilliseconds } from "../utils/timespan";
import { constants } from "buffer";
import { WorkSession } from "@prisma/client";

import { FireIcon } from "@heroicons/react/solid";

const WorkSessions: React.FC<{}> = () => {
	const router = useRouter();
	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm<StartSessionInputType>({
		resolver: zodResolver(startSessionValidator),
		defaultValues: {
			name: "Untitled",
			startTime: new Date(),
		},
	});

	const [workSessions, setWorkSessions] = useState<WorkSession[]>([]);

	let { isLoading: activeWorkSessionsLoading } = trpc.useQuery(
		["worksessions.get-todays-sessions"],
		{
			onSuccess: (data: WorkSession[]) => {
				setWorkSessions(data);
			},
		}
	);

	const { mutate: createWorkSession, isLoading: createWorkSessionIsLoading } =
		trpc.useMutation(["worksessions.create"], {
			onSuccess: (data: WorkSession) => {
				setWorkSessions((x) => [...x, data]);
			},
		});

	const { mutate: finishWorkSession } = trpc.useMutation(
		["worksessions.finish"],
		{
			onSuccess: (data: WorkSession) => {
				setWorkSessions((x) =>
					x.map((y) => {
						return y.id === data.id ? data : y;
					})
				);
			},
		}
	);

	const { mutate: deleteWorkSession } = trpc.useMutation(
		["worksessions.delete"],
		{
			onSuccess: (data: WorkSession) => {
				setWorkSessions((x) =>
					x.filter((y) => {
						return y.id !== data.id;
					})
				);
			},
		}
	);

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
						createWorkSession({ ...data, startTime: new Date() });
					})}
					className="w-full px-2 mt-1"
				>
					<input
						{...register("name")}
						type="text"
						className="input w-full rounded-xl p-2 bg-grey-700 text-grey-300"
					/>
					{errors.name && <p className="text-red-500">{errors.name.message}</p>}
					<div className="w-full">
						<button type="submit" className="w-full bg-blue-500 rounded-md">
							Start Session
						</button>
					</div>
				</form>
			</div>
			{activeWorkSessionsLoading ? (
				<div>Loading active work sessions...</div>
			) : (
				workSessions &&
				workSessions.length > 0 && (
					<div>
						{workSessions.map((x) => {
							return x.finishTime ? (
								<div key={x.id} className="flex justify-center gap-10 mt-2">
									<div>{x.name}</div>
									<div>
										{getClockFromMilliseconds(
											getTimeDifference(x.finishTime, x.startTime)
										)}
									</div>
									<button
										onClick={() => deleteWorkSession({ id: x.id })}
										className="bg-red-100 px-2"
									>
										Delete
									</button>
								</div>
							) : (
								<div key={x.id} className="flex justify-center gap-10 mt-2">
									<div>{x.name}</div>
									<div>
										{getClockFromMilliseconds(
											getTimeDifference(currentDate, x.startTime)
										)}
									</div>
									<button
										onClick={() => finishWorkSession({ id: x.id })}
										className="bg-purple-100 px-2"
									>
										Stop
									</button>
								</div>
							);
						})}
					</div>
				)
			)}
		</div>
	);
};

export default WorkSessions;
