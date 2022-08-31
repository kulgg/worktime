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

	const { data: workSessions } = trpc.useQuery([
		"worksessions.get-todays-sessions",
	]);

	const totalMilliseconds =
		workSessions && workSessions.length > 0
			? workSessions
					.map((x) => {
						return x.finishTime
							? getMillisecondsDifference(x.finishTime, x.startTime)
							: getMillisecondsDifference(currentDate, x.startTime);
					})
					.reduce((acc, x) => acc + x)
			: 0;

	return (
		<PageContainer>
			<main className="overflow-hidden mt-4">
				{session ? (
					<WorkSessions
						currentDate={currentDate}
						setCurrentDate={setCurrentDate}
					/>
				) : (
					<div>Free work time tracker</div>
				)}
			</main>
			<div className="py-4 px-6 text-center flex flex-row justify-between items-center bg-grey-500">
				<span className="text-grey-200 text-xs">Todays worktime:</span>
				<div
					className="flex flex-row justify-center gap-1 items-center"
					onClick={() => copyWorkTimeToClipboard(totalMilliseconds)}
				>
					<span className="text-grey-100 text-md">
						{getClockFromMilliseconds(totalMilliseconds)}
					</span>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.2}
						stroke="currentColor"
						className="w-4 h-4"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
						/>
					</svg>
				</div>
			</div>
		</PageContainer>
	);
};

export default Home;
