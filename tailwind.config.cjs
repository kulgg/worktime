/** @type {import('tailwindcss').Config} */

module.exports = {
	content: ["./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				"grey-100": "#d5dcea",
				"grey-200": "#b1bad2",
				"grey-300": "#557085",
				"grey-350": "#3d5563",
				"grey-400": "#2f4552",
				"grey-500": "#213742",
				"grey-600": "#1a2c37",
				"grey-700": "#0f212d",
				"grey-800": "#071d29",
				"grey-900": "#071823",
			},
			fontFamily: {
				inter: ["Inter", "sans-serif"],
			},
		},
	},
	plugins: [],
};
