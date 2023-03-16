const withMT = require("@material-tailwind/react/utils/withMT");

/** @type {import('tailwindcss').Config} */
module.exports = withMT({
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			backgroundImage: {
				"gradient-custom":
					"linear-gradient(to right top, #051937, #36274c, #623458, #8c445d, #ae5b5b)",
			},
		},
	},
	plugins: [],
});
