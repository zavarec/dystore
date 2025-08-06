import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
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

// Схема валидации
const categorySchema = yup.object({
  name: yup.string().required('Название обязательно'),
  slug: yup
    .string()
    .required('Slug обязателен')
    .matches(/^[a-z0-9-]+$/, 'Slug может содержать только строчные буквы, цифры и дефис'),
  image: yup.string().url('Введите корректный URL'),
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

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(categorySchema),
    defaultValues: {
      name: category?.name || '',
      slug: category?.slug || '',
      image: category?.image || '',
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

  const handleFormSubmit = async (data: any) => {
    const formData = {
      ...data,
      parentId: data.parentId ? parseInt(data.parentId) : null,
    } as T;
    await onSubmit(formData);
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

        <FormGroup>
          <Label htmlFor="image">URL изображения</Label>
          <Input
            id="image"
            type="url"
            {...register('image')}
            placeholder="https://example.com/category-image.jpg"
            disabled={loading}
          />
          {errors.image && <ErrorMessage>{errors.image.message}</ErrorMessage>}
          <HelpText>Изображение для отображения в каталоге</HelpText>
        </FormGroup>
      </FormGrid>

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
