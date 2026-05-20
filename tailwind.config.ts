import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'forest-night': '#0f1712',
        'emerald-pulse': '#34d399',
        'sylvan-glow': '#224f34',
        'coastal-haze': '#76b2cb',
        'amber-warmth': '#d2ae65',
        'forest-floor': '#5db184',
        'quiet-blush': '#cd8492',
        'warm-closure': '#fbbf24',
        'still-white': '#f5f5f2',
      },
    },
  },
  plugins: [],
};

export default config;
