import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: '#FDFBF7',
          dark: '#1A1715',
        },
        surface: {
          DEFAULT: '#F7F3EE',
          dark: '#24201D',
        },
        primary: {
          DEFAULT: '#C06C54', // Artisan Terracotta
          hover: '#A85B45',
          light: '#E5A493',
          dark: '#D88973',
        },
        secondary: {
          DEFAULT: '#D4A396', // Rose Dust
          hover: '#C28E80',
          dark: '#A07468',
        },
        sage: {
          DEFAULT: '#5B7A5F', // Soft Sage Green
          light: '#EAF0EB',
          dark: '#799E7E',
        },
        ink: {
          DEFAULT: '#2C2420', // Deep Cocoa Ink
          muted: '#70645D',   // Warm Slate
          light: '#9E928A',
        },
        border: {
          subtle: '#E8DFD5',
          dark: '#38322D',
        },
        whatsapp: '#25D366',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        lg: '12px',
        md: '8px',
        sm: '6px',
      },
      boxShadow: {
        craft: '0 2px 10px -2px rgba(44, 36, 32, 0.06), 0 1px 4px -1px rgba(44, 36, 32, 0.04)',
        'craft-elevated': '0 12px 28px -4px rgba(44, 36, 32, 0.12), 0 4px 10px -2px rgba(44, 36, 32, 0.06)',
      },
    },
  },
  plugins: [],
};

export default config;
