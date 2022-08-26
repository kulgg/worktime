import { useSession } from "next-auth/react";
import { MenuAlt2Icon, LoginIcon } from "@heroicons/react/solid";
import { Menu } from "@headlessui/react";
import Link from "next/link";

const Header: React.FC<{}> = () => {
	const { data: session } = useSession();

	return (
		<header className="sticky top-0 z-50 bg-grey-600 py-2 px-3 drop-shadow-lg">
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
		</header>
	);
};

export default Header;
