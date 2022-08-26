import { useSession } from "next-auth/react";
import { MenuAlt2Icon, LoginIcon } from "@heroicons/react/solid";
import { Menu } from "@headlessui/react";
import Link from "next/link";

const MobileNavBar: React.FC<{}> = () => {
	const { data: session } = useSession();

	return (
		<nav className="py-2 px-3 shadow-lg">
			<div className="flex justify-between items-center">
				<h1 className="text-xl font-semibold">WTT</h1>
				<div className="text-sm md:text-[5rem] leading-normal">
					{session ? (
						<div>
							<span>{session.user?.name}</span>
						</div>
					) : (
						<Link href="/api/auth/signin">Sign In</Link>
					)}
				</div>
			</div>
		</nav>
	);
};

export default MobileNavBar;
