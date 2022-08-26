import { Html, Head, Main, NextScript } from "next/document";
import MobileMenu from "../components/mobilemenu";

export default function Document() {
	return (
		<Html>
			<Head />
			<body className="bg-grey-600">
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
