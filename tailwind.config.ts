import type { Config } from 'tailwindcss'
import colors from 'tailwindcss/colors';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/constants/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    colors: {
      ...colors,
      background: '#000000',
      primaryText: '#fcfcfc',
      secondaryText: '#999999',
      primary: '#ed02eb',
      secondaryBackground: '#161616'
    },
    fontFamily: {
      'diatype': ['ABCDiatype', 'Helvetica', 'sans-serif'],
      'giasyr': ['ABC Gaisyr', 'Helvetica', 'sans-serif'],
      'gilroyBold': ['Gilroy-Bold', 'Helvetica', 'sans-serif'],
      'gilroyRegular': ['Gilroy-Regular', 'Helvetica', 'sans-serif'],
    },
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
export default config
