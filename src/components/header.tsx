import { signOut, useSession } from "next-auth/react";
import { Menu } from "@headlessui/react";
import Link from "next/link";
import { BriefcaseIcon, HomeIcon } from "@heroicons/react/solid";

const Header: React.FC<{}> = () => {
	const { data: session } = useSession();

	return (
		<header className="sticky top-0 z-50 bg-grey-600 px-3 drop-shadow-lg h-14 flex flex-col justify-center">
			<div className="flex justify-between items-center container self-center">
				<Link href="/">
					<h1 className="text-2xl font-semibold">WTT</h1>
				</Link>
				<div className="text-sm leading-normal">
					{session ? (
						<div className="flex flex-row gap-4 justify-center items-center">
							<Link href="/profile">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="currentColor"
									className="w-5 h-5"
								>
									<path
										fillRule="evenodd"
										d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
										clipRule="evenodd"
									/>
								</svg>
							</Link>
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
