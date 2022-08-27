import { NextPage } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Header from "../components/header";
import MobileMenu from "../components/mobilemenu";

const Projects: NextPage = () => {
	const { data: session } = useSession();

	return (
		<div className="flex flex-col min-h-screen text-white">
			<Header />
			<div className="flex-grow">
				{session ? (
					<div>Projects</div>
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
			<MobileMenu />
		</div>
	);
};

export default Projects;
