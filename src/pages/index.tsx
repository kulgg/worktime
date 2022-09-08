import type {
	GetServerSideProps,
	GetServerSidePropsContext,
	InferGetServerSidePropsType,
	NextPage,
} from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Header from "../components/header";
import {
	BriefcaseIcon,
	ClipboardCopyIcon,
	FireIcon,
	HomeIcon,
} from "@heroicons/react/solid";
import Footer from "../components/footer";
import {
	getClockFromMilliseconds,
	getMillisecondsDifference,
} from "../utils/timespan";
import { useState } from "react";
import { copyWorkTimeToClipboard } from "../utils/clipboard";
import PageContainer from "../components/pagecontainer";
import SignIn from "../components/signin";
import { Session, unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import dynamic from "next/dynamic";
import WorkSessions from "../components/worksessions";

const Home = ({ user }: { user: Session | null }) => {
	console.log("rendering");
	const [currentDate, setCurrentDate] = useState<Date>(new Date());

	return (
		<PageContainer>
			<main className="overflow-hidden px-3 mt-4">
				{user ? (
					<WorkSessions
						currentDate={currentDate}
						setCurrentDate={setCurrentDate}
					/>
				) : (
					<div>
						<div className="flex gap-1 items-center justify-left">
							<FireIcon className="w-5 h-5" />
							<h2 className="text-lg">Free work time tracker</h2>
						</div>
						<SignIn text={"to start"} />
					</div>
				)}
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
			user: session,
		},
	};
};

export default Home;
