import router, { useRouter } from "next/router";
import { trpc } from "../utils/trpc";
import { useFieldArray, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import {
	StartSessionInputType,
	startSessionValidator,
} from "../shared/start-session-validator";

import { useState, useEffect } from "react";

import { getTimeDifference, getClockFromMilliseconds } from "../utils/timespan";
import { constants } from "buffer";
import { WorkSession } from "@prisma/client";

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

	const [activeWorkSessions, setActiveWorkSessions] = useState<WorkSession[]>(
		[]
	);

	let { isLoading: activeWorkSessionsLoading } = trpc.useQuery(
		["worksessions.get-active-sessions"],
		{
			onSuccess: (data: WorkSession[]) => {
				setActiveWorkSessions(data);
			},
		}
	);

	const { mutate, isLoading, data } = trpc.useMutation(
		["worksessions.create"],
		{
			onSuccess: (data: WorkSession) => {
				setActiveWorkSessions((x) => [...x, data]);
			},
		}
	);

	const [currentDate, setCurrentDate] = useState<Date>(new Date());

	useEffect(() => {
		setInterval(() => setCurrentDate(new Date()), 1000);
	}, []);

	const isWorkSessionActive =
		activeWorkSessions && activeWorkSessions.length > 0;

	return (
		<div>
			<h2>Work Sessions</h2>
			{isLoading ? (
				<div>Loading...</div>
			) : (
				<div>
					<form
						onSubmit={handleSubmit((data) => {
							if (isWorkSessionActive) {
								return;
							}
							mutate({ ...data, startTime: new Date() });
						})}
						className="w-full"
					>
						<input
							{...register("name")}
							type="text"
							className="input input-bordered w-full block text-gray-400 rounded-md"
						/>
						{errors.name && (
							<p className="text-red-500">{errors.name.message}</p>
						)}
						<div className="w-full">
							{isWorkSessionActive ? (
								<button
									type="submit"
									className="border w-full bg-red-100 rounded-md"
								>
									Stop Session
								</button>
							) : (
								<button
									type="submit"
									className="border w-full bg-blue-100 rounded-md"
								>
									Start Session
								</button>
							)}
						</div>
					</form>
				</div>
			)}
			{activeWorkSessionsLoading ? (
				<div>Loading active work sessions...</div>
			) : (
				isWorkSessionActive && (
					<div>
						{activeWorkSessions.map((x) => {
							return (
								<div key={x.id} className="flex justify-center gap-10">
									<div>{x.name}</div>
									<div>
										{getClockFromMilliseconds(
											getTimeDifference(currentDate, x.startTime)
										)}
									</div>
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
