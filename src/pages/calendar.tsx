import { GetServerSidePropsContext, NextPage } from "next";
import { unstable_getServerSession } from "next-auth";
import PageContainer from "../components/page-container";
import { authOptions } from "./api/auth/[...nextauth]";

const Calendar = (): JSX.Element => {
	return (
		<PageContainer>
			<main className="overflow-hidden"></main>
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

	if (!session) {
		return {
			redirect: {
				destination: "/",
				permanent: false,
			},
		};
	}

	return {
		props: {
			session: session,
		},
	};
};

export default Calendar;
