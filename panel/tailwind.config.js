/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        lightPrimary: "#057a39",
        lightSecondary: "#080a0b",
        lightTertiary: "#5d5d5b",
        darkPrimary: "#yourDarkPrimaryColor",
      },
      backgroundColor: {
        lightPrimary: "#057a39",
        lightSecondary: "#080a0b",
        lightTertiary: "#5d5d5b",
      },
      fontFamily: {
        sourceSansPro: ["Source Sans Pro", "sans-serif"],
      },
    },
  },
  plugins: [],
};
