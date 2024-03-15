import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";
const { nextui } = require("@nextui-org/react");

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/constants/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      ...colors,
      background: "#000000",
      primaryText: "#fcfcfc",
      secondaryText: "#999999",
      primary: "#ed02eb",
      secondaryBackground: "#161616",
    },
    fontFamily: {
      diatype: ["ABCDiatype", "Helvetica", "sans-serif"],
      salsa: ["Salsa Regular", "Helvetica", "sans-serif"],
      mali: ["Mali Regular", "Helvetica", "sans-serif"],
      giasyr: ["ABC Gaisyr", "Helvetica", "sans-serif"],
      gilroyBold: ["Gilroy-Bold", "Helvetica", "sans-serif"],
      gilroyRegular: ["Gilroy-Regular", "Helvetica", "sans-serif"],
    },
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [
    nextui({
      themes: {
        light: {
          layout: {},
          colors: {
            primary: "#ed02eb",
          },
        },
        dark: {
          layout: {
            radius: {
              small: "0.125rem", // rounded-small
              medium: "0.375rem", // rounded-medium
              large: "0.5rem", // rounded-large
            },
          },
          colors: {
            primary: "#ed02eb",
          },
        },
      },
    }),
  ],
};
export default config;
