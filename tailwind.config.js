/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./hooks/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        instagram: {
          primary: '#0095f6',
          secondary: '#ff3040',
          background: '#000000',
          surface: '#121212',
          card: '#1a1a1a',
          border: '#262626',
          text: '#ffffff',
          'text-secondary': '#a8a8a8',
          success: '#00d95f',
        },
      },
      fontFamily: {
        sans: ['System'],
      },
    },
  },
  plugins: [],
}
