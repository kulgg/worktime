import Link from "next/link";
import { useRouter } from "next/router";

const SignIn = ({ text }: { text: string }): JSX.Element => {
	return (
		<div className="text-center text-grey-200 text-xl mt-4">
			<Link
				href="/api/auth/signin"
				className="text-blue-400 active:text-blue-300"
			>
				Sign In
			</Link>{" "}
			{text}
		</div>
	);
};

export default SignIn;
