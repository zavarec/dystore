import { useEffect, useState } from 'react';

import Link from 'next/link';

import { yupResolver } from '@hookform/resolvers/yup';
import { FloppyDisk, ArrowLeft } from '@phosphor-icons/react';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';

import { CategoriesService } from '@/services';
import type { Category } from '@/types/models/category.model';
import type { Product, CreateProductDto, UpdateProductDto } from '@/types/models/product.model';

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

// Схема валидации
const productSchema = yup.object({
  name: yup.string().required('Название обязательно'),
  description: yup.string().required('Описание обязательно'),
  price: yup
    .number()
    .required('Цена обязательна')
    .positive('Цена должна быть положительной')
    .typeError('Цена должна быть числом'),
  stock: yup
    .number()
    .required('Количество обязательно')
    .min(0, 'Количество не может быть отрицательным')
    .integer('Количество должно быть целым числом')
    .typeError('Количество должно быть числом'),
  categoryId: yup.number().required('Категория обязательна').positive('Выберите категорию'),
  imageUrl: yup.string().url('Введите корректный URL'),
  isFeatured: yup.boolean(),
});

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: CreateProductDto | UpdateProductDto) => Promise<void>;
  loading?: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({ product, onSubmit, loading = false }) => {
  const [categories, setCategories] = useState<Category[]>([]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(productSchema),
    defaultValues: {
      name: product?.name || '',
      description: product?.description || '',
      price: product?.price || 0,
      stock: product?.stock || 0,
      categoryId: product?.categoryId || 0,
      imageUrl: product?.imageUrl || '',
      isFeatured: product?.isFeatured || false,
    },
  });

  useEffect(() => {
    // Загружаем категории для селекта
    const fetchCategories = async () => {
      try {
        const data = await CategoriesService.getAllCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleFormSubmit = async (data: any) => {
    const formData = {
      ...data,
      categoryId: parseInt(String(data.categoryId)),
    };
    await onSubmit(formData);
  };

  return (
    <FormContainer onSubmit={handleSubmit(handleFormSubmit)}>
      <FormGrid>
        <FormGroup $fullWidth>
          <Label htmlFor="name">Название продукта *</Label>
          <Input
            id="name"
            type="text"
            {...register('name')}
            placeholder="Например: Dyson V15 Detect"
            disabled={loading}
          />
          {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
        </FormGroup>

        <FormGroup $fullWidth>
          <Label htmlFor="description">Описание *</Label>
          <Textarea
            id="description"
            {...register('description')}
            placeholder="Подробное описание продукта..."
            disabled={loading}
          />
          {errors.description && <ErrorMessage>{errors.description.message}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="price">Цена (₽) *</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            {...register('price')}
            placeholder="0.00"
            disabled={loading}
          />
          {errors.price && <ErrorMessage>{errors.price.message}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="stock">Количество на складе *</Label>
          <Input
            id="stock"
            type="number"
            {...register('stock')}
            placeholder="0"
            disabled={loading}
          />
          {errors.stock && <ErrorMessage>{errors.stock.message}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="categoryId">Категория *</Label>
          <Select id="categoryId" {...register('categoryId')} disabled={loading}>
            <option value="">Выберите категорию</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
          {errors.categoryId && <ErrorMessage>{errors.categoryId.message}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="imageUrl">URL изображения</Label>
          <Input
            id="imageUrl"
            type="url"
            {...register('imageUrl')}
            placeholder="https://example.com/image.jpg"
            disabled={loading}
          />
          {errors.imageUrl && <ErrorMessage>{errors.imageUrl.message}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <CheckboxWrapper>
            <Controller
              name="isFeatured"
              control={control}
              render={({ field }) => (
                <Checkbox
                  type="checkbox"
                  checked={field.value || false}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  disabled={loading}
                />
              )}
            />
            Рекомендуемый продукт
          </CheckboxWrapper>
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
          {loading ? 'Сохранение...' : product ? 'Обновить' : 'Создать'}
        </Button>
      </FormActions>
    </FormContainer>
  );
};
