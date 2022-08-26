import { NextPage } from "next";
import MobileMenu from "../components/mobilemenu";

const Projects: NextPage = () => {
	return (
		<div className="flex flex-col min-h-screen text-white">
			<div className="flex-grow">Hello</div>
			<MobileMenu />
		</div>
	);
};

export default Projects;
