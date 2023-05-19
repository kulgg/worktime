import { Menu } from "@headlessui/react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

import worktimeLogo from "../../public/worktime.png";
import Image from "next/image";

const Header = (): JSX.Element => {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 py-4 bg-grey-600 px-2 lg:px-6 drop-shadow-lg h-14 flex flex-col justify-center">
      <div className="flex justify-between items-center w-full self-center">
        <Link
          href="/"
          className="flex items-center gap-0 bg-grey-400 pr-3 rounded-full ring-1 ring-grey-350"
        >
          <Image
            src={worktimeLogo}
            width={44}
            height={44}
            alt={"Worktime Logo"}
          />
          <h1 className="text-lg font-semibold">WTT</h1>
        </Link>
        <div className="text-sm leading-normal">
          {session && (
            <div className="flex flex-row gap-4 justify-center items-center">
              {session.user?.image && (
                <Menu as="div">
                  <Menu.Button className="cursor-pointer">
                    <img
                      src={session.user.image}
                      className="rounded-full w-8"
                      tabIndex={0}
                    />
                  </Menu.Button>

                  <Menu.Items
                    id="dropdownInformation"
                    className={`absolute top-[50px] right-4 z-10 w-50 bg-white rounded divide-y divide-grey-100 shadow dark:bg-grey-700 dark:divide-grey-600`}
                    data-popper-reference-hidden=""
                    data-popper-escaped=""
                    data-popper-placement="bottom"
                  >
                    <div className="py-3 px-4 text-sm text-grey-900 dark:text-white">
                      <div>{session.user.name}</div>
                      <div className="font-medium truncate">
                        {session.user.email}
                      </div>
                    </div>
                    <ul
                      className="py-1 text-sm text-grey-700 dark:text-grey-200"
                      aria-labelledby="dropdownInformationButton"
                    >
                      <li>
                        <a
                          onClick={() => signOut()}
                          className="cursor-pointer block py-2 px-4 hover:bg-grey-100 dark:hover:bg-grey-600 dark:hover:text-white"
                        >
                          Sign Out
                        </a>
                      </li>
                    </ul>
                  </Menu.Items>
                </Menu>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
