import { useSession } from "next-auth/react";
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
		<div className="block sm:flex flex-row bg-grey-600">
			<Sidebar />
			<div className="text-white flex flex-col h-screen w-full">
				<Header />
				<div className="bg-grey-600 mt-9 mb-auto container mx-auto lg:px-0 px-4">
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
