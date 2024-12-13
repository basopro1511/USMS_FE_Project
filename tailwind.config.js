/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        whiteGrey: "#E0E5E9",
        grey: "#EBEBEB",
        dark: "#000000",
        success: "#2F903F",
        quaternarty:"#78cae2",
        whitegray:"#e0e5e9",
        primary: "#3c6470"
      },
    },
  },
  plugins: [],
};
