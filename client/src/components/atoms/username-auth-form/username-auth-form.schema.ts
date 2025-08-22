import { InferType, object, string } from 'yup';

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
}

export const loginValidationSchema = object({
  email: string().required('Email обязателен').email('Введите корректный email'),
  password: string().required('Пароль обязателен').min(6, 'Пароль должен быть не менее 6 символов'),
});

export const registerValidationSchema = object({
  email: string().required('Email обязателен').email('Введите корректный email'),
  password: string().required('Пароль обязателен').min(5, 'Пароль должен быть не менее 5 символов'),
  confirmPassword: string()
    .required('Подтвердите пароль')
    .test('passwords-match', 'Пароли не совпадают', function (value) {
      return this.parent.password === value;
    }),
  name: string().optional(),
});

export type RegisterFormSchema = InferType<typeof registerValidationSchema>;
