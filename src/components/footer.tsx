import {
	BriefcaseIcon,
	CalendarIcon,
	CogIcon,
	HomeIcon,
} from "@heroicons/react/solid";
import Link from "next/link";

const Footer: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
	return (
		<footer className="sticky z-50 bottom-0 w-full text-white bg-grey-600">
			{children}
			<nav className="bg-grey-800 w-full flex items-center justify-around h-14">
				<Link className="flex flex-col items-center gap-[2px]" href="/">
					<HomeIcon className="w-6 h-6 text-grey-200" />
				</Link>
				<Link className="flex flex-col items-center gap-[2px]" href="/projects">
					<BriefcaseIcon className="w-6 h-6 text-grey-200" />
				</Link>
				<Link className="flex flex-col items-center gap-[2px]" href="/calendar">
					<CalendarIcon className="w-6 h-6 text-grey-200" />
				</Link>
				<Link className="flex flex-col items-center gap-[2px]" href="/">
					<CogIcon className="w-6 h-6 text-grey-200" />
				</Link>
			</nav>
		</footer>
	);
};

export default Footer;
