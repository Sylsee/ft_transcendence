const withMT = require("@material-tailwind/react/utils/withMT");

/** @type {import('tailwindcss').Config} */
module.exports = withMT({
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			colors: {
				// website background color
				backgroundColor: "#15202B",
				// hover and active color
				astronaut: {
					50: "#f4f7fb",
					100: "#e8eef6",
					200: "#cbdcec",
					300: "#9ebfdb",
					400: "#6a9dc6",
					500: "#4781b0",
					600: "#356794",
					700: "#2b5176",
					800: "#284764",
					900: "#253c55",
					950: "#192838",
					DEFAULT: "#2b5176",
				},
				// buttons colors
				"silver-tree": {
					50: "#f3faf6",
					100: "#d8efe5",
					200: "#b0dfcc",
					300: "#81c7ad",
					400: "#5dae92",
					500: "#3d8f74",
					600: "#2e735e",
					700: "#285d4c",
					800: "#244b3f",
					900: "#223f37",
					950: "#0f241f",
					DEFAULT: "#3d8f74",
				},
				tamarillo: {
					50: "#fff1f1",
					100: "#ffe5e4",
					200: "#fecdce",
					300: "#fda4a6",
					400: "#fb7178",
					500: "#f3404d",
					600: "#e01e35",
					700: "#bd132c",
					800: "#a3132d",
					900: "#88132c",
					950: "#4c0512",
					DEFAULT: "#a3132d",
				},
				"river-bed": {
					50: "#f4f6f7",
					100: "#e3e7ea",
					200: "#cbd2d6",
					300: "#a6b3ba",
					400: "#7a8c96",
					500: "#5f717b",
					600: "#525f68",
					700: "#48525a",
					800: "#3f454b",
					900: "#373c42",
					950: "#22262a",
					DEFAULT: "#48525a",
				},
				"chatgpt-grey": {
					50: "#444654",
					100: "#ECECF1",
					200: "#40414F",
					300: "#2A2B32",
					400: "#343541",
					500: "#202123",
					600: "#757575",
					700: "#616161",
					800: "#424242",
					900: "#212121",
					950: "#111111",
					DEFAULT: "#202123",
				},
			},
			backgroundImage: {
				"gradient-custom":
					"linear-gradient(to right top, #051937, #36274c, #623458, #8c445d, #ae5b5b)",
			},
			boxShadow: {
				right: "5px 4px 6px 1px rgba(0, 0, 0, 0.1)",
			},
		},
	},
	variants: {},
	plugins: [],
	safelist: [
		{
			pattern:
				/(bg|text|border)-(silver-tree|astronaut|tamarillo|river-red|chatgpt-grey)/,
		},
	],
});
