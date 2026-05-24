import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx,js,jsx}',
    './components/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0A0A0F',
        surface: '#111118',
        's1': '#181825',
        's2': '#1E1E2E',
        border: {
          DEFAULT: '#252530',
          hover: '#353548',
        },
        tx: {
          DEFAULT: '#EEEEFA',
          2: '#7A7A9A',
          3: '#4A4A6A',
        },
        kiri: {
          DEFAULT: '#8B5CF6',
          dim: '#8B5CF620',
          glow: '#8B5CF640',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.4s ease-out both',
        'fade-in': 'fade-in 0.3s ease-out both',
        shimmer: 'shimmer 1.5s infinite linear',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)',
        'card-hover': '0 4px 20px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.07)',
        'kiri': '0 0 30px rgba(139,92,246,0.2)',
      },
    },
  },
  plugins: [],
};

export default config;
