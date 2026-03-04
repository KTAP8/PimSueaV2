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
        brand: {
          green: '#08636D',
          orange: '#F05A25',
          red: '#C23B32',
        },
        'deep-black': '#121212',
        'slate-gray': '#6C757D',
        'surface-gray': '#E9ECEF',
        'crisp-white': '#F8F9FA',
      },
      borderRadius: {
        btn: '4px',
        card: '8px',
      },
    },
  },
  plugins: [],
}

export default config
