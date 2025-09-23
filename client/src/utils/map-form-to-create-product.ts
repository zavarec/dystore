import type { ProductFormValues } from '@/components/admin/forms/product-form/product-form.schema';
import type { CreateProductDto, SpecItemDto } from '@/types/models/product.model';

const spreadIf = <T extends object>(c: boolean, o: T) => (c ? o : {});

function parseSmartNumber(raw: string): number {
  const s = (raw ?? '').trim();
  const norm = s
    .replace(/\s+/g, '')
    .replace(/(\d),(?=\d{3}\b)/g, '$1')
    .replace(',', '.');
  const n = Number(norm);
  return Number.isFinite(n) ? n : NaN;
}

function normalizeToString(v: unknown): string {
  if (v === null || v === undefined) return '';
  if (typeof v === 'string') return v.trim();
  if (typeof v === 'number') return String(v);
  if (typeof v === 'boolean') return v ? 'true' : 'false';
  return String(v);
}

export function mapFormToCreateDto(values: ProductFormValues): CreateProductDto {
  const specs: SpecItemDto[] = (values.specs ?? [])
    .map((s, idx) => {
      const attrId = Number(s.attributeId ?? 0);

      const raw = normalizeToString(s.value);

      if (!raw && !s.label && attrId <= 0) return null; // пустая строка → пропускаем

      let valuePart: Pick<SpecItemDto, 'valueString' | 'valueNumber' | 'valueBool'> = {};

      if (typeof s.value === 'number') {
        if (Number.isFinite(s.value)) valuePart = { valueNumber: s.value };
      } else if (typeof s.value === 'boolean') {
        valuePart = { valueBool: s.value };
      } else {
        const lower = raw.toLowerCase();
        const n = parseSmartNumber(raw);
        valuePart =
          raw !== '' && Number.isFinite(n)
            ? { valueNumber: n }
            : lower === 'true' || lower === 'false'
              ? { valueBool: lower === 'true' }
              : { valueString: raw };
      }

      if (attrId > 0) {
        // выбран существующий атрибут — игнорируем label/unit
        return {
          attributeId: attrId,
          order: typeof s.order === 'number' ? s.order : idx,
          ...valuePart,
          // unitOverride задаём только для кастомных атрибутов
        } as SpecItemDto;
      }

      // новый атрибут — отправляем label + unit, без attributeId

      return {
        attributeId: 0,
        label: normalizeToString(s.label),
        order: typeof s.order === 'number' ? s.order : idx,
        ...valuePart,
        ...(normalizeToString(s.unit) ? { unit: normalizeToString(s.unit) } : {}),
      } as SpecItemDto;
    })
    .filter((x): x is SpecItemDto => !!x);

  const boxItems = values.boxItems?.map((item, idx) => ({
    accessoryId: typeof item.accessoryId === 'number' ? item.accessoryId : null,
    customName: normalizeToString(item.customName),
    // Передаем customImageId только если он не пустой
    customImageId:
      item.customImageId && item.customImageId.trim() !== '' ? item.customImageId : null,
    description: normalizeToString(item.description),
    qty: typeof item.qty === 'number' ? item.qty : 1,
    order: typeof item.order === 'number' ? item.order : idx,
  }));
  const dto = {
    slug: values.slug,
    name: values.name,
    description: values.description,
    price: values.price,
    stock: values.stock,
    categoryId: values.categoryId,
    isFeatured: values.isFeatured,
    // Передаем ID изображений только если они не пустые
    ...spreadIf(!!values.mainImageId?.trim(), { mainImageId: values.mainImageId!.trim() }),
    ...spreadIf(!!values.dimensionsImageId?.trim(), {
      dimensionsImageId: values.dimensionsImageId!.trim(),
    }),
    // ...spreadIf(!!values.imageUrl?.trim(), { imageUrl: values.imageUrl!.trim() }),
    // ...spreadIf(!!values.dimensionsImageUrl?.trim(), {
    //   dimensionsImageUrl: values.dimensionsImageUrl!.trim(),
    // }),
    ...spreadIf(!!values.isFeatured, { isFeatured: true }),
    ...spreadIf((values.boxItems ?? []).length > 0, { boxItems }),
    ...spreadIf(specs.length > 0, { specs }),
  };

  console.log(dto, 'DTO');

  return dto as CreateProductDto;
}
