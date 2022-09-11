import type { GetServerSidePropsContext } from "next";
import { unstable_getServerSession } from "next-auth";
import { signIn, useSession } from "next-auth/react";
import GoogleButton from "react-google-button";
import Header from "../components/header";
import PageContainer from "../components/page-container";
import WorkSessions from "../components/worksessions";
import { authOptions } from "./api/auth/[...nextauth]";

const HomeContents = (): JSX.Element => {
	return <WorkSessions />;
};

const Home = () => {
	const { data: session } = useSession();

	if (!session) {
		return (
			<div className="bg-grey-600 h-screen text-white">
				<Header />
				<div className="pt-24 text-center flex flex-col justify-start items-center gap-5">
					<h1 className="font-sans w-52 sm:w-64 md:w-80 font-base text-2xl sm:text-3xl lg:text-4xl">
						Start tracking your work time today.
					</h1>
					<h2 className="text-grey-200">Free forever.</h2>
					<GoogleButton onClick={() => signIn("google")} />
				</div>
			</div>
		);
	}

	return (
		<PageContainer>
			<main className="overflow-hidden">
				<WorkSessions />
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
