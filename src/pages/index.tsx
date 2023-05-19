import type { GetServerSidePropsContext } from "next";
import { unstable_getServerSession } from "next-auth";
import { signIn, useSession } from "next-auth/react";
import { FaGithub, FaGoogle } from "react-icons/fa";
import WorkSessions from "../components/worksessions";
import Header from "../layout/header";
import PageContainer from "../layout/page-container";
import { authOptions } from "./api/auth/[...nextauth]";

const SignInWithButton = ({
  icon,
  provider_name,
  displayed_name,
}: {
  icon: JSX.Element;
  provider_name: string;
  displayed_name: string;
}): JSX.Element => {
  return (
    <button
      type="button"
      className="flex items-center gap-2 rounded-lg bg-blue-500 hover:bg-blue-600 px-6 py-2.5 text-center text-md font-medium text-white"
      onClick={() => signIn(provider_name)}
    >
      {icon}
      Sign in with {displayed_name}
    </button>
  );
};

const Home = () => {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="bg-grey-600 h-screen text-white flex flex-col justify-between">
        <Header />
        <div className="-mt-20 text-center flex flex-col justify-start items-center gap-5">
          <h1 className="font-sans w-52 sm:w-64 md:w-80 font-base text-2xl sm:text-3xl lg:text-4xl">
            Start tracking your work time today.
          </h1>
          <h2 className="text-grey-200">Free forever</h2>
          <SignInWithButton
            icon={<FaGoogle size={18} />}
            provider_name="google"
            displayed_name="Google"
          />
          <SignInWithButton
            icon={<FaGithub size={18} />}
            provider_name="github"
            displayed_name="GitHub"
          />
        </div>
        <div className="text-md px-3 py-2 font-cabin">
          by{" "}
          <a
            className="text-blue-400 hover:text-blue-300"
            href="https://kul.gg"
          >
            kul.gg
          </a>
        </div>
      </div>
    );
  }

  return (
    <PageContainer>
      <main className="overflow-hidden">
        <WorkSessions />
      </main>
    </PageContainer>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  return {
    props: {
      session: session,
    },
  };
};

export default Home;
