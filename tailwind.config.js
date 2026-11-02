/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#1DB954', // original brand accent
          600: '#1aa34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          accent: '#1ed760',
        },
        dark: {
          bg: '#0b0f14',
          card: '#131b24',
          border: '#1f2937',
          hover: '#1b2430',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      }
    },
  },
  plugins: [],
}
