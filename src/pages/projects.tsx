import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";
import Link from "next/link";
import Header from "../components/header";
import MobileMenu from "../components/mobilemenu";
import { ArrowsExpandIcon, BriefcaseIcon } from "@heroicons/react/solid";
import { useForm } from "react-hook-form";
import {
	CreateWorkPhaseInputType,
	createWorkPhaseValidator,
} from "../shared/work-session-validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Prisma, WorkPhase } from "@prisma/client";
import { useState } from "react";

const Projects: NextPage = () => {
	const workPhaseWithSessionCounts = Prisma.validator<Prisma.WorkPhaseArgs>()({
		include: {
			_count: {
				select: {
					workSessions: true,
				},
			},
		},
	});
	type WorkPhaseWithSessionCounts = Prisma.WorkPhaseGetPayload<
		typeof workPhaseWithSessionCounts
	>;

	const { data: session } = useSession();

	const [workPhases, setWorkPhases] = useState<WorkPhaseWithSessionCounts[]>(
		[]
	);

	const { data, isLoading } = trpc.useQuery(
		["workphases.get-all-with-session-counts"],
		{
			onSuccess: (phases) => {
				setWorkPhases(phases);
			},
		}
	);

	const { mutate: createWorkPhase, isLoading: createWorkPhaseIsLoading } =
		trpc.useMutation(["workphases.create"], {
			onSuccess: (createdWorkPhase) => {
				setWorkPhases((x) => [...x, createdWorkPhase]);
			},
		});

	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm<CreateWorkPhaseInputType>({
		resolver: zodResolver(createWorkPhaseValidator),
		defaultValues: {
			name: "Untitled",
		},
	});

	return (
		<div className="flex flex-col min-h-screen text-white">
			<Header />
			<main className="overflow-hidden mt-4 flex-grow container px-3">
				<div className="flex gap-2 items-center justify-left">
					<BriefcaseIcon className="w-5 h-5" />
					<h2 className="text-lg">Projects</h2>
				</div>
				<div className="px-2 mt-2">
					{session ? (
						!isLoading &&
						data && (
							<div>
								<div className="grid grid-cols-5 text-grey-200 text-xs">
									<div className="col-span-4">Name</div>
									<div className="col-span-1">Sessions</div>
								</div>
								{workPhases.map((x, i) => {
									const backgroundColor =
										i % 2 === 0 ? "bg-grey-500" : "bg-grey-600";
									return (
										<div
											key={x.id}
											className={`grid grid-cols-5 text-sm py-2 px-2 ${backgroundColor}`}
										>
											<div className="col-span-4">{x.name}</div>
											<div className="col-span-1 text-center">
												{x._count.workSessions}
											</div>
										</div>
									);
								})}
								<div>
									{!createWorkPhaseIsLoading && (
										<form
											onSubmit={handleSubmit((data) => {
												createWorkPhase(data);
											})}
											className="w-full flex items-center gap-2 mt-5"
										>
											<input
												{...register("name")}
												className="input w-full rounded-xl p-2 bg-grey-700 text-grey-100 text-sm"
												defaultValue={0}
												type="text"
											/>
											<div className="">
												<button
													type="submit"
													className="w-24 h-8 bg-blue-500 rounded-md text-sm"
												>
													Add Project
												</button>
											</div>
										</form>
									)}
								</div>
							</div>
						)
					) : (
						<div className="text-center text-grey-200 text-lg mt-4">
							<Link
								href="/api/auth/signin"
								className="text-blue-400 active:text-blue-300"
							>
								Sign In
							</Link>{" "}
							to view your projects
						</div>
					)}
				</div>
			</main>
			<MobileMenu />
		</div>
	);
};

export default Projects;
