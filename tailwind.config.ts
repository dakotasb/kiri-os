import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx,js,jsx}',
    './components/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        // All values use CSS variables so swapping [data-theme="light"] on <html>
        // instantly re-themes every Tailwind class, including opacity modifiers
        // like bg-kiri/10, text-tx/50, border-border/40, etc.
        bg:      'rgb(var(--t-bg) / <alpha-value>)',
        surface: 'rgb(var(--t-surface) / <alpha-value>)',
        's1':    'rgb(var(--t-s1) / <alpha-value>)',
        's2':    'rgb(var(--t-s2) / <alpha-value>)',
        border: {
          DEFAULT: 'rgb(var(--t-border) / <alpha-value>)',
          hover:   'rgb(var(--t-border-hover) / <alpha-value>)',
        },
        tx: {
          DEFAULT: 'rgb(var(--t-tx) / <alpha-value>)',
          2:       'rgb(var(--t-tx2) / <alpha-value>)',
          3:       'rgb(var(--t-tx3) / <alpha-value>)',
        },
        // Mint teal — hero accent
        kiri: {
          DEFAULT: 'rgb(var(--t-kiri) / <alpha-value>)',
          dim:     'rgb(var(--t-kiri) / 0.094)',
          glow:    'rgb(var(--t-kiri) / 0.208)',
        },
        // Pink/magenta warmth
        warm: {
          DEFAULT: 'rgb(var(--t-warm) / <alpha-value>)',
          deep:    'rgb(var(--t-warm-deep) / <alpha-value>)',
          dim:     'rgb(var(--t-warm) / 0.082)',
        },
        // Deep purple — surface tint, never accent
        deep: 'rgb(var(--t-deep) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.4s ease-out both',
        'fade-in': 'fade-in 0.3s ease-out both',
        shimmer:   'shimmer 1.5s infinite linear',
      },
      boxShadow: {
        // CSS-var-backed so they adapt to theme automatically
        'card':       'var(--shadow-card)',
        'card-hover': 'var(--shadow-card-hover)',
        'kiri':       '0 0 30px rgba(108,217,186,0.2)',
        'warm':       '0 0 24px rgba(242,126,180,0.2)',
      },
    },
  },
  plugins: [],
};

export default config;
