import daisyui from 'daisyui'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        heading: ['"Poppins"', 'sans-serif'],
      },
      colors: {
        'primary-focus': '#4f46e5',  
      }
    }
  },
  plugins: [daisyui],
  daisyui: {
    themes: ['light', 'dark'],
  },
}
