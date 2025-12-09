/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        premium: {
          royal: '#3B82F6',
          indigo: '#1E3A8A',
          aqua: '#06D6A0',
        },
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: 'var(--color-primary-500)',
          600: 'var(--color-primary-600)',
          700: '#1d4ed8',
          900: '#1e3a8a',
        },
        secondary: {
          500: 'var(--color-secondary-500)',
          600: 'var(--color-secondary-600)',
        },
        theme: {
          main: 'var(--bg-main)',
          card: 'var(--bg-card)',
          text: 'var(--text-main)',
          muted: 'var(--text-muted)',
          border: 'var(--border-color)',
          input: 'var(--bg-input)',
        }
      },
      animation: {
        'blob': 'blob 7s infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
        'fadeIn': 'fadeIn 0.2s ease-out forwards',
      },
      keyframes: {
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        glow: {
          'from': { boxShadow: '0 0 10px #06D6A0' },
          'to': { boxShadow: '0 0 20px #06D6A0, 0 0 10px #3B82F6' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      }
    }
  },
  plugins: [],
}