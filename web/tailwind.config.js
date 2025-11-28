/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'geo-dark': '#2D4A5F',      // Dark slate-teal from logo
        'geo-teal': '#5FA8A8',      // Cyan-teal from logo
        'geo-cyan': '#4DBCC2',      // Light cyan from logo
        'geo-cream': '#F5E6D3',     // Cream/beige from logo
        'geo-green': '#A4B886',     // Sage green from logo
        'geo-orange': '#E07856',    // Warm orange from logo
      },
    },
  },
  plugins: [],
}
