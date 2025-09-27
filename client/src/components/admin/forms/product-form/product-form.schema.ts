import { boolean, number, object, string } from 'yup';

// что реально редактируется в форме
type BoxItemForm = {
  accessoryId?: number;
  customName?: string;
  customImageId?: string;
  description?: string;
  qty: number;
  order: number;
  customImageUrl?: string;
};

type SpecItemForm = {
  // либо attributeId из справочника, либо label вручную
  attributeId?: number;
  label?: string;
  value: string; // в UI храним строкой; на сабмите сконвертируем в number/bool
  unit?: string;
  order: number;
};

export type ProductFormValues = {
  slug: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: number;

  // Новые поля для файлов
  mainImageId?: string;
  dimensionsImageId?: string;
  imageUrl?: string;
  dimensionsImageUrl?: string;
  motifImageId?: string;
  motifImageUrl?: string;

  isFeatured?: boolean;

  boxItems?: BoxItemForm[];
  specs?: SpecItemForm[];
};

const urlOrRelative = string()
  .transform(v => (v === '' ? undefined : v)) // пустую строку в undefined
  .test('is-url-or-relative', 'Введите корректный URL', v => {
    if (v == null) return true; // undefined/nullable — ок
    if (v.startsWith('/')) return true; // относительный URL — ок
    try {
      new URL(v); // абсолютный — ок
      return true;
    } catch {
      return false;
    }
  });

// Схема валидации
export const productSchema = object({
  slug: string()
    .required('Укажи slug')
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/i, 'Только латиница, цифры и дефисы'),
  name: string().optional(),
  description: string().optional(),
  price: number()
    .optional()
    .positive('Цена должна быть положительной')
    .typeError('Цена должна быть числом'),
  stock: number()
    .optional()
    .min(0, 'Количество не может быть отрицательным')
    .integer('Количество должно быть целым числом')
    .typeError('Количество должно быть числом'),
  categoryId: number()
    .optional()
    .positive('Выберите категорию')
    .typeError('Категория должна быть числом'),
  imageUrl: urlOrRelative.optional(),
  dimensionsImageUrl: string().url('Введите корректный URL').optional(),
  isFeatured: boolean().optional(),
});

export type ApiSpec = {
  id: number;
  productId: number;
  attributeId: number | null;
  valueString: string | null;
  valueNumber: number | null;
  valueBool: boolean | null;
  unitOverride: string | null;
  order?: number;
  attribute?: { id: number; unit?: string; type: 'STRING' | 'NUMBER' | 'BOOLEAN'; label: string };
};

export function specsToForm(specs: ApiSpec[]) {
  return specs.map((s): any => {
    // берём значение из того поля, которое не null
    let value: any = '';
    if (s.valueString != null) value = s.valueString;
    else if (s.valueNumber != null) value = s.valueNumber;
    else if (s.valueBool != null) value = s.valueBool;

    return {
      id: s.id, // если нужно
      attributeId: s.attributeId ?? s.attribute?.id ?? 0,
      label: s.attribute?.label ?? '',
      unit: s.unitOverride ?? s.attribute?.unit ?? '',
      value,
      order: s.order ?? 0,
    };
  });
}
