import { HomeIcon, BriefcaseIcon } from "@heroicons/react/solid";
import Link from "next/link";

const MobileMenu: React.FC<{}> = () => {
	return (
		<footer className="sticky z-50 bottom-0 w-full bg-grey-900 flex flex-col justify-center py-1 px-10 text-white">
			<nav className="flex gap-8 justify-left">
				<Link className="flex flex-col items-center gap-[2px] px-1" href="/">
					<HomeIcon className="w-5 h-5" />
					<span className="text-xs">Home</span>
				</Link>
				<Link
					className="flex flex-col items-center gap-[2px] px-1"
					href="/projects"
				>
					<BriefcaseIcon className="w-5 h-5" />
					<span className="text-xs">Projects</span>
				</Link>
			</nav>
		</footer>
	);
};

export default MobileMenu;
