import { signOut, useSession } from "next-auth/react";
import { MenuAlt2Icon, LoginIcon } from "@heroicons/react/solid";
import { Menu } from "@headlessui/react";
import Link from "next/link";

const Header: React.FC<{}> = () => {
	const { data: session } = useSession();

	return (
		<header className="sticky top-0 z-50 bg-grey-600 px-3 drop-shadow-lg h-14 flex flex-col justify-center">
			<div className="flex justify-between items-center">
				<Link href="/">
					<h1 className="text-2xl font-semibold">WTT</h1>
				</Link>
				<div className="text-sm md:text-[5rem] leading-normal">
					{session ? (
						<div className="flex flex-col items-center">
							<span>{session.user?.name}</span>
							<button
								onClick={() => signOut()}
								className="text-[10px] text-grey-200"
							>
								Sign Out
							</button>
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
