import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

const Header = (): JSX.Element => {
	const { data: session } = useSession();

	return (
		<header className="sticky top-0 z-50 py-4 bg-grey-600 px-2 lg:px-6 drop-shadow-lg h-14 flex flex-col justify-center">
			<div className="flex justify-between items-center w-full self-center">
				<Link href="/">
					<h1 className="text-2xl font-semibold">WTT</h1>
				</Link>
				<div className="text-sm leading-normal">
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
										className="dropdown-content bg-grey-800 menu shadow mt-2 rounded-md w-32"
									>
										<li className="hover:bg-grey-700 focus:bg-grey-900">
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

export default Header;
