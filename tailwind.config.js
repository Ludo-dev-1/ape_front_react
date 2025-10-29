/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html", // ✅ ajoutez cette ligne
    "./src/**/*.{js,jsx,ts,tsx}" // ✅ ajoutez cette ligne
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
    },
    plugins: [],
  }
}
