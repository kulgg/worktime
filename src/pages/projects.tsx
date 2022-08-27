import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";
import Link from "next/link";
import Header from "../components/header";
import MobileMenu from "../components/mobilemenu";
import { ArrowsExpandIcon, BriefcaseIcon } from "@heroicons/react/solid";

const Projects: NextPage = () => {
	const { data: session } = useSession();
	const { data, isLoading } = trpc.useQuery([
		"workphases.get-all-with-session-counts",
	]);

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
						data &&
						data.map((x) => {
							return (
								<div
									key={x.id}
									className="grid grid-cols-5 px-2 py-1 bg-grey-500"
								>
									<div className="col-span-4">{x.name}</div>
									<div className="col-span-1">{x._count.workSessions}</div>
								</div>
							);
						})
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
