/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: { DEFAULT: '#18181b' },
        primary: { DEFAULT: '#00fff7' },
        accent: { DEFAULT: '#ff00ea' },
      },
    },
  },
  plugins: [],
};
