/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0f172a',
        secondary: '#64748b',
        accent: '#f97316',
        warning: '#f59e0b',
        'ulc-blue': '#1e3a70', // ULC 蓝色
      },
      animation: {
        'pulse-fast': 'pulse 1s linear infinite',
      },
    },
  },
  plugins: [],
} 