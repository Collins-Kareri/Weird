/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: "tw-",
  content: [
    "./src/client/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        Quicksand: ["Quicksand", "sans-serif"],
        Arvo: ["Arvo", "serif"]
      }
    },
  },
  plugins: [],
}
