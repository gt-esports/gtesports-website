/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        quicksand: ["Quicksand", "sans-serif"],
      },
      colors: {
        "tech-gold": "#B3A369",
        "navy-blue": "#003057",
        "bright-buzz": "#FFCC00",
        "light-purple": "#241F3F",
        "dark-purple": "#0D072B",
      },
      backgroundImage: {
        "home-1": "url('./assets/home-1.jpg')",
        streak:
          "linear-gradient(0deg, rgba(22, 34, 57, 0.52) 0%, rgba(0, 0, 0, 0.92) 100%), url('./assets/streaks.jpg')",
      },
    },
  },
  plugins: [],
};
