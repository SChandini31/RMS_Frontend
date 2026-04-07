/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        apolloBlue: "#0C4A8A",
        apolloBlueDark: "#093B6E",
        apolloLight: "#EAF4FF",
        apolloBorder: "#D0E3FF",
        apolloAccent: "#4FA3F7",
      },
    },
  },
  plugins: [],
}