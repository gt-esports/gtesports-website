/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "tech-gold": "#B3A369",
        "navy-blue": "#003057",
        "bright-buzz": "#FFCC00",
        "light-purple": "#241F3F",
        "dark-purple": "#0D072B",
      },
    },
  },
  plugins: [],
};
