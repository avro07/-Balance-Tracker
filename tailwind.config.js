/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'hind-siliguri': ['"Hind Siliguri"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}