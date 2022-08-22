import router from "next/router";
import { trpc } from "../utils/trpc";
import { useFieldArray, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import {
	StartSessionInputType,
	startSessionValidator,
} from "../shared/start-session-validator";

const WorkSessions: React.FC<{}> = () => {
	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm<StartSessionInputType>({
		resolver: zodResolver(startSessionValidator),
		defaultValues: {
			name: "Default",
			startTime: new Date(),
		},
	});

	const { mutate, isLoading, data } = trpc.useMutation(["worksessions.create"]);

	if (isLoading)
		return (
			<div className="min-h-screen flex items-center justify-center">
				<p className="text-gray-500">Loading...</p>
			</div>
		);

	return (
		<div>
			<h2>Work Sessions</h2>
			<div>
				<form
					onSubmit={handleSubmit((data) => {
						mutate({ ...data, startTime: new Date() });
					})}
					className="w-full"
				>
					<input
						{...register("name")}
						type="text"
						className="input input-bordered w-full block text-gray-400 rounded-md"
						placeholder="Default"
					/>
					{errors.name && <p className="text-red-500">{errors.name.message}</p>}
					<div className="w-full">
						<button type="submit" className="btn w-full">
							Start Session
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default WorkSessions;
