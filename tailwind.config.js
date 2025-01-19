/** @type {import('tailwindcss').Config} */

const withMT = require("@material-tailwind/react/utils/withMT");
 
module.exports = withMT({
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          // Background colors
          primary: '#1a1a1a',     // Main background
          secondary: '#2d2d2d',   // Card/container background
          tertiary: '#404040',    // Hover states
          
          // Text colors
          text: {
            primary: '#f3f4f6',   // Primary text
            secondary: '#d1d5db', // Secondary text
            muted: '#9ca3af',     // Muted text
          },
          
          // Border colors
          border: {
            DEFAULT: '#404040',   // Default borders
            light: '#525252',     // Lighter borders
          },
          
          // Accent colors
          accent: {
            primary: '#60a5fa',   // Primary accent
            hover: '#3b82f6',     // Accent hover state
          },
          button: {
            primary: '#666666',   // Primary button
            hover: '#898989',     // Button hover state
          }
        }
      },
      animation: {
        'fade-in-down': 'fadeInDown 0.5s ease-out',
      },
      keyframes: {
        fadeInDown: {
          '0%': { opacity: 0, transform: 'translateY(-10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
});