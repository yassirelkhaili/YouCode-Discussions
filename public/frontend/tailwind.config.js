/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  important: true,
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './scripts/**/*.{js,ts}',
    '../../SimpleKit/Views/**/*.php',
],
  theme: {
    extend: {
      screens: {
        sidebar: '1200px',
      },
      colors: {
        primary: {"50":"#eff6ff","100":"#dbeafe","200":"#bfdbfe","300":"#93c5fd","400":"#60a5fa","500":"#3b82f6","600":"#2563eb","700":"#1d4ed8","800":"#1e40af","900":"#1e3a8a","950":"#172554"},
        main_header: '#1F2937',
        border_color: '#374151',
        main_background_color: '#111827',
        card_background_color: '#1F2937'
      }
    },
  },
  plugins: [],
}