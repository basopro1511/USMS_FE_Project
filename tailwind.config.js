/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: "#000000",
        success: "#2F903F",

        //green
        primaryGreen:"#046808",
        secondaryGreen:"#2f903f",
        tritenaryGreen: "#55b359",
        quaternartyGreen:"#669fa0",

        //blue
        primaryBlue:"#3c6470",
        secondaryBlue:"#64a8bc",
        quaternartyBlue:"#78cae2",
        whiteBlue:"#e6f7ff",
        boldBlue:"#1706ff",
        btnBlue:"#2196f3",

        //gray
        primaryGray: "#e0e5e9",
        secondaryGray:"#ebebeb",

        //other color
      },
      backgroundImage: {
        'bgHome1': "url('/src/assets/Imgs/bgHome1.jpg')",
        'bgHome2': "url('/src/assets/Imgs/bgHome2.jpg')",
        'bgHome3': "url('/src/assets/Imgs/bgHome3.jpg')",
      },         
    },
  },
  plugins: [],
};
