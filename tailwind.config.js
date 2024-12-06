import formsPlugin from "@tailwindcss/forms"
import animatePlugin from "tailwindcss-animate"

/** @type {import('tailwindcss').Config} */
export default {
	darkMode: ["class"],
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		container: {
			center: true,
			screens: {
				"2xl": "1200px",
			},
		},
		fontFamily: {
			body: ["var(--body)"],
			heading: ["var(--heading)"],
		},
		extend: {
			borderWidth: {
				0.5: "0.5px",
			},
			colors: {
				primary: "#ff5733",
			},
			boxShadow: {
				card: "0 6.71px 26.83px 0 rgba(255, 87, 51, 0.8%)",
			},
		},
	},
	plugins: [animatePlugin, formsPlugin],
}
