import { object, string } from 'yup';

export const phoneValidationSchema = object({
  phone: string()
    .required('Номер телефона обязателен')
    .matches(/^\+7\d{10}$/, 'Введите номер в формате +7XXXXXXXXXX'),
});

export const codeValidationSchema = object({
  code: string()
    .required('Код подтверждения обязателен')
    .matches(/^\d{6}$/, 'Код должен состоять из 6 цифр'),
});
