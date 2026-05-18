/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: '#0f172a', // deep slate blue background
        cardBg: '#1e293b', // lighter slate for cards
      }
    },
  },
  plugins: [],
}
