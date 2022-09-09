import type { GetServerSidePropsContext } from "next";
import { unstable_getServerSession } from "next-auth";
import { signIn, useSession } from "next-auth/react";
import GoogleButton from "react-google-button";
import PageContainer from "../components/page-container";
import WorkSessions from "../components/worksessions";
import { authOptions } from "./api/auth/[...nextauth]";

const HomeContents = (): JSX.Element => {
	const { data: session } = useSession();

	if (!session) {
		return (
			<div>
				<div className="mt-24 px-2 sm:px-20 text-center flex flex-col justify-start items-center gap-5">
					<h1 className="font-sans font-base text-2xl sm:text-3xl lg:text-4xl">
						Start tracking your work time today. For free.
					</h1>
					<GoogleButton onClick={() => signIn("google")} />
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
