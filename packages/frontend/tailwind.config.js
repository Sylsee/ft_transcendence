const withMT = require("@material-tailwind/react/utils/withMT");

/** @type {import('tailwindcss').Config} */
module.exports = withMT({
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			aspectRatio: {
				"14/10": "14 / 10",
			},
			colors: {
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

				// basic color
				tuna: {
					50: "#f6f6f9",
					100: "#ededf1",
					200: "#d7d8e0",
					300: "#b4b7c5",
					400: "#8b8fa5",
					500: "#6c708b",
					600: "#575a72",
					700: "#47495d",
					800: "#3d3f4f",
					900: "#343541",
					950: "#24242d",
					DEFAULT: "#343541",
				},
				// light grey
				mako: {
					50: "#f4f5f7",
					100: "#e3e4ea",
					200: "#cbced6",
					300: "#a7abb9",
					400: "#7b8195",
					500: "#60657a",
					600: "#525568",
					700: "#444654",
					800: "#3f404b",
					900: "#383941",
					950: "#22232a",
					DEFAULT: "#444654",
				},

				// dark color
				shark: {
					50: "#f6f6f7",
					100: "#e2e4e5",
					200: "#c5c8ca",
					300: "#a0a3a8",
					400: "#7c8085",
					500: "#62656a",
					600: "#4d5054",
					700: "#404245",
					800: "#35383a",
					900: "#2f3032",
					950: "#202123",
					DEFAULT: "#202123",
				},

				"light-shark": "#2A2B32",

				// light, bg chat input
				"gun-powder": {
					50: "#f7f7f8",
					100: "#ededf1",
					200: "#d8d9df",
					300: "#b5b6c4",
					400: "#8d8fa3",
					500: "#6f7188",
					600: "#595b70",
					700: "#494a5b",
					800: "#40414f",
					900: "#373843",
					950: "#25252c",
					DEFAULT: "#40414f",
				},

				// really light
				"athens-gray": {
					50: "#f6f6f8",
					100: "#ececf1",
					200: "#d9d9e4",
					300: "#c0c1d0",
					400: "#a1a2b9",
					500: "#8b8aa7",
					600: "#7c7898",
					700: "#716c89",
					800: "#605b72",
					900: "#4e4b5d",
					950: "#33313a",
					DEFAULT: "#ececf1",
				},
			},
			backgroundImage: {
				"background-gradient":
					"linear-gradient(180deg, #1B1B1B 0%, #1C1C1C 6.25%, #232628 50%, #1B1B1B 100%)",
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
				/(bg|text|border)-(silver-tree|astronaut|tamarillo|river-red|tuna|mako|shark|light-shark|gun-powder|athens-gray|)/,
		},
	],
});
