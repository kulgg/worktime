import Link from "next/link";

import { HomeIcon, BriefcaseIcon } from "@heroicons/react/solid";

const SidebarEntry = ({
	text,
	icon,
	page,
}: {
	text: string;
	icon: JSX.Element;
	page: string;
}): JSX.Element => {
	return (
		<Link
			className="flex flex-row justify-left items-center gap-2 w-32 pl-3 mx-1 rounded-xl h-10 group hover:bg-grey-900"
			href={page}
		>
			<div className="w-4 h-4 text-grey-200 group-hover:text-white">{icon}</div>
			<span className="text-xs pt-[2px]">{text}</span>
		</Link>
	);
};

const Sidebar = (): JSX.Element => {
	return (
		<div className="bg-grey-700 w-40 hidden sm:block pt-16 pl-1">
			<nav className="flex flex-col items-center text-white">
				<SidebarEntry text="Home" icon={<HomeIcon />} page="/" />
				<SidebarEntry
					text="Projects"
					icon={<BriefcaseIcon />}
					page="/projects"
				/>
			</nav>
		</div>
	);
};

export default Sidebar;
