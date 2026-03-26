/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: "#0EA5E9", // Sky 500 - Matches the blue accent in the image
        secondary: "#64748B", // Slate 500
        background: "#F8FAFC", // Slate 50 - Light grey background
        surface: "#FFFFFF",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
