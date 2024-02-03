/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      backgroundImage: (theme) => ({
        encryption: `url(${theme("assets.encryption")})`,
        bg1l: `url(${theme("assets.bg1l")})`,
        bg1d: `url(${theme("assets.bg1d")})`,
        bg2l: `url(${theme("assets.bg2l")})`,
        bg2d: `url(${theme("assets.bg2d")})`,
        bg3l: `url(${theme("assets.bg3l")})`,
        bg3d: `url(${theme("assets.bg3d")})`,
        bg4l: `url(${theme("assets.bg4l")})`,
        bg4d: `url(${theme("assets.bg4d")})`,
        bg5l: `url(${theme("assets.bg5l")})`,
        bg5d: `url(${theme("assets.bg5d")})`,
      }),
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
      assets: {
        encryption: "./assets/enc.jpg",
        bg1l: "./assets/bg1l.png",
        bg1d: "./assets/bg1d.png",
        bg2l: "./assets/bg2l.png",
        bg2d: "./assets/bg2d.png",
        bg3l: "./assets/bg3l.png",
        bg3d: "./assets/bg3d.png",
        bg4l: "./assets/bg4l.png",
        bg4d: "./assets/bg4d.png",
        bg5l: "./assets/bg5l.png",
        bg5d: "./assets/bg5d.png",
      },
    },
  },
  plugins: [],
};
