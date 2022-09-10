import { BriefcaseIcon, HomeIcon } from "@heroicons/react/solid";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import Footer from "./footer";
import Header from "./header";
import Sidebar from "./sidebar";

const PageContainer = ({
	children,
}: {
	children: React.ReactNode;
}): JSX.Element => {
	const { data: session } = useSession();

	return (
		<div className="block sm:flex flex-row absolute inset-0 bg-grey-600">
			<Sidebar />
			<div className="text-white flex flex-col h-full w-full">
				<Header />
				<div className="mt-9 mb-auto container mx-auto lg:px-0 px-4">
					{children}
				</div>
				<div className="md:hidden">
					<Footer />
				</div>
			</div>
		</div>
	);
};

export default PageContainer;
