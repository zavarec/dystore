import { useEffect, useState } from 'react';

import Link from 'next/link';

import { yupResolver } from '@hookform/resolvers/yup';
import { FloppyDisk, ArrowLeft } from '@phosphor-icons/react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';

// import { specAttributeRuMap } from '@/constants/spec-attributes.constant';
// import FileUpload from '@/components/FileUpload/FileUpload';
import { ProductImageUpload } from '@/components/FileUpload/product-file-upload';
import type { UploadedFile } from '@/components/FileUpload/product-file-upload';
import { useAppDispatch } from '@/hooks/redux';
import { useSpecAttributes } from '@/hooks/use-spec-attributes';
import { useCategories } from '@/hooks/useCategories';
import type { SpecAttributeDto } from '@/services/spec-attributes.service';
import { createSpecAttribute } from '@/store/slices/products-slice/products.thunks';
import type {
  Product,
  CreateProductDto,
  UpdateProductDto,
  BoxItemDto,
} from '@/types/models/product.model';
import { mapFormToCreateDto } from '@/utils/map-form-to-create-product';
import { slugify } from '@/utils/slugify';

import type { ApiSpec, ProductFormValues } from './product-form.schema';
import type * as yup from 'yup';

import { BoxRow } from './components/box-row';
import { SpecRow } from './components/spec-row';
import { productSchema, specsToForm } from './product-form.schema';
import {
  FormContainer,
  FormGrid,
  FormGroup,
  Label,
  Input,
  Textarea,
  Select,
  ErrorMessage,
  FormActions,
  Button,
  CheckboxWrapper,
  Checkbox,
} from './product-form.style';

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: CreateProductDto | UpdateProductDto) => Promise<void>;
  loading?: boolean;
  initialValues?: Partial<CreateProductDto | UpdateProductDto>;
  isEdit?: boolean;
}

type PartialCreateWithUpdateProductDto = Partial<CreateProductDto | UpdateProductDto>;

const norm = (s?: string) => (s ?? '').trim().replace(/\s+/g, ' ').toLowerCase();
const makeSpecAttributeKey = (label: string) => {
  const base = slugify(label).replace(/-/g, '_');
  if (base.length > 0) {
    return base;
  }

  return `attribute_${Math.random().toString(36).slice(2, 8)}`;
};

