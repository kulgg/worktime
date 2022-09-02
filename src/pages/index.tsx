import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Header from "../components/header";
import WorkSessions from "../components/worksessions";
import {
	BriefcaseIcon,
	ClipboardCopyIcon,
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

const Home: NextPage = () => {
	console.log("rendering");
	const { data: session } = useSession();

	const [currentDate, setCurrentDate] = useState<Date>(new Date());

	return (
		<PageContainer>
			<main className="overflow-hidden px-3 mt-4">
				{session ? (
					<WorkSessions
						currentDate={currentDate}
						setCurrentDate={setCurrentDate}
					/>
				) : (
					<div>Free work time tracker</div>
				)}
			</main>
		</PageContainer>
	);
};

export default Home;
