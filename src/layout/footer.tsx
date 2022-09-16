import {
	BookOpenIcon,
	BriefcaseIcon,
	CogIcon,
	HomeIcon,
} from "@heroicons/react/solid";
import Link from "next/link";

const FooterNavEntry = ({
	icon,
	href,
}: {
	icon: JSX.Element;
	href: string;
}): JSX.Element => {
	return (
		<Link className="flex flex-col items-center gap-[2px]" href={href}>
			<div className="w-6 h-6 text-grey-200">{icon}</div>
		</Link>
	);
};

const Footer: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
	return (
		<footer className="fixed bottom-0 z-50 w-full text-white bg-grey-600">
			{children}
			<nav className="bg-grey-800 w-full flex items-center justify-around h-14">
				<FooterNavEntry icon={<HomeIcon />} href="/" />
				<FooterNavEntry icon={<BriefcaseIcon />} href="/projects" />
				<FooterNavEntry icon={<BookOpenIcon />} href="/total" />
				<FooterNavEntry icon={<CogIcon />} href="/" />
			</nav>
		</footer>
	);
};

export default Footer;
