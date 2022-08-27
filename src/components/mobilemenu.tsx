import {
	HomeIcon,
	BriefcaseIcon,
	ArrowRightIcon,
} from "@heroicons/react/solid";
import Link from "next/link";

const MobileMenu: React.FC<{}> = () => {
	return (
		<footer className="sticky z-50 bottom-0 w-full bg-grey-900 flex flex-col justify-center h-14 px-8 text-white">
			<nav className="flex gap-8 justify-left">
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

export default MobileMenu;
