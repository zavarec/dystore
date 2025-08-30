import { object, string } from 'yup';

export const phoneValidationSchema = object({
  phone: string()
    .required('Введите номер телефона')
    .test(
      'filled',
      'Номер заполнен не полностью',
      value => (value?.replace(/\D/g, '').length ?? 0) === 11,
    ),
});

export const codeValidationSchema = object({
  code: string()
    .required('Код подтверждения обязателен')
    .matches(/^\d{6}$/, 'Код должен состоять из 6 цифр'),
});
