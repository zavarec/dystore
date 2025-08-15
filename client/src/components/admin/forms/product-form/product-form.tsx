import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Product, CreateProductDto, UpdateProductDto } from '@/types/models/product.model';
import { useCategories } from '@/hooks/useCategories';
import { FloppyDisk, ArrowLeft } from '@phosphor-icons/react';
import Link from 'next/link';

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
import { productSchema } from './product-form.schema';

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: CreateProductDto | UpdateProductDto) => Promise<void>;
  loading?: boolean;
  initialValues?: Partial<CreateProductDto | UpdateProductDto>;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onSubmit,
  loading,
  initialValues,
}) => {
  const { categories, error } = useCategories();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Partial<CreateProductDto & UpdateProductDto>>({
    resolver: yupResolver(
      productSchema as yup.ObjectSchema<Partial<CreateProductDto & UpdateProductDto>>,
    ),
    defaultValues: initialValues || {},
  });

  useEffect(() => {
    if (initialValues) {
      reset(initialValues);
    }
  }, [initialValues, reset]);

  const handleFormSubmit = async (data: CreateProductDto | UpdateProductDto) => {
    await onSubmit(data);
  };

  return (
    <FormContainer onSubmit={handleSubmit(handleFormSubmit)}>
      <FormGrid>
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

        <FormGroup>
          <Label htmlFor="imageUrl">URL изображения</Label>
          <Controller
            name="imageUrl"
            control={control}
            render={({ field }) => (
              <Input
                id="imageUrl"
                type="url"
                {...field}
                placeholder="https://example.com/image.jpg"
                disabled={loading}
              />
            )}
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
