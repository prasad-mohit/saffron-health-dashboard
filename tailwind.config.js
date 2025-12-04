/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        "brand-purple": "#5D4281",
        "brand-purple-dark": "#7A3476",
        "brand-rose": "#BB4272",
        "brand-gray": "#382845",

        "sun-orange": "#F29934",
        "sun-red": "#F06161",
        "sun-gold": "#E7B339",
        "sun-gray": "#42234E",

        rose: "#BB4272",
        "rose-red": "#F06161",
        "rose-gold": "#E5B07C",
        "rose-gray": "#382845",

        "light-purple": "#5D4281",
        "light-blue": "#7A3476",
        "light-orange": "#F29934",
        "light-gray": "#C7C2C4",
      },
    },
  },

  plugins: [],
};
