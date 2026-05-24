import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx,js,jsx}',
    './components/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#13121A',
        surface: '#1A1828',
        's1': '#211E30',
        's2': '#2A2440',
        border: {
          DEFAULT: '#241F35',
          hover: '#332D4A',
        },
        tx: {
          DEFAULT: '#EEEEFA',
          2: '#7A7A9A',
          3: '#4A4A6A',
        },
        // Hero: mint teal — leads everything
        kiri: {
          DEFAULT: '#6CD9BA',
          dim: '#6CD9BA18',
          glow: '#6CD9BA35',
        },
        // Warmth: pink/magenta — companion, personal, review
        warm: {
          DEFAULT: '#F27EB4',
          deep: '#A60D61',
          dim: '#F27EB415',
        },
        // Depth: deep purple — surface tint only, never accent
        deep: '#3F289D',
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
        'card': '0 1px 3px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)',
        'card-hover': '0 4px 20px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.07)',
        'kiri': '0 0 30px rgba(108,217,186,0.2)',
        'warm': '0 0 24px rgba(242,126,180,0.2)',
      },
    },
  },
  plugins: [],
};

export default config;
