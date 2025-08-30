import { useEffect, useMemo, useState } from 'react';
import { createCategoryPromoSection } from '@/store/slices/category-promo-sections/category-promo-sections.thunks';
import { useAppDispatch } from '@/hooks/redux';
import {
  CategoryPromoPlacement,
  CategoryPromoVariant,
} from '@/types/models/category-promo-section.model';
import { useAppSelector } from '@/hooks/redux';
import {
  selectRootCategories,
  selectIsRootCategoriesLoading,
} from '@/store/slices/categories-slice/categories.selectors';
import { fetchRootCategories } from '@/store/slices/categories-slice/categories.thunks';
import { toast } from 'react-toastify';

import {
  Backdrop,
  Body,
  Button,
  Field,
  Footer,
  Header,
  Input,
  Modal,
  Select,
  Title,
} from './category-promo-create-modal.style';
import { CloseBtn } from './category-promo-create-modal.style';
import {
  CategoryPromoPlacementLabels,
  CategoryPromoVariantLabels,
} from '@/constants/promo.constants';

// Удалён автокомплит: используем обычный select с названиями категорий

interface Props {
  onClose: () => void;
}

export function CategoryPromoCreateModal({ onClose }: Props) {
  const dispatch = useAppDispatch();
  const [submitting, setSubmitting] = useState(false);
  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [placement, setPlacement] = useState<CategoryPromoPlacement>(
    CategoryPromoPlacement.ABOVE_PRODUCTS,
  );
  const [variant, setVariant] = useState<CategoryPromoVariant>(CategoryPromoVariant.BANNER);
  const [title, setTitle] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState<string>('');

  const canSubmit = useMemo(
    () => categoryId !== '' && !!placement && !!variant,
    [categoryId, placement, variant],
  );

  // загрузка категорий для select через store
  const categories = useAppSelector(selectRootCategories);
  const catsLoading = useAppSelector(selectIsRootCategoriesLoading);

  useEffect(() => {
    if (!categories || categories.length === 0) {
      dispatch(fetchRootCategories() as any);
    }
  }, [dispatch]);

  // esc / backdrop close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (categoryId === '') return;
    setSubmitting(true);
    try {
      const dto = {
        categoryId: Number(categoryId),
        placement,
        variant,
        ...(title ? { title } : {}),
        ...(imageUrl ? { imageUrl } : {}),
        ...(videoUrl ? { videoUrl } : {}),
      };
      await (dispatch(createCategoryPromoSection(dto)) as any).unwrap?.();
      // Если unwrap недоступен (типизация), просто продолжаем
      onClose();
    } catch (err: any) {
      toast.error(err?.message || 'Не удалось создать промо-секцию');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Backdrop onMouseDown={onClose}>
      <Modal onMouseDown={e => e.stopPropagation()}>
        <Header>
          <Title>Новая промо-секция</Title>
          <CloseBtn aria-label="Закрыть" onClick={onClose}>
            ×
          </CloseBtn>
        </Header>

        <Body onSubmit={submit}>
          <Field>
            Категория
            <Select
              value={categoryId}
              onChange={e => setCategoryId(e.target.value ? Number(e.target.value) : '')}
              disabled={catsLoading}
            >
              <option value="">{catsLoading ? 'Загрузка…' : 'Выберите категорию'}</option>
              {categories?.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </Field>

          <Field>
            Положение
            <Select
              value={placement}
              onChange={e => setPlacement(e.target.value as CategoryPromoPlacement)}
            >
              {Object.values(CategoryPromoPlacement).map(placement => (
                <option key={placement} value={placement}>
                  {CategoryPromoPlacementLabels[placement]}
                </option>
              ))}
            </Select>
          </Field>

          <Field>
            Вариант
            <Select
              value={variant}
              onChange={e => setVariant(e.target.value as CategoryPromoVariant)}
            >
              {Object.values(CategoryPromoVariant).map(variant => (
                <option key={variant} value={variant}>
                  {CategoryPromoVariantLabels[variant]}
                </option>
              ))}
            </Select>
          </Field>

          <Field>
            Заголовок
            <Input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Необязательно"
            />
          </Field>

          <Field>
            URL изображения
            <Input
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </Field>

          <Field>
            URL видео
            <Input
              value={videoUrl}
              onChange={e => setVideoUrl(e.target.value)}
              placeholder="https://example.com/video.mp4"
            />
          </Field>

          <Footer>
            <Button type="button" variant="ghost" onClick={onClose}>
              Отмена
            </Button>
            <Button type="submit" disabled={!canSubmit || submitting}>
              {submitting ? 'Создаём…' : 'Создать'}
            </Button>
          </Footer>
        </Body>
      </Modal>
    </Backdrop>
  );
}
