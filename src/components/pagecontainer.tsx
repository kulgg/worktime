import { BriefcaseIcon, HomeIcon } from "@heroicons/react/solid";
import Link from "next/link";
import React from "react";
import Footer from "./footer";
import Header from "./header";
import Sidebar from "./sidebar";

const PageContainer: React.FC<{
	children?: React.ReactNode;
}> = ({ children }) => {
	return (
		<div className="block sm:flex flex-row">
			<Sidebar />
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
