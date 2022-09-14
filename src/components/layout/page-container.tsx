import { useSession } from "next-auth/react";
import React from "react";
import Sidebar from "../sidebar";
import Footer from "./footer";
import Header from "./header";

const PageContainer = ({
	children,
}: {
	children: React.ReactNode;
}): JSX.Element => {
	const { data: session } = useSession();

	return (
		<div className="block sm:flex flex-row absolute inset-0 bg-grey-600">
			<div className="bg-grey-700 w-40 hidden md:block pt-16 pl-1">
				<Sidebar />
			</div>
			<div className="text-white flex flex-col h-full w-full">
				<Header />
				<div className="bg-grey-600 mt-9 mb-auto container mx-auto lg:px-0 px-4">
					{children}
				</div>
				<div className="pt-20 bg-grey-600 md:hidden">
					<Footer />
				</div>
			</div>
		</div>
	);
};

export default PageContainer;
