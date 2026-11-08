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
          DEFAULT: '#FAF7F2', // Rich Warm Ivory Silk
          dark: '#1A1513',
        },
        surface: {
          DEFAULT: '#FFFFFF', // Pure Crisp White
          tint: '#F4ECE4',    // Soft Linen Warm White
          dark: '#241E1C',
        },
        blush: {
          DEFAULT: '#EEDADF', // Cashmere Rose Blush
          light: '#F8EEF1',
          dark: '#D9C2C8',
        },
        rose: {
          DEFAULT: '#A85261', // Deep Antique Berry Rose (High-Reach Luxury)
          hover: '#944453',
          dark: '#7E3744',
        },
        primary: {
          DEFAULT: '#A85261',
          hover: '#944453',
          light: '#EEDADF',
          dark: '#7E3744',
        },
        secondary: {
          DEFAULT: '#EEDADF',
          hover: '#DFCAD0',
          dark: '#C8AEB5',
        },
        sage: {
          DEFAULT: '#6A8062', // Deep Antique Olive Sage
          light: '#EAF0E8',
          dark: '#55684E',
        },
        gold: {
          DEFAULT: '#C39953', // Warm Artisan Gold
          light: '#E8D4A8',
          dark: '#A37C35',
        },
        ink: {
          DEFAULT: '#2D211E', // Deep Espresso Roast
          muted: '#6E5D57',   // Warm Truffle Slate
          light: '#9E8C86',
          heading: '#201614',
        },
        border: {
          subtle: '#EBE2D9',  // Whisper Linen
          blush: '#EEDADF',
          dark: '#352B28',
        },
        whatsapp: '#25D366',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        lg: '12px',
        md: '8px',
        sm: '4px',
        none: '0px',
      },
      boxShadow: {
        craft: '0 2px 8px -1px rgba(45, 33, 30, 0.05), 0 1px 3px -1px rgba(45, 33, 30, 0.03)',
        'craft-elevated': '0 10px 25px -4px rgba(45, 33, 30, 0.08), 0 3px 8px -2px rgba(45, 33, 30, 0.04)',
        subtle: '0 1px 3px 0 rgba(45, 33, 30, 0.04)',
      },
    },
  },
  plugins: [],
};

export default config;
