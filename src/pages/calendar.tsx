import { CalendarIcon } from "@heroicons/react/solid";
import { GetServerSidePropsContext, NextPage } from "next";
import { unstable_getServerSession } from "next-auth";
import PageContainer from "../components/page-container";
import { authOptions } from "./api/auth/[...nextauth]";

const Calendar = (): JSX.Element => {
	return (
		<PageContainer>
			<main className="overflow-hidden">
				<div className="flex items-center justify-between">
					<div className="flex gap-2 items-center">
						<CalendarIcon className="w-5 h-5" />
						<h2 className="text-lg">Calendar</h2>
					</div>
				</div>
				<div className="mt-5">Hallo</div>
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
