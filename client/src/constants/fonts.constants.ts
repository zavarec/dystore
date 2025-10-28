import type { PromoFont } from '@/types/models/promo-section.model';

export const fontFamilyMap: Record<PromoFont | 'DEFAULT', string> = {
  INTER: '"Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  ROBOTO: '"Roboto", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  MONTSERRAT: '"Montserrat", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  POPPINS: '"Poppins", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  NUNITO_SANS: 'var(--font-nunito-sans), system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  DEFAULT: 'var(--font-nunito-sans), system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
};
