/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary-gold': '#D9A441',
        'moroccan-blue': '#2E86AB',
        'moroccan-red': '#C1272D',
        'desert-sand': '#F8F5F0',
        'dark-charcoal': '#2D2D2D',
      },
      fontFamily: {
        'amiri': ['var(--font-amiri)'],
        'inter': ['var(--font-inter)'],
      },
    },
  },
  plugins: [],
}