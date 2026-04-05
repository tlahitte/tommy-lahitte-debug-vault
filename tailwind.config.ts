import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        surface: 'var(--surface)',
        'surface-raised': 'var(--surface-raised)',
        'text-primary': 'var(--text-primary)',
        'text-muted': 'var(--text-muted)',
        accent: 'var(--accent)',
        'accent-hover': 'var(--accent-hover)',
        border: 'var(--border)',
        wood: 'var(--wood-base)',
        'wood-dark': 'var(--wood-dark)',
        'wood-light': 'var(--wood-light)',
      },
      fontFamily: {
        display: ['var(--font-denim)', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 6s linear infinite',
        aurora: 'aurora 60s linear infinite',
        wave: 'wave 0.8s ease-in-out 10s infinite',
      },
      keyframes: {
        aurora: {
          from: { backgroundPosition: '50% 50%, 50% 50%' },
          to: { backgroundPosition: '350% 50%, 350% 50%' },
        },
        wave: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '15%': { transform: 'rotate(20deg)' },
          '30%': { transform: 'rotate(-10deg)' },
          '45%': { transform: 'rotate(20deg)' },
          '60%': { transform: 'rotate(-5deg)' },
          '75%': { transform: 'rotate(0deg)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
