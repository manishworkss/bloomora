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
          DEFAULT: '#FFF9F2', // Warm Cream
          dark: '#1D1A18',
        },
        surface: {
          DEFAULT: '#FFFFFF', // Pure White
          tint: '#FAF4ED',    // Cream White
          dark: '#262220',
        },
        blush: {
          DEFAULT: '#F4DDE3', // Pastel Blush Pink
          light: '#FAEEF1',
          dark: '#E2BDC6',
        },
        rose: {
          DEFAULT: '#C88F9D', // Dusty Rose
          hover: '#B57887',
          dark: '#9B5F6E',
        },
        primary: {
          DEFAULT: '#C88F9D', // Dusty Rose Primary
          hover: '#B57887',
          light: '#F4DDE3',
          dark: '#9B5F6E',
        },
        secondary: {
          DEFAULT: '#F4DDE3', // Pastel Blush Pink
          hover: '#E9C7D0',
          dark: '#D8A7B3',
        },
        sage: {
          DEFAULT: '#A9B99F', // Soft Sage Green
          light: '#EFF4EC',
          dark: '#85967B',
        },
        ink: {
          DEFAULT: '#65504B', // Deep Warm Brown
          muted: '#8E7A75',   // Soft Warm Cocoa
          light: '#B7A9A5',
          heading: '#4C3B37',
        },
        border: {
          subtle: '#EFE4DC',  // Subtle Warm Border
          blush: '#F4DDE3',
          dark: '#3A3330',
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
        craft: '0 2px 8px -1px rgba(101, 80, 75, 0.05), 0 1px 3px -1px rgba(101, 80, 75, 0.03)',
        'craft-elevated': '0 8px 24px -4px rgba(101, 80, 75, 0.08), 0 2px 6px -1px rgba(101, 80, 75, 0.04)',
        subtle: '0 1px 3px 0 rgba(101, 80, 75, 0.04)',
      },
    },
  },
  plugins: [],
};

export default config;
