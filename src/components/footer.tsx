import {
	HomeIcon,
	BriefcaseIcon,
	ArrowRightIcon,
} from "@heroicons/react/solid";
import Link from "next/link";

const Footer: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
	return (
		<footer className="sticky z-50 bottom-0 w-full text-white bg-grey-600">
			{children}
			<nav className="bg-grey-900 w-full flex items-center gap-8 justify-left h-14 px-8">
				<Link className="flex flex-col items-center gap-[2px] px-1" href="/">
					<HomeIcon className="w-4 h-4 text-grey-200" />
					<span className="text-xs">Home</span>
				</Link>
				<Link
					className="flex flex-col items-center gap-[2px] px-1"
					href="/projects"
				>
					<BriefcaseIcon className="w-4 h-4 text-grey-200" />
					<span className="text-xs">Projects</span>
				</Link>
			</nav>
		</footer>
	);
};

export default Footer;
