import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    '../../site-shared/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Oswald"', 'Impact', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      colors: {
        blaze: {
          DEFAULT: '#FF6B1A',
          light: '#FF8B3D',
        },
        night: '#0A0A0A',
        coal: '#161616',
      },
      boxShadow: {
        blaze: '0 0 48px -12px rgba(255, 107, 26, 0.5)',
        card: '0 20px 44px -18px rgba(0, 0, 0, 0.8)',
      },
    },
  },
  plugins: [],
}
export default config
