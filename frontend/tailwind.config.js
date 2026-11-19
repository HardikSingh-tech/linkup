/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#0A66C2",
          hover: "#004182",
          light: "#EBF4FD",
          bg: "#F3F2EF",
          card: "#FFFFFF",
          border: "#E0DFDC",
          text: "#191919",
          muted: "#666666",
        }
      },
      minWidth: {
        'desktop': '1024px',
      }
    },
  },
  plugins: [],
}
