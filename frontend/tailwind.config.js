/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        railguard: {
          green: '#16A34A',      // Primary Green
          darkgreen: '#14532D',  // Dark Green
          navy: '#0F172A',       // Navy Dark Base
          bg: '#F0FDF4',         // Light Green-tinted Background
          yellow: '#FACC15',     // Accent Yellow
          card: '#FFFFFF',
          border: '#E2E8F0',
          muted: '#64748B',
          accent: '#10B981',
          danger: '#DC2626',
          warning: '#EA580C',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      }
    },
  },
  plugins: [],
}
