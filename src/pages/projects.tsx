import { GetServerSidePropsContext, NextPage } from "next";
import { useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";
import Link from "next/link";
import Header from "../components/header";
import Footer from "../components/footer";
import { BriefcaseIcon } from "@heroicons/react/solid";
import { useForm } from "react-hook-form";
import {
	CreateWorkPhaseInputType,
	createWorkPhaseValidator,
} from "../shared/work-session-validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Prisma, WorkPhase } from "@prisma/client";
import { useState } from "react";
import { PencilIcon, PencilAltIcon, TrashIcon } from "@heroicons/react/outline";
import PageContainer from "../components/pagecontainer";
import SignIn from "../components/signin";
import { useQueryClient } from "react-query";
import { Session, unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";

const Projects = () => {
	const { data: session } = useSession();

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

	const [editMode, setEditMode] = useState<boolean>(false);

	const { data: workPhases, isLoading } = trpc.useQuery([
		"workphases.get-all-with-session-counts",
	]);

	const qc = useQueryClient();

	const { mutate: createWorkPhase, isLoading: createWorkPhaseIsLoading } =
		trpc.useMutation(["workphases.create"], {
			onSuccess: (createdWorkPhase: WorkPhaseWithSessionCounts) => {
				qc.setQueryData(
					["workphases.get-all-with-session-counts"],
					(old: WorkPhaseWithSessionCounts[] | undefined) => {
						if (!old) {
							return [createdWorkPhase];
						}
						return [...old, createdWorkPhase];
					}
				);
			},
		});

	const { mutate: deleteWorkPhase, isLoading: deleteWorkPhaseIsLoading } =
		trpc.useMutation(["workphases.delete"], {
			onSuccess: (deletedWorkPhase) => {
				qc.setQueryData(
					["workphases.get-all-with-session-counts"],
					(old: WorkPhaseWithSessionCounts[] | undefined) => {
						if (!old) {
							return [];
						}
						return old.filter((x) => x.id !== deletedWorkPhase.id);
					}
				);
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
		<PageContainer>
			<main className="overflow-hidden mt-4 px-3">
				<div className="flex items-center justify-between">
					<div className="flex gap-2 items-center">
						<BriefcaseIcon className="w-5 h-5" />
						<h2 className="text-lg">Projects</h2>
					</div>
					<div className="text-sm text-grey-100"></div>
				</div>
				<div className="mt-4">
					{session ? (
						!isLoading &&
						workPhases && (
							<div>
								<div>
									<label
										htmlFor="small-toggle"
										className="inline-flex relative items-center justify-end cursor-pointer"
									>
										<input
											type="checkbox"
											value=""
											id="small-toggle"
											className="sr-only peer"
											onClick={() => setEditMode((y) => !y)}
										/>
										<div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
										<span className="ml-1 text-xs font-medium text-grey-200">
											Edit Mode
										</span>
									</label>
									<div className="grid grid-cols-6 text-grey-200 text-xs">
										<div className="col-span-4">Name</div>
										<div className="col-span-1">Sessions</div>
									</div>
									{workPhases.map((x, i) => {
										const backgroundColor =
											i % 2 === 0 ? "bg-grey-500" : "bg-grey-600";
										return (
											<div
												key={x.id}
												className={`grid grid-cols-6 text-sm py-2 px-2 ${backgroundColor}`}
											>
												<div className="col-span-4">{x.name}</div>
												<div className="col-span-1 px-2">
													{x._count.workSessions}
												</div>
												{editMode && (
													<div className="flex justify-end items-center text-red-400">
														<TrashIcon
															onClick={() => deleteWorkPhase({ id: x.id })}
															className="w-4 h-4"
														/>
													</div>
												)}
											</div>
										);
									})}
								</div>
								<div className="flex items-center justify-center">
									<div className="py-4 w-96 bg-grey-600">
										{!createWorkPhaseIsLoading && (
											<div>
												<form
													onSubmit={handleSubmit((data) => {
														createWorkPhase(data);
													})}
													className="flex items-center gap-2"
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
											</div>
										)}
									</div>
								</div>
							</div>
						)
					) : (
						<SignIn text="projects" />
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

	return {
		props: {
			session: session,
		},
	};
};

export default Projects;