export const ProductForm: React.FC<ProductFormProps> = ({
  onSubmit,
  loading,
  initialValues,
  isEdit,
  // product, // Не используется в текущей реализации
}) => {
  const [slugTouched, setSlugTouched] = useState(false);
  // Состояния для уведомлений о загрузке файлов
  const [uploadNotifications, setUploadNotifications] = useState<{
    mainImage?: { type: 'success' | 'error'; message: string };
    dimensionsImage?: { type: 'success' | 'error'; message: string };
    motifImage?: { type: 'success' | 'error'; message: string };
  }>({});
  const dispatch = useAppDispatch();

  const { categories, error } = useCategories();
  const { attributes } = useSpecAttributes();

  const {
    control,
    register,
    handleSubmit,
    getValues,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<ProductFormValues>({
    resolver: yupResolver(productSchema as yup.ObjectSchema<ProductFormValues>),
    defaultValues: {
      slug: (initialValues as ProductFormValues)?.slug ?? '',
      boxItems: (initialValues as ProductFormValues)?.boxItems ?? [],
      specs: (initialValues as ProductFormValues)?.specs ?? [],
      keyFeatures: (initialValues as ProductFormValues)?.keyFeatures ?? [''],
    } as ProductFormValues,
  });

  const {
    fields: boxItems,
    append: appendBox,
    remove: removeBox,
  } = useFieldArray({ control, name: 'boxItems' });

  const {
    fields: specs,
    append: appendSpec,
    remove: removeSpec,
  } = useFieldArray({ control, name: 'specs' });

  const {
    fields: keyFeaturesFields,
    append: appendKeyFeature,
    remove: removeKeyFeature,
  } = useFieldArray({ control, name: 'keyFeatures' });

  const showUploadNotification = (
    field: 'mainImage' | 'dimensionsImage' | 'motifImage',
    type: 'success' | 'error',
    message: string,
  ) => {
    setUploadNotifications(prev => ({
      ...prev,
      [field]: { type, message },
    }));

    // Автоматически скрываем уведомление через 5 секунд
    setTimeout(() => {
      setUploadNotifications(prev => ({
        ...prev,
        [field]: undefined,
      }));
    }, 5000);
  };

  // автослаг по имени до ручного вмешательства
  useEffect(() => {
    if (!slugTouched) {
      const value = slugify(getValues('name') ?? '');
      setValue('slug', value, { shouldValidate: true });
    }
  }, [watch('name')]);

  // нормализация входящих значений из API
  useEffect(() => {
    if (initialValues) {
      // Обрабатываем boxItems с изображениями
      const normalizedBoxItems = (
        (initialValues as PartialCreateWithUpdateProductDto).boxItems ?? []
      ).map((item: BoxItemDto) => ({
        ...item,
        customImageId: item.customImage?.id || item.customImageId || '',
        // customImageUrl: item.customImage?.url || item.customImageUrl || '',
      }));

      const norm = {
        ...initialValues,
        specs: specsToForm(
          ((initialValues as PartialCreateWithUpdateProductDto).specs ?? []) as ApiSpec[],
        ),
        boxItems: normalizedBoxItems,
        // Правильно обрабатываем изображения
        imageUrl:
          (initialValues as PartialCreateWithUpdateProductDto).mainImage?.url ||
          (initialValues as PartialCreateWithUpdateProductDto).imageUrl ||
          '',
        mainImageId:
          (initialValues as Partial<CreateProductDto | UpdateProductDto>).mainImage?.id ||
          (initialValues as Partial<CreateProductDto | UpdateProductDto>).mainImageId ||
          '',
        dimensionsImageUrl:
          (initialValues as Partial<CreateProductDto | UpdateProductDto>).dimensionsImage?.url ||
          (initialValues as PartialCreateWithUpdateProductDto).dimensionsImageUrl ||
          '',
        dimensionsImageId:
          (initialValues as PartialCreateWithUpdateProductDto).dimensionsImage?.id ||
          (initialValues as PartialCreateWithUpdateProductDto).dimensionsImageId ||
          '',
        motifImageUrl:
          (initialValues as Partial<CreateProductDto | UpdateProductDto>).motif?.url ||
          (initialValues as PartialCreateWithUpdateProductDto).motifUrl ||
          '',
        motifImageId:
          (initialValues as Partial<CreateProductDto | UpdateProductDto>).motif?.id ||
          (initialValues as PartialCreateWithUpdateProductDto).motifId ||
          '',
        keyFeatures: (() => {
          const source = (initialValues as PartialCreateWithUpdateProductDto).keyFeatures ?? [];
          const normalized = (source as Array<string | { text?: string }>).map(feature =>
            typeof feature === 'string' ? feature : (feature?.text ?? ''),
          );
          const filtered = normalized.filter(Boolean);
          return filtered.length > 0 ? filtered : [''];
        })(),
      };

      reset(norm);
    }
  }, [initialValues, reset]);

  const onAppenedSpec = () =>
    appendSpec({ attributeId: 0, label: '', value: '', unit: '', order: specs.length });

  const onAppenedBox = () =>
    appendBox({ customName: '', customImageId: '', qty: 1, order: boxItems.length });

  const onAppendKeyFeature = () => appendKeyFeature('');

  const handleRemoveKeyFeature = (index: number) => {
    if (keyFeaturesFields.length <= 1) {
      setValue(`keyFeatures.${index}` as `keyFeatures.${number}`, '', { shouldValidate: true });
      return;
    }
    removeKeyFeature(index);
  };

  const keyFeaturesErrors = errors.keyFeatures as Array<{ message?: string }> | undefined;

  const handleFormSubmit = async (data: ProductFormValues) => {
    const specsList = data.specs ?? [];
    const existingByName = new Map<string, SpecAttributeDto>(
      (attributes ?? []).map(attr => [norm(attr.label), attr]),
    );

    const newAttributesByName = new Map<
      string,
      {
        label: string;
        unit?: string;
      }
    >();

    specsList.forEach(spec => {
      const cleanLabel = (spec.label ?? '').trim();
      if (!cleanLabel) return;

      const normalizedLabel = norm(cleanLabel);
      const hasExistingId = Number(spec.attributeId) > 0;
      const knownAttribute = existingByName.has(normalizedLabel);

      if (!hasExistingId && !knownAttribute && !newAttributesByName.has(normalizedLabel)) {
        newAttributesByName.set(normalizedLabel, {
          label: cleanLabel,
          unit: (spec.unit ?? '').trim() || '',
        });
      }
    });

    const usedAttributeKeys = new Set(
      (attributes ?? []).map(attr => attr.key.toLowerCase()).filter(Boolean),
    );

    const created = await Promise.all(
      Array.from(newAttributesByName.values()).map(async ({ label, unit }) => {
        const baseKey = makeSpecAttributeKey(label);
        let uniqueKey = baseKey;
        let counter = 1;
        while (usedAttributeKeys.has(uniqueKey.toLowerCase())) {
          uniqueKey = `${baseKey}_${counter}`;
          counter += 1;
        }
        usedAttributeKeys.add(uniqueKey.toLowerCase());

        const payload = {
          key: uniqueKey,
          label,
          unit: unit ?? undefined,
          type: 'STRING' as const,
        };

        const res = await dispatch(createSpecAttribute(payload as SpecAttributeDto)).unwrap();
        return res;
      }),
    );

    const nameToId = new Map<string, number>();
    (attributes ?? []).forEach(attribute => nameToId.set(norm(attribute.label), attribute.id));
    created.forEach(attribute => nameToId.set(norm(attribute.label), attribute.id));

    const patchedSpecs = (data.specs ?? [])
      .map((s, idx) => {
        const byId = Number(s.attributeId) > 0 ? s.attributeId : undefined;
        const byName = s.label ? nameToId.get(norm(s.label)) : undefined;
        const attributeId = byId ?? byName;

        if (!attributeId) {
          // Если сюда попали — значит нет ни id, ни созданного name (пустой label?)
          // Можно отфильтровать или бросить ошибку. Я просто пропущу такую строку.
          return null;
        }
        return {
          attributeId,
          value: s.value,
          unit: s.unit,
          order: idx,
          // label в DTO обычно не нужен — зависит от твоего mapFormToCreateDto
        };
      })
      .filter(Boolean) as Array<{
      attributeId: number;
      value: string;
      unit?: string;
      order: number;
    }>;

    const nextData: ProductFormValues = {
      ...data,
      specs: patchedSpecs,
      keyFeatures: (data.keyFeatures ?? []).map(feature => feature?.trim()).filter(Boolean),
    };

    await onSubmit(mapFormToCreateDto(nextData));

    console.log(data, 'DATA');
  };

  // Обработчики загрузки изображений
  const handleMainImageChange = (fileId?: string | null, file?: UploadedFile) => {
    // Если fileId пустой или null, устанавливаем undefined вместо пустой строки
    const validFileId = fileId && fileId.trim() !== '' ? fileId : undefined;
    setValue('mainImageId', validFileId, { shouldValidate: true });

    if (file?.url) {
      // Обновляем URL для отображения
      setValue('imageUrl', file.url, { shouldValidate: true });
      showUploadNotification('mainImage', 'success', 'Главное изображение загружено');
    } else if (file?.storedName) {
      setValue('imageUrl', `/api/upload/files/${encodeURIComponent(file?.storedName)}/view`, {
        shouldValidate: true,
      });
    } else {
      setValue('imageUrl', '', { shouldValidate: true });
    }
  };

  const handleMainImageError = (error: string) => {
    showUploadNotification('mainImage', 'error', error);
  };

  const handleDimensionsImageChange = (fileId?: string | null, file?: UploadedFile) => {
    // Если fileId пустой или null, устанавливаем undefined вместо пустой строки
    const validFileId = fileId && fileId.trim() !== '' ? fileId : undefined;
    setValue('dimensionsImageId', validFileId, { shouldValidate: true });

    if (file && file.url) {
      setValue('dimensionsImageUrl', file.url, { shouldValidate: true });
      showUploadNotification('dimensionsImage', 'success', 'Изображение габаритов загружено');
    } else {
      setValue('dimensionsImageUrl', '', { shouldValidate: true });
    }
  };

  const handleDimensionsImageError = (error: string) => {
    showUploadNotification('dimensionsImage', 'error', error);
  };

  const handleMotifImageChange = (fileId?: string | null, file?: UploadedFile) => {
    const validFileId = fileId && fileId.trim() !== '' ? fileId : undefined;
    setValue('motifImageId', validFileId, { shouldValidate: true });

    if (file && file.url) {
      setValue('motifImageUrl', file.url, { shouldValidate: true });
      showUploadNotification('motifImage', 'success', 'Motif изображение загружено');
    } else {
      setValue('motifImageUrl', '', { shouldValidate: true });
    }
  };

  const handleMotifImageError = (error: string) => {
    showUploadNotification('motifImage', 'error', error);
  };

  return (
    <FormContainer onSubmit={handleSubmit(handleFormSubmit)}>
      <FormGrid>
        {/* Slug */}
        <FormGroup>
          <Label htmlFor="slug">Slug *</Label>
          <Controller
            name="slug"
            control={control}
            render={({ field }) => (
              <Input
                id="slug"
                type="text"
                {...field}
                onChange={e => {
                  setSlugTouched(true);
                  field.onChange(e);
                }}
                placeholder="dyson-v15-detect-absolute"
                disabled={loading}
              />
            )}
          />
          {errors.slug && <ErrorMessage>{errors.slug.message}</ErrorMessage>}
        </FormGroup>

        {/* Название */}
        <FormGroup $fullWidth>
          <Label htmlFor="name">Название продукта *</Label>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                id="name"
                type="text"
                {...field}
                placeholder="Например: Dyson V15 Detect"
                disabled={loading}
              />
            )}
          />
          {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
        </FormGroup>

        {/* Описание */}
        <FormGroup $fullWidth>
          <Label htmlFor="description">Описание *</Label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Textarea
                id="description"
                {...field}
                placeholder="Подробное описание продукта..."
                disabled={loading}
              />
            )}
          />
          {errors.description && <ErrorMessage>{errors.description.message}</ErrorMessage>}
        </FormGroup>

        {/* Цена */}
        <FormGroup>
          <Label htmlFor="price">Цена (₽) *</Label>
          <Controller
            name="price"
            control={control}
            render={({ field }) => (
              <Input
                id="price"
                type="number"
                step="0.01"
                {...field}
                placeholder="0.00"
                disabled={loading}
              />
            )}
          />
          {errors.price && <ErrorMessage>{errors.price.message}</ErrorMessage>}
        </FormGroup>

        {/* Склад */}
        <FormGroup>
          <Label htmlFor="stock">Количество на складе *</Label>
          <Controller
            name="stock"
            control={control}
            render={({ field }) => (
              <Input id="stock" type="number" {...field} placeholder="0" disabled={loading} />
            )}
          />
          {errors.stock && <ErrorMessage>{errors.stock.message}</ErrorMessage>}
        </FormGroup>

        {/* Категория */}
        <FormGroup>
          <Label htmlFor="categoryId">Категория *</Label>
          <Controller
            name="categoryId"
            control={control}
            render={({ field }) => (
              <Select id="categoryId" {...field} disabled={loading}>
                <option value="">Выберите категорию</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>
            )}
          />
          {errors.categoryId && <ErrorMessage>{errors.categoryId.message}</ErrorMessage>}
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </FormGroup>

        {/* Картинка */}
        <FormGroup>
          <Label>Главное изображение товара</Label>
          <ProductImageUpload
            value={watch('mainImageId') || ''}
            currentImageUrl={watch('imageUrl') || ''}
            onChange={handleMainImageChange}
            onError={handleMainImageError}
            disabled={loading || false}
            label="Главное изображение"
            size="sm"
            containerMinHeight={40}
            previewMaxHeight={90}
            previewWidth={120}
            previewHeight={90}
            borderRadius={12}
          />

          {/* Уведомления о загрузке */}
          {uploadNotifications.mainImage && (
            <div
              style={{
                marginTop: '8px',
                padding: '8px 12px',
                borderRadius: '4px',
                fontSize: '14px',
                background:
                  uploadNotifications.mainImage.type === 'success' ? '#dcfce7' : '#fef2f2',
                color: uploadNotifications.mainImage.type === 'success' ? '#16a34a' : '#dc2626',
                border: `1px solid ${uploadNotifications.mainImage.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
              }}
            >
              {uploadNotifications.mainImage.message}
            </div>
          )}

          {/* Старое поле URL (скрытое, для совместимости) */}
          <Controller
            name="imageUrl"
            control={control}
            render={({ field }) => <Input {...field} type="hidden" />}
          />
        </FormGroup>

        <FormGroup $fullWidth>
          <Label htmlFor="dimensionsImageUrl">Изображение габаритов</Label>
          <ProductImageUpload
            value={watch('dimensionsImageId') || ''}
            currentImageUrl={watch('dimensionsImageUrl') || ''}
            onChange={handleDimensionsImageChange}
            onError={handleDimensionsImageError}
            disabled={loading || false}
            label="Изображение габаритов"
            size="sm"
            containerMinHeight={70}
            previewMaxHeight={90}
            previewWidth={120}
            previewHeight={90}
            borderRadius={12}
          />

          {/* Уведомления о загрузке */}
          {uploadNotifications.dimensionsImage && (
            <div
              style={{
                marginTop: '8px',
                padding: '8px 12px',
                borderRadius: '4px',
                fontSize: '14px',
                background:
                  uploadNotifications.dimensionsImage.type === 'success' ? '#dcfce7' : '#fef2f2',
                color:
                  uploadNotifications.dimensionsImage.type === 'success' ? '#16a34a' : '#dc2626',
                border: `1px solid ${uploadNotifications.dimensionsImage.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
              }}
            >
              {uploadNotifications.dimensionsImage.message}
            </div>
          )}

          {/* Скрытые поля для URL и ID */}
          <Controller
            name="dimensionsImageUrl"
            control={control}
            render={({ field }) => <Input {...field} type="hidden" />}
          />
          <Controller
            name="dimensionsImageId"
            control={control}
            render={({ field }) => <Input {...field} type="hidden" />}
          />
        </FormGroup>

        <FormGroup $fullWidth>
          <Label htmlFor="motifImageId">Motif изображение</Label>
          <ProductImageUpload
            value={watch('motifImageId') || ''}
            currentImageUrl={watch('motifImageUrl') || ''}
            onChange={handleMotifImageChange}
            onError={handleMotifImageError}
            disabled={loading || false}
            label="Motif изображение"
            size="sm"
            containerMinHeight={70}
            previewMaxHeight={90}
            previewWidth={120}
            previewHeight={90}
            borderRadius={12}
          />

          {uploadNotifications.motifImage && (
            <div
              style={{
                marginTop: '8px',
                padding: '8px 12px',
                borderRadius: '4px',
                fontSize: '14px',
                background:
                  uploadNotifications.motifImage.type === 'success' ? '#dcfce7' : '#fef2f2',
                color: uploadNotifications.motifImage.type === 'success' ? '#16a34a' : '#dc2626',
                border: `1px solid ${
                  uploadNotifications.motifImage.type === 'success' ? '#bbf7d0' : '#fecaca'
                }`,
              }}
            >
              {uploadNotifications.motifImage.message}
            </div>
          )}

          <Controller
            name="motifImageUrl"
            control={control}
            render={({ field }) => <Input {...field} type="hidden" />}
          />
          <Controller
            name="motifImageId"
            control={control}
            render={({ field }) => <Input {...field} type="hidden" />}
          />
        </FormGroup>

        {/* Фича-флаг */}
        <FormGroup>
          <CheckboxWrapper>
            <Controller
              name="isFeatured"
              control={control}
              render={({ field }) => (
                <Checkbox
                  type="checkbox"
                  checked={!!field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  disabled={loading}
                />
              )}
            />
            Рекомендуемый продукт
          </CheckboxWrapper>
        </FormGroup>

        {/* Комплектация */}
        <FormGroup $fullWidth>
          <Label>Комплектация</Label>
          {boxItems.map((f, index) => (
            <BoxRow
              key={f.id}
              index={index}
              control={control}
              setValue={setValue}
              // loading={loading}
              remove={() => removeBox(index)}
            />
          ))}
          <Button type="button" onClick={onAppenedBox}>
            + Добавить аксессуар
          </Button>
        </FormGroup>

        <FormGroup $fullWidth>
          <Label>Ключевые особенности</Label>
          {keyFeaturesFields.map((field, index) => {
            const featureError = keyFeaturesErrors?.[index]?.message;

            return (
              <div
                key={field.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  marginBottom: '12px',
                }}
              >
                <div style={{ display: 'flex', gap: '12px' }}>
                  <Input
                    {...register(`keyFeatures.${index}` as const)}
                    placeholder="Например: До 60 минут автономной работы"
                    disabled={loading}
                    style={{ flex: 1 }}
                  />
                  <Button
                    type="button"
                    $variant="secondary"
                    onClick={() => handleRemoveKeyFeature(index)}
                    disabled={keyFeaturesFields.length <= 1}
                  >
                    Удалить
                  </Button>
                </div>
                {featureError && <ErrorMessage>{featureError}</ErrorMessage>}
              </div>
            );
          })}
          <Button type="button" onClick={onAppendKeyFeature}>
            + Добавить особенность
          </Button>
        </FormGroup>

        {/* Характеристики */}
        <FormGroup $fullWidth>
          <Label>Характеристики</Label>
          {specs.map((spec, index) => (
            <SpecRow
              key={spec.id}
              index={index}
              control={control}
              // loading={loading}
              remove={() => removeSpec(index)}
              setValue={setValue}
              attributes={attributes}
            />
          ))}
          <Button type="button" onClick={onAppenedSpec}>
            + Добавить характеристику
          </Button>
        </FormGroup>
      </FormGrid>

      <FormActions>
        <Link href="/admin/products" passHref legacyBehavior>
          <Button as="a" $variant="secondary">
            <ArrowLeft size={18} />
            Отмена
          </Button>
        </Link>
        <Button type="submit" disabled={loading}>
          <FloppyDisk size={18} />
          {loading ? 'Сохранение...' : isEdit ? 'Обновить' : 'Создать'}
        </Button>
      </FormActions>
    </FormContainer>
  );
};
