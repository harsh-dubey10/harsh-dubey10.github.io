import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0B0F1A', // page background
          surface: '#121826', // card background
          raised: '#171F30', // elevated card / hover background
          border: '#232C40',
          borderSoft: '#181F30',
        },
        text: {
          DEFAULT: '#E7EBF3',
          dim: '#8891A3',
          faint: '#545E70',
        },
        brass: {
          DEFAULT: '#D9A54A', // primary accent — warm, instrument-panel brass
          dim: '#8A6B2E',
          soft: 'rgba(217,165,74,0.12)',
        },
        signal: {
          DEFAULT: '#6FCF97', // secondary accent — muted status green
        },
        wire: {
          DEFAULT: '#6C93C7', // tertiary accent — links
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        body: ['"IBM Plex Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        morva: ['"MORVA"', '"Fraunces"', 'ui-serif', 'serif'],
      },
      maxWidth: {
        rail: '960px',
      },
      keyframes: {
        blink: {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.4', transform: 'scale(1.6)' },
        },
      },
      animation: {
        blink: 'blink 1s step-end infinite',
        pulseDot: 'pulseDot 1.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
} satisfies Config
