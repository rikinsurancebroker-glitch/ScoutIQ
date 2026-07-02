import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    '../../site-shared/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
        accent: ['"Cormorant Garamond"', 'Georgia', 'serif'],
      },
      boxShadow: {
        glow: '0 0 60px -12px rgba(251, 191, 36, 0.35)',
        card: '0 24px 48px -12px rgba(28, 25, 23, 0.12)',
        lift: '0 32px 64px -16px rgba(124, 45, 18, 0.2)',
      },
    },
  },
  plugins: [],
}
export default config
