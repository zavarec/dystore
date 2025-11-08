import { object, string } from 'yup';

import type { ContactMode } from './contact-request-form';
import type { ObjectSchema } from 'yup';

const digits = (s?: string) => (s ?? '').replace(/\D+/g, '');

export type ContactFormValues = {
  fullName: string;
  email: string;
  phone: string;
  message: string;
};

const baseSchema: ObjectSchema<ContactFormValues> = object({
  fullName: string().max(120, 'Слишком длинное имя').default('').defined(),
  email: string().email('Некорректный email').default('').defined(),
  phone: string().default('').defined(),
  message: string()
    .required('Опишите вопрос')
    .min(8, 'Добавьте чуть больше деталей')
    .max(5000, 'Слишком длинное сообщение')
    .default('')
    .defined(),
})
  .noUnknown()
  .required();

export function getContactRequestValidationSchema(
  mode?: ContactMode,
): ObjectSchema<ContactFormValues> {
  if (mode === 'email') {
    return baseSchema.shape({
      email: string().email('Некорректный email').required('Укажите email').default(''),
    }) as ObjectSchema<ContactFormValues>;
  }
  if (mode === 'phone') {
    return baseSchema.shape({
      phone: string()
        .test('phone', 'Укажите корректный номер', v => digits(v ?? '').length >= 10)
        .required('Укажите телефон'),
    }) as ObjectSchema<ContactFormValues>;
  }

  return baseSchema.test('email-or-phone', 'Укажите email или телефон', v => {
    if (!v) return false;
    const hasEmail = !!v.email?.trim();
    const hasPhone = digits(v.phone ?? '').length >= 10;
    return hasEmail || hasPhone;
  });
}
