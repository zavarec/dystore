import * as yup from 'yup';

export type CategoryFormValues = {
  name: string;
  slug: string;
  description?: string | null | undefined;
  parentId?: number | null | undefined;

  // новое: работаем через File.id (string)
  imageId?: string | null | undefined;
  imageUrl?: string | undefined; // только для превью
};

export const categorySchema: yup.ObjectSchema<CategoryFormValues> = yup
  .object({
    name: yup.string().required('Название обязательно'),
    slug: yup
      .string()
      .required('Slug обязателен')
      .matches(/^[a-z0-9-]+$/, 'Slug может содержать только строчные буквы, цифры и дефис'),
    description: yup.string().nullable(),
    parentId: yup
      .number()
      .transform(v => (Number.isNaN(v) ? null : v))
      .nullable(),
    imageId: yup.string().nullable().optional(),
    imageUrl: yup.string().url('Введите корректный URL').optional(),
  })
  .required();

/** Приводим форму к DTO на бэк. imageId = undefined не шлём. */
export function mapFormToCategoryDto(values: CategoryFormValues) {
  const dto: Record<string, any> = {
    name: values.name,
    slug: values.slug,
    description: values.description ?? null,
    parentId:
      values.parentId === null || values.parentId === undefined ? null : Number(values.parentId),
  };

  if (values.imageId === null) {
    // явно сбросить картинку
    dto.imageId = null;
  } else if (typeof values.imageId === 'string' && values.imageId.trim() !== '') {
    dto.imageId = values.imageId;
  }
  // imageUrl на бэк не отправляем — это только для превью

  return dto;
}
