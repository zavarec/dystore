import type { ProductFormValues } from '@/components/admin/forms/product-form/product-form.schema';
import type { CreateProductDto, KeyFeatureDto, SpecItemDto } from '@/types/models/product.model';

const spreadIf = <T extends object>(c: boolean, o: T) => (c ? o : {});

const isRemovable = (v: unknown): boolean => {
  if (v === null || v === undefined) return true;
  if (typeof v === 'string' && v.trim() === '') return true;
  if (Array.isArray(v)) return v.length === 0;
  if (typeof v === 'object') return Object.keys(v as object).length === 0;
  return false;
};

const compactDeep = <T>(input: T): T => {
  if (Array.isArray(input)) {
    const arr = input.map(compactDeep).filter(v => !isRemovable(v));
    // @ts-expect-error
    return arr;
  }
  if (input && typeof input === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(input)) {
      const vv = compactDeep(v as any);
      if (!isRemovable(vv)) out[k] = vv;
    }
    return out as T;
  }
  return input;
};

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

  const keyFeatures: KeyFeatureDto[] = (values.keyFeatures ?? [])
    .map((feature, idx) => {
      const text = normalizeToString(feature);
      if (!text) return null;
      return {
        text,
        order: idx,
      } as KeyFeatureDto;
    })
    .filter((x): x is KeyFeatureDto => !!x);
  const dtoRaw = {
    slug: values.slug,
    name: values.name,
    description: values.description,
    shortDescription: normalizeToString(values.shortDescription),
    price: values.price,
    stock: values.stock,
    categoryId: values.categoryId,
    isFeatured: values.isFeatured,
    motifId: values.motifImageId,
    ...(values.isFeatured ? { isFeatured: true } : {}),
    // Передаем ID изображений только если они не пустые
    ...(values.mainImageId?.trim() ? { mainImageId: values.mainImageId.trim() } : {}),
    ...(values.dimensionsImageId?.trim()
      ? { dimensionsImageId: values.dimensionsImageId.trim() }
      : {}),

    ...(values.motifImageId?.trim() ? { motifId: values.motifImageId.trim() } : {}),
    ...(boxItems && boxItems.length ? { boxItems } : {}),
    ...(specs && specs.length ? { specs } : {}),
    ...(keyFeatures && keyFeatures.length ? { keyFeatures } : {}),
  };

  const dto = compactDeep(dtoRaw) as CreateProductDto;

  console.log(dto, 'DTO');
  return dto;
}
