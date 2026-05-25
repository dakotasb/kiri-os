/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║               KIRI AGENT OS — Tailwind CSS Configuration v1.0            ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 *
 * Extends Tailwind with Kiri design tokens and full dark/light mode support.
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      /* ── Color Palette ───────────────────────────────────────────────── */
      colors: {
        /* Brand primitives (rarely used directly in UI) */
        kir: {
          orchid:   '#B775BF',
          mint:     '#6CD9BA',
          violet:   '#3F289D',
          electric: '#1E18D9',
          ink:      '#13121A',
          emerald:  '#07D98C',
          indigo:   '#4227F2',
          blush:    '#F27EB4',
          berry:    '#A60D61',
          maroon:   '#400224',
        },

        /* Semantic background hierarchy */
        background: {
          base:    'var(--kir-bg-base)',
          page:    'var(--kir-bg-page)',
          surface: 'var(--kir-bg-surface)',
          popup:   'var(--kir-bg-popup)',
          hover:   'var(--kir-bg-hover)',
          active:  'var(--kir-bg-active)',
          disabled:'var(--kir-bg-disabled)',
        },

        /* Text hierarchy */
        foreground: {
          primary:   'var(--kir-text-primary)',
          secondary: 'var(--kir-text-secondary)',
          tertiary:  'var(--kir-text-tertiary)',
          disabled:  'var(--kir-text-disabled)',
          inverse:   'var(--kir-text-inverse)',
        },

        /* Accent / brand colors */
        accent: {
          primary:     'var(--kir-accent-primary)',
          'primary-hover':  'var(--kir-accent-primary-hover)',
          'primary-active': 'var(--kir-accent-primary-active)',
          secondary:    'var(--kir-accent-secondary)',
          'secondary-hover': 'var(--kir-accent-secondary-hover)',
          emerald:      'var(--kir-accent-emerald)',
          'emerald-hover':  'var(--kir-accent-emerald-hover)',
          indigo:       'var(--kir-accent-indigo)',
          'indigo-hover':   'var(--kir-accent-indigo-hover)',
          blush:        'var(--kir-accent-blush)',
        },

        /* Border colors */
        border: {
          base:  'var(--kir-border-base)',
          hover: 'var(--kir-border-hover)',
          focus: 'var(--kir-border-focus)',
          error: 'var(--kir-border-error)',
        },

        /* Feedback / semantic colors */
        info: {
          DEFAULT: 'var(--kir-info)',
          subtle:  'var(--kir-info-subtle)',
          bg:      'var(--kir-info-subtle)',
          border:  'var(--kir-info)',
        },
        success: {
          DEFAULT: 'var(--kir-success)',
          subtle:  'var(--kir-success-subtle)',
          bg:      'var(--kir-success-subtle)',
          border:  'var(--kir-success)',
        },
        warning: {
          DEFAULT: 'var(--kir-warning)',
          subtle:  'var(--kir-warning-subtle)',
          bg:      'var(--kir-warning-subtle)',
          border:  'var(--kir-warning)',
        },
        danger: {
          DEFAULT: 'var(--kir-danger)',
          subtle:  'var(--kir-danger-subtle)',
          bg:      'var(--kir-danger-subtle)',
          border:  'var(--kir-danger)',
        },

        /* Status indicators */
        status: {
          online:  'var(--kir-status-online)',
          away:    'var(--kir-status-away)',
          busy:    'var(--kir-status-busy)',
          offline: 'var(--kir-status-offline)',
        },
      },

      /* ── Opacity States ──────────────────────────────────────────────── */
      opacity: {
        'state-hover':   '0.05',
        'state-active':  '0.10',
        'state-selected': '0.10',
        'state-disabled': '0.40',
      },

      /* ── Typography ──────────────────────────────────────────────────── */
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
        mono: [
          'JetBrains Mono',
          'Menlo',
          'Monaco',
          'Consolas',
          'monospace',
        ],
      },

      /* ── Spacing ─────────────────────────────────────────────────────── */
      spacing: {
        '18': '4.5rem',   // 72px
        '88': '22rem',    // 352px
        '112': '28rem',   // 448px
        '128': '32rem',   // 512px
      },

      /* ── Shadows ─────────────────────────────────────────────────────── */
      boxShadow: {
        'surface': '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
        'popup':   '0 8px 24px rgba(0, 0, 0, 0.24), 0 2px 8px rgba(0, 0, 0, 0.12)',
        'modal':   '0 24px 48px rgba(0, 0, 0, 0.32), 0 4px 12px rgba(0, 0, 0, 0.20)',
        'focus':   'var(--kir-focus-ring)',
        'danger-focus': '0 0 0 2px var(--kir-bg-base), 0 0 0 4px var(--kir-border-error)',
      },

      /* ── Border Radius ───────────────────────────────────────────────── */
      borderRadius: {
        'button': '0.5rem',      // 8px
        'card':   '0.75rem',     // 12px
        'input':  '0.5rem',      // 8px
        'tag':    '9999px',      // pill
      },

      /* ── Ring Offset (for focus-visible) ─────────────────────────────── */
      ringOffsetWidth: {
        'kir': '2px',
      },
    },
  },
  plugins: [
    // Button variant plugin (usage: btn-primary, btn-secondary, etc.)
    function ({ addComponents, theme }) {
      addComponents({
        /* Primary button */
        '.btn-primary': {
          backgroundColor: theme('colors.accent.primary') || '#6CD9BA',
          color: '#13121A',
          borderRadius: theme('borderRadius.button') || '0.5rem',
          padding: '0.625rem 1.25rem',
          fontWeight: '600',
          fontSize: '0.875rem',
          lineHeight: '1.25rem',
          transition: 'all 150ms ease-in-out',
          '&:hover': {
            backgroundColor: theme('colors.accent.primaryHover') || '#8CE4CC',
            transform: 'translateY(-1px)',
          },
          '&:active': {
            backgroundColor: theme('colors.accent.primaryActive') || '#5BCBA8',
            transform: 'translateY(0)',
          },
          '&:focus-visible': {
            outline: 'none',
            boxShadow: theme('boxShadow.focus') || `0 0 0 2px #13121A, 0 0 0 4px #6CD9BA`,
          },
          '&:disabled': {
            opacity: '0.5',
            cursor: 'not-allowed',
            transform: 'none',
          },
        },

        /* Secondary button */
        '.btn-secondary': {
          backgroundColor: theme('colors.accent.secondary') || '#B775BF',
          color: '#13121A',
          borderRadius: theme('borderRadius.button') || '0.5rem',
          padding: '0.625rem 1.25rem',
          fontWeight: '600',
          fontSize: '0.875rem',
          lineHeight: '1.25rem',
          transition: 'all 150ms ease-in-out',
          '&:hover': {
            backgroundColor: theme('colors.accent.secondaryHover') || '#C990CD',
            transform: 'translateY(-1px)',
          },
          '&:active': {
            backgroundColor: '#A865AF',
            transform: 'translateY(0)',
          },
          '&:focus-visible': {
            outline: 'none',
            boxShadow: theme('boxShadow.focus') || `0 0 0 2px #13121A, 0 0 0 4px #6CD9BA`,
          },
          '&:disabled': {
            opacity: '0.5',
            cursor: 'not-allowed',
            transform: 'none',
          },
        },

        /* Danger button */
        '.btn-danger': {
          backgroundColor: '#E54848',
          color: '#FFFFFF',
          borderRadius: theme('borderRadius.button') || '0.5rem',
          padding: '0.625rem 1.25rem',
          fontWeight: '600',
          fontSize: '0.875rem',
          lineHeight: '1.25rem',
          transition: 'all 150ms ease-in-out',
          '&:hover': {
            backgroundColor: '#F55F5F',
            transform: 'translateY(-1px)',
          },
          '&:active': {
            backgroundColor: '#C73D3D',
            transform: 'translateY(0)',
          },
          '&:focus-visible': {
            outline: 'none',
            boxShadow: theme('boxShadow.dangerFocus') || `0 0 0 2px #13121A, 0 0 0 4px #E54848`,
          },
          '&:disabled': {
            opacity: '0.5',
            cursor: 'not-allowed',
            transform: 'none',
          },
        },

        /* Ghost button (bordered) */
        '.btn-ghost': {
          backgroundColor: 'transparent',
          color: 'var(--kir-text-primary)',
          border: '1px solid var(--kir-border-base)',
          borderRadius: theme('borderRadius.button') || '0.5rem',
          padding: '0.625rem 1.25rem',
          fontWeight: '600',
          fontSize: '0.875rem',
          lineHeight: '1.25rem',
          transition: 'all 150ms ease-in-out',
          '&:hover': {
            backgroundColor: 'var(--kir-bg-hover)',
            borderColor: 'var(--kir-border-hover)',
          },
          '&:active': {
            backgroundColor: 'var(--kir-bg-active)',
          },
          '&:focus-visible': {
            outline: 'none',
            boxShadow: theme('boxShadow.focus') || `0 0 0 2px #13121A, 0 0 0 4px #6CD9BA`,
          },
          '&:disabled': {
            color: 'var(--kir-text-disabled)',
            borderColor: 'var(--kir-border-base)',
            opacity: '0.5',
            cursor: 'not-allowed',
          },
        },

        /* Link button (text-only) */
        '.btn-link': {
          backgroundColor: 'transparent',
          color: theme('colors.accent.indigo') || '#4227F2',
          padding: '0.625rem 0',
          fontWeight: '600',
          fontSize: '0.875rem',
          lineHeight: '1.25rem',
          textDecoration: 'underline',
          textUnderlineOffset: '0.125rem',
          transition: 'color 150ms ease-in-out',
          '&:hover': {
            color: theme('colors.accent.indigoHover') || '#6352F5',
          },
          '&:active': {
            color: '#3019C5',
          },
          '&:focus-visible': {
            outline: 'none',
            boxShadow: `0 0 0 2px var(--kir-bg-base), 0 0 0 4px var(--kir-accent-indigo)`,
            borderRadius: '0.25rem',
          },
          '&:disabled': {
            color: 'var(--kir-text-disabled)',
            cursor: 'not-allowed',
          },
        },

        /* Badge variants */
        '.badge-success': {
          backgroundColor: theme('colors.success.subtle') || 'rgba(7, 217, 140, 0.15)',
          color: theme('colors.success.DEFAULT') || '#07D98C',
          padding: '0.125rem 0.5rem',
          borderRadius: '9999px',
          fontSize: '0.75rem',
          fontWeight: '600',
          border: '1px solid',
          borderColor: theme('colors.success.DEFAULT') || '#07D98C',
        },
        '.badge-warning': {
          backgroundColor: theme('colors.warning.subtle') || 'rgba(242, 201, 76, 0.15)',
          color: theme('colors.warning.DEFAULT') || '#F2C94C',
          padding: '0.125rem 0.5rem',
          borderRadius: '9999px',
          fontSize: '0.75rem',
          fontWeight: '600',
          border: '1px solid',
          borderColor: theme('colors.warning.DEFAULT') || '#F2C94C',
        },
        '.badge-danger': {
          backgroundColor: theme('colors.danger.subtle') || 'rgba(229, 72, 72, 0.15)',
          color: theme('colors.danger.DEFAULT') || '#E54848',
          padding: '0.125rem 0.5rem',
          borderRadius: '9999px',
          fontSize: '0.75rem',
          fontWeight: '600',
          border: '1px solid',
          borderColor: theme('colors.danger.DEFAULT') || '#E54848',
        },
        '.badge-info': {
          backgroundColor: theme('colors.info.subtle') || 'rgba(66, 39, 242, 0.15)',
          color: theme('colors.info.DEFAULT') || '#4227F2',
          padding: '0.125rem 0.5rem',
          borderRadius: '9999px',
          fontSize: '0.75rem',
          fontWeight: '600',
          border: '1px solid',
          borderColor: theme('colors.info.DEFAULT') || '#4227F2',
        },

        /* Status dot */
        '.status-dot': {
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          display: 'inline-block',
          flexShrink: '0',
          '&.online':  { backgroundColor: theme('colors.status.online')  || '#07D98C' },
          '&.away':    { backgroundColor: theme('colors.status.away')    || '#F2C94C' },
          '&.busy':    { backgroundColor: theme('colors.status.busy')    || '#E54848' },
          '&.offline': { backgroundColor: theme('colors.status.offline') || '#4A4952' },
        },
      })
    },
  ],
}
