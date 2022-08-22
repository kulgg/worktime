import { useSession } from "next-auth/react";
import { MenuAlt2Icon, LoginIcon } from "@heroicons/react/solid";
import { Menu } from "@headlessui/react";
import Link from "next/link";

const MobileNavBar: React.FC<{}> = () => {
	const { data: session } = useSession();

	return (
		<Menu>
			<div className="flex justify-between items-center">
				<div className="mt-1">
					<Menu.Button>
						<MenuAlt2Icon className="h-7 w-7" />
					</Menu.Button>
				</div>
				<h1 className="text-lg md:text-[5rem] leading-normal font-medium text-gray-700">
					{session ? (
						<div>
							<span>{session.user?.name}</span>
						</div>
					) : (
						<Link href="/api/auth/signin">Sign In👋</Link>
					)}
				</h1>
			</div>
			<Menu.Items className="grid grid-cols-1 justify-between fixed z-50 bg-white">
				<Menu.Item>
					<Link href="/">Blah</Link>
				</Menu.Item>
				<Menu.Item>
					{({ active }) => (
						<a
							className={`${active && "bg-blue-500"}`}
							href="/account-settings"
						>
							Documentation
						</a>
					)}
				</Menu.Item>

				{session && (
					<Menu.Item>
						<Link href="/api/auth/signout">Sign Out</Link>
					</Menu.Item>
				)}
			</Menu.Items>
		</Menu>
	);
};

export default MobileNavBar;
