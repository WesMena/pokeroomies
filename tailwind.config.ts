import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        pkred: '#FF0000',
        pkred2: '#CC0000',
        pkblue: '#3B4CCA',
        pkyellow: '#FFDE00',
        pkyellow2: '#B3A125',
      },
      fontFamily: {
        pokemon: ['"Press Start 2P"', 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config
