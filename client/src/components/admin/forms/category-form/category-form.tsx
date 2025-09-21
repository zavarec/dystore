import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Category, CreateCategoryDto, UpdateCategoryDto } from '@/types/models/category.model';
import { CategoriesService } from '@/services';
import { FloppyDisk, ArrowLeft } from '@phosphor-icons/react';
import Link from 'next/link';
import {
  FormContainer,
  FormGrid,
  FormGroup,
  Label,
  Input,
  Select,
  ErrorMessage,
  FormActions,
  Button,
  HelpText,
} from './category-form.style';
import { ProductImageUpload, UploadedFile } from '@/components/FileUpload/product-file-upload';
import { CategoryFormValues, mapFormToCategoryDto } from './category-forn.schema';

// Схема валидации
const categorySchema = yup.object({
  name: yup.string().required('Название обязательно'),
  description: yup.string().nullable(),
  slug: yup
    .string()
    .required('Slug обязателен')
    .matches(/^[a-z0-9-]+$/, 'Slug может содержать только строчные буквы, цифры и дефис'),
  // imageId: yup.string(),
  parentId: yup.number().nullable(),
});

interface CategoryFormProps<T = CreateCategoryDto | UpdateCategoryDto> {
  category?: Category;
  onSubmit: (data: T) => Promise<void>;
  loading?: boolean;
}

export const CategoryForm = <T extends CreateCategoryDto | UpdateCategoryDto>({
  category,
  onSubmit,
  loading = false,
}: CategoryFormProps<T>) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [uploadNotice, setUploadNotice] = useState<
    { type: 'success' | 'error'; msg: string } | undefined
  >(undefined);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
  } = useForm<CategoryFormValues>({
    resolver: yupResolver(categorySchema as yup.ObjectSchema<CategoryFormValues>),
    defaultValues: {
      name: category?.name || '',
      description: category?.description || '',
      slug: category?.slug || '',
      imageId: (category as any)?.image?.id ?? undefined,
      imageUrl: (category as any)?.image?.url ?? undefined,
      parentId: category?.parentId || null,
    },
  });

  const nameValue = watch('name');

  useEffect(() => {
    // Загружаем категории для выбора родительской
    const fetchCategories = async () => {
      try {
        const data = await CategoriesService.getAllCategories();
        // Исключаем текущую категорию и её подкатегории из списка
        if (category) {
          const filterOutDescendants = (categories: Category[], targetId: number): Category[] => {
            return categories.filter(cat => {
              if (cat.id === targetId) return false;
              if (cat.children) {
                cat.children = filterOutDescendants(cat.children, targetId);
              }
              return true;
            });
          };
          setCategories(filterOutDescendants(data, category.id));
        } else {
          setCategories(data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, [category]);

  // Автоматическая генерация slug из названия
  useEffect(() => {
    if (!category && nameValue) {
      const slug = nameValue
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setValue('slug', slug);
    }
  }, [nameValue, setValue, category]);

  // Аплоад главного изображения категории (через File API)
  const handleImageChange = (fileId?: string | null, file?: UploadedFile) => {
    const validId = fileId && fileId.trim() !== '' ? fileId : undefined;
    setValue('imageId', validId, { shouldValidate: true });

    console.log(file, 'file');
    console.log(fileId, 'fileId');

    if (file?.url) {
      setValue('imageUrl', file.url, { shouldValidate: true });
      setUploadNotice({ type: 'success', msg: 'Изображение категории загружено' });
    } else if (file?.storedName) {
      setValue('imageUrl', `/api/upload/files/${encodeURIComponent(file.storedName)}/view`, {
        shouldValidate: true,
      });
      setUploadNotice({ type: 'success', msg: 'Изображение категории загружено' });
    } else if (!fileId) {
      // удаление
      setValue('imageUrl', undefined, { shouldValidate: true });
      setUploadNotice({ type: 'success', msg: 'Изображение категории удалено' });
    }
    // скрыть уведомление через 4 сек
    setTimeout(() => setUploadNotice(undefined), 4000);
  };

  const handleImageError = (message: string) => {
    setUploadNotice({ type: 'error', msg: message });
    setTimeout(() => setUploadNotice(undefined), 5000);
  };

  const handleFormSubmit = async (values: CategoryFormValues) => {
    const formData = {
      ...values,
      parentId: values.parentId ? Number(values.parentId) : null,
    };
    await onSubmit(mapFormToCategoryDto(formData) as T);
  };

  return (
    <FormContainer onSubmit={handleSubmit(handleFormSubmit)}>
      <FormGrid>
        <FormGroup>
          <Label htmlFor="name">Название категории *</Label>
          <Input
            id="name"
            type="text"
            {...register('name')}
            placeholder="Например: Пылесосы"
            disabled={loading}
          />
          {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="slug">URL-адрес (slug) *</Label>
          <Input
            id="slug"
            type="text"
            {...register('slug')}
            placeholder="vacuum-cleaners"
            disabled={loading}
          />
          {errors.slug && <ErrorMessage>{errors.slug.message}</ErrorMessage>}
          <HelpText>Используется в URL страницы категории</HelpText>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="description">Описание категории </Label>
          <Input
            id="description"
            type="text"
            {...register('description')}
            placeholder="Например: Пылесосы"
            disabled={loading}
          />
          {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
        </FormGroup>

        <FormGroup $fullWidth>
          <Label>Изображение категории</Label>
          <Controller
            control={control}
            name="imageId"
            render={() => (
              <ProductImageUpload
                value={watch('imageId') || ''}
                currentImageUrl={watch('imageUrl') || ''}
                onChange={handleImageChange}
                onError={handleImageError}
                disabled={loading}
                label="Изображение категории"
                size="sm"
                containerMinHeight={70}
                previewMaxHeight={90}
                previewWidth={120}
                previewHeight={90}
                borderRadius={12}
              />
            )}
          />
          {/* скрытое поле — только для превью */}
          <Controller
            name="imageUrl"
            control={control}
            render={({ field }) => <input type="hidden" {...field} />}
          />
        </FormGroup>
      </FormGrid>
      <FormGroup>
        <Label htmlFor="parentId">Родительская категория</Label>
        <Select id="parentId" {...register('parentId')} disabled={loading}>
          <option value="">Нет (корневая категория)</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </Select>
        <HelpText>Оставьте пустым для создания корневой категории</HelpText>
      </FormGroup>

      <FormActions>
        <Link href="/admin/categories" passHref legacyBehavior>
          <Button as="a" $variant="secondary">
            <ArrowLeft size={18} />
            Отмена
          </Button>
        </Link>
        <Button type="submit" disabled={loading}>
          <FloppyDisk size={18} />
          {loading ? 'Сохранение...' : category ? 'Обновить' : 'Создать'}
        </Button>
      </FormActions>
    </FormContainer>
  );
};
