import localFont from 'next/font/local';
import { Nunito_Sans, Inter } from 'next/font/google';

export const nunitoSans = Nunito_Sans({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-nunito-sans',
  fallback: ['system-ui', 'Arial', 'sans-serif'],
});

export const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-inter',
  fallback: ['system-ui', 'Arial', 'sans-serif'],
});

export const dysonFutura = localFont({
  src: [
    {
      path: '../../public/fonts/DysonFutura.woff',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-dyson-futura',
  display: 'swap',
  fallback: ['system-ui', 'Arial', 'sans-serif'],
});

export const fontClassNames = `${nunitoSans.variable} ${inter.variable} ${dysonFutura.variable}`;



