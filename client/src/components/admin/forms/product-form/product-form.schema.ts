import { boolean, number, object, string } from "yup";

// Схема валидации
export const productSchema = object({
  name: string().optional(),
  description: string().optional(),
  price: 
    number()
    .optional()
    .positive('Цена должна быть положительной')
    .typeError('Цена должна быть числом'),
  stock: 
    number()
    .optional()
    .min(0, 'Количество не может быть отрицательным')
    .integer('Количество должно быть целым числом')
    .typeError('Количество должно быть числом'),
  categoryId: 
    number()
    .optional()
    .positive('Выберите категорию')
    .typeError('Категория должна быть числом'),
  imageUrl: string().url('Введите корректный URL').optional(),
  isFeatured: boolean().optional(),
});