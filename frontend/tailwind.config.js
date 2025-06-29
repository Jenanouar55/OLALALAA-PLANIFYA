/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // Enable dark mode based on 'class' on <html> or <body>
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // adjust paths according to your project structure
  ],
  theme: {
    extend: {},
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
