/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: '#2563eb',    // Blue
        secondary: '#9333ea',  // Purple
        accent: '#f97316',     // Orange
        grayLight: '#f8fafc',
        grayMid: '#e2e8f0',
        grayDark: '#1e293b',
      },
      animation: {
        pulseSlow: 'pulseSlow 12s ease-in-out infinite',
        fadeIn: 'fadeIn 0.6s ease-in-out',
      },
      keyframes: {
        pulseSlow: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.15' },
          '50%': { transform: 'scale(1.1)', opacity: '0.25' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      boxShadow: {
        'neon-glow': '0 0 15px 2px rgba(59, 130, 246, 0.5)',
      },
      backdropBlur: {
        xs: '5px',
        sm: '10px',
        md: '15px',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [],
};
