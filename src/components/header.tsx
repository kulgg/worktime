import { signOut, useSession } from "next-auth/react";
import { Menu } from "@headlessui/react";
import Link from "next/link";
import Image from "next/image";
import { BriefcaseIcon, HomeIcon } from "@heroicons/react/solid";

const Header = (): JSX.Element => {
	const { data: session } = useSession();

	return (
		<header className="sticky top-0 z-50 bg-grey-600 px-2 lg:px-6 drop-shadow-lg h-14 flex flex-col justify-center">
			<div className="flex justify-between items-center w-full self-center">
				<Link href="/">
					<h1 className="text-2xl font-semibold">WTT</h1>
				</Link>
				<div className="text-sm leading-normal flex items-center gap-4">
					<label className="swap swap-flip text-2xl">
						<input type="checkbox" />

						<div className="swap-on">😈</div>
						<div className="swap-off">😇</div>
					</label>
					{session && (
						<div className="flex flex-row gap-4 justify-center items-center">
							{session.user?.image && (
								<div className="dropdown dropdown-end cursor-pointer">
									<img
										src={session.user.image}
										className="rounded-full w-8"
										tabIndex={0}
									/>
									<ul
										tabIndex={0}
										className="dropdown-content bg-grey-800 menu p-2 shadow rounded-md w-32"
									>
										<li>
											<a onClick={() => signOut()}>Sign Out</a>
										</li>
									</ul>
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		</header>
	);
};
/*
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
*/

export default Header;
