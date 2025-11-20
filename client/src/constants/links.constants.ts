import { COMPANY_INFO } from './contacts.constants';

export const LINKS = {
  PHONE_TEL: `tel:${COMPANY_INFO.COMPANY_PHONE_NUMBER.replace(/[^+0-9]/g, '')}`,
} as const;
