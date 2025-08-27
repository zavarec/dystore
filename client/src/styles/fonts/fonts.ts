import { Inter, Roboto, Montserrat, Poppins } from 'next/font/google';

export const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
});

export const roboto = Roboto({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '700'],
  variable: '--font-roboto',
  display: 'swap',
});

export const montserrat = Montserrat({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const poppins = Poppins({
  // Poppins не имеет кириллицы в next/font; используем поддерживаемые наборы
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '700'],
  variable: '--font-poppins',
  display: 'swap',
});
