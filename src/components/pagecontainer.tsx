import { BriefcaseIcon, HomeIcon } from "@heroicons/react/solid";
import Link from "next/link";
import React from "react";
import Footer from "./footer";
import Header from "./header";

const PageContainer: React.FC<{
	children?: React.ReactNode;
}> = ({ children }) => {
	return (
		<div className="block sm:flex flex-row">
			<div className="bg-grey-700 w-32 hidden sm:block pt-16">
				<nav className="bg-grey-800 flex flex-col items-center text-white gap-6">
					<Link
						className="flex flex-row items-center justify-between gap-2"
						href="/"
					>
						<HomeIcon className="w-4 h-4 text-grey-200" />
						<span className="text-xs">Home</span>
					</Link>
					<Link
						className="flex flex-row items-center justify-between gap-2"
						href="/projects"
					>
						<BriefcaseIcon className="w-4 h-4 text-grey-200" />
						<span className="text-xs">Projects</span>
					</Link>
				</nav>
			</div>
			<div className="text-white flex flex-col h-screen w-full">
				<Header />
				<div className="mb-auto container self-center">{children}</div>
				<div className="sm:hidden">
					<Footer />
				</div>
			</div>
		</div>
	);
};

export default PageContainer;
