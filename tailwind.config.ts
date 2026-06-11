import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        arabic: ['Amiri', 'Scheherazade New', 'serif'],
      },
      backgroundColor: {
        'card': 'var(--bg-card)',
      },
    },
  },
  plugins: [],
};

export default config;