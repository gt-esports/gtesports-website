/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        xs: "350px",
        md: "900px",
        lg: "1200px",
      },
      fontFamily: {
        outfit: ["Outfit", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
      colors: {
        "tech-gold": "#B3A369",
        "gold-glow": "#D4AF37",
        "deep-space": "#02040F",
        "navy-dark": "#001f3f",
        "nav-bg": "rgba(2, 4, 15, 0.8)",
      },
      backgroundImage: {
        "home-hero": "linear-gradient(to bottom, rgba(2, 4, 15, 0.3), rgba(2, 4, 15, 1)), url('./assets/home-1.jpg')",
        "card-gradient": "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)",
      },
    },
  },
  plugins: [],
};
