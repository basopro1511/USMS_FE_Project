/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        WhiteGrey: "#E0E5E9",
        Grey: "#EBEBEB",
        Dark: "#000000",
        Success: "#2F903F",
      },
    },
  },
  plugins: [],
};
