import { FireIcon } from "@heroicons/react/solid";
import type { GetServerSidePropsContext } from "next";
import { unstable_getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import PageContainer from "../components/pagecontainer";
import WorkSessions from "../components/worksessions";
import { authOptions } from "./api/auth/[...nextauth]";

const HomeContents = (): JSX.Element => {
	const { data: session } = useSession();

	if (!session) {
		return (
			<div className="px-2 text-center">
				<h1 className="font-sans font-base text-2xl">
					Start tracking your work time today. For free.
				</h1>
				<div className="">
					<img src=""></img>
				</div>
			</div>
		);
	}

	return <WorkSessions />;
};

const Home = () => {
	console.log("rendering");

	return (
		<PageContainer>
			<main className="overflow-hidden">
				<HomeContents />
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

export default Home;
