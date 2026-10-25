/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          950: '#04130B',
          900: '#072013',
          850: '#0A2A1A',
          800: '#0E3621',
          700: '#144B2E',
          600: '#1D653E',
        },
        lime: {
          400: '#A3E635',
          500: '#84CC16',
          brand: '#10B981',
          neon: '#22C55E',
        },
        sports: {
          gold: '#F59E0B',
          navy: '#0F172A',
          card: '#0F2C1D',
          border: '#1E4931',
          muted: '#94A3B8'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Plus Jakarta Sans', 'sans-serif']
      }
    },
  },
  plugins: [],
}
