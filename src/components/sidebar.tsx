import Link from "next/link";

import {
	BriefcaseIcon,
	CalendarIcon,
	CogIcon,
	HomeIcon,
} from "@heroicons/react/solid";

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
			className="flex flex-row justify-left items-center gap-2 w-36 pl-3 mx-1 rounded-full h-10 group hover:bg-grey-900 transition duration-200"
			href={page}
		>
			<div className="w-4 h-4 text-grey-200 group-hover:text-white">{icon}</div>
			<span className="text-xs lg:text-[13px]">{text}</span>
		</Link>
	);
};

const Sidebar = (): JSX.Element => {
	return (
		<div className="bg-grey-700 w-40 hidden md:block pt-16 pl-1">
			<nav className="flex flex-col items-center text-white gap-4">
				<SidebarEntry text="Home" icon={<HomeIcon />} page="/" />
				<SidebarEntry
					text="Projects"
					icon={<BriefcaseIcon />}
					page="/projects"
				/>
				<SidebarEntry
					text="Calendar"
					icon={<CalendarIcon />}
					page="/calendar"
				/>
				<SidebarEntry text="Settings" icon={<CogIcon />} page="/" />
			</nav>
		</div>
	);
};

export default Sidebar;
