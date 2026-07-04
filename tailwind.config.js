/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1e40af',
        primaryLight: '#3b82f6',
        primaryDark: '#1e3a8a',
        accent: '#f97316',
        accentLight: '#fb923c',
        accentDark: '#ea580c',
      },
    },
  },
  plugins: [],
}
