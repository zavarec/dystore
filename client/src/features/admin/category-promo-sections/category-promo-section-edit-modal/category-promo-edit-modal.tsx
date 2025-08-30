import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { updateCategoryPromoSection } from '@/store/slices/category-promo-sections/category-promo-sections.thunks';
import {
  CategoryPromoPlacement,
  CategoryPromoSectionAdmin,
  CategoryPromoVariant,
  PromoFont,
  ContentSideEnum,
} from '@/types/models/category-promo-section.model';
import {
  selectIsRootCategoriesLoading,
  selectRootCategories,
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
  CloseBtn,
} from '@/features/admin/category-promo-sections/category-promo-section-create-modal/category-promo-create-modal.style';
import {
  CategoryPromoPlacementLabels,
  CategoryPromoVariantLabels,
} from '@/constants/promo.constants';

interface Props {
  item: CategoryPromoSectionAdmin;
  onClose: () => void;
}

export function CategoryPromoEditModal({ item, onClose }: Props) {
  const dispatch = useAppDispatch();

  const [submitting, setSubmitting] = useState(false);
  const [categoryId, setCategoryId] = useState<number | ''>(
    item.category?.id ?? item.categoryId ?? '',
  );
  const [placement, setPlacement] = useState<CategoryPromoPlacement>(item.placement);
  const [variant, setVariant] = useState<CategoryPromoVariant>(item.variant);
  const [title, setTitle] = useState<string>(item.title ?? '');
  const [imageUrl, setImageUrl] = useState<string>(item.imageUrl ?? '');
  const [videoUrl, setVideoUrl] = useState<string>(item.videoUrl ?? '');
  const [subtitle, setSubtitle] = useState<string>(item.subtitle ?? '');
  const [ctaText, setCtaText] = useState<string>(item.ctaText ?? '');
  const [ctaLink, setCtaLink] = useState<string>(item.ctaLink ?? '');
  const [font, setFont] = useState<PromoFont | ''>(item.font ?? '');
  const [titleColor, setTitleColor] = useState<string>(item.titleColor ?? '');
  const [textColor, setTextColor] = useState<string>(item.textColor ?? '');
  const [ctaBg, setCtaBg] = useState<string>(item.ctaBg ?? '');
  const [ctaColor, setCtaColor] = useState<string>(item.ctaColor ?? '');
  const [bgColor, setBgColor] = useState<string>((item as any).bgColor ?? '');
  const [heightPx, setHeightPx] = useState<number | ''>((item as any).heightPx ?? '');
  const [isActive, setIsActive] = useState<boolean>(!!item.isActive);
  const [order, setOrder] = useState<number | ''>(typeof item.order === 'number' ? item.order : '');
  const [startsAt, setStartsAt] = useState<string>(
    item.startsAt ? toLocalDatetimeInput(item.startsAt) : '',
  );
  const [endsAt, setEndsAt] = useState<string>(
    item.endsAt ? toLocalDatetimeInput(item.endsAt) : '',
  );
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [contentSide, setContentSide] = useState<ContentSideEnum | ''>(
    (item as any).contentSide ?? '',
  );

  const canSubmit = useMemo(
    () => categoryId !== '' && !!placement && !!variant,
    [categoryId, placement, variant],
  );

  const categories = useAppSelector(selectRootCategories);
  const catsLoading = useAppSelector(selectIsRootCategoriesLoading);

  useEffect(() => {
    if (!categories || categories.length === 0) {
      dispatch(fetchRootCategories() as any);
    }
  }, [dispatch]);

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
      const dto: any = {
        categoryId: Number(categoryId),
        placement,
        variant,
        title: title || null,
        imageUrl: imageUrl || null,
        videoUrl: videoUrl || null,
        subtitle: subtitle || null,
        ctaText: ctaText || null,
        ctaLink: ctaLink || null,
        font: font || null,
        titleColor: titleColor || null,
        textColor: textColor || null,
        ctaBg: ctaBg || null,
        ctaColor: ctaColor || null,
        bgColor: bgColor || null,
        heightPx: heightPx === '' ? null : Number(heightPx),
        contentSide: contentSide || null,
        ...(showAdvanced || isActive !== item.isActive ? { isActive } : {}),
        ...((showAdvanced && order !== '') || (order !== '' && order !== item.order)
          ? { order: Number(order) }
          : {}),
        startsAt: startsAt ? new Date(startsAt).toISOString() : null,
        endsAt: endsAt ? new Date(endsAt).toISOString() : null,
      };
      await (dispatch(updateCategoryPromoSection({ id: item.id, dto })) as any).unwrap?.();
      onClose();
    } catch (err: any) {
      toast.error(err?.message || 'Не удалось обновить промо-секцию');
    } finally {
      setSubmitting(false);
    }
  };

  function toLocalDatetimeInput(iso: string): string {
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, '0');
    const yyyy = d.getFullYear();
    const MM = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const hh = pad(d.getHours());
    const mm = pad(d.getMinutes());
    return `${yyyy}-${MM}-${dd}T${hh}:${mm}`;
  }

  return (
    <Backdrop onMouseDown={onClose}>
      <Modal onMouseDown={e => e.stopPropagation()}>
        <Header>
          <Title>Редактирование промо-секции</Title>
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
              {Object.values(CategoryPromoPlacement).map(p => (
                <option key={p} value={p}>
                  {CategoryPromoPlacementLabels[p]}
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
              {Object.values(CategoryPromoVariant).map(v => (
                <option key={v} value={v}>
                  {CategoryPromoVariantLabels[v]}
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

          <Field>
            <Button type="button" variant="ghost" onClick={() => setShowAdvanced(v => !v)}>
              {showAdvanced ? 'Скрыть все параметры' : 'Показать все параметры'}
            </Button>
          </Field>

          {showAdvanced && (
            <>
              <Field>
                Подзаголовок
                <Input
                  value={subtitle}
                  onChange={e => setSubtitle(e.target.value)}
                  placeholder="Необязательно"
                />
              </Field>

              <Field>
                Текст CTA
                <Input
                  value={ctaText}
                  onChange={e => setCtaText(e.target.value)}
                  placeholder="Кнопка"
                />
              </Field>

              <Field>
                Ссылка CTA
                <Input
                  value={ctaLink}
                  onChange={e => setCtaLink(e.target.value)}
                  placeholder="https://example.com"
                />
              </Field>

              <Field>
                Шрифт
                <Select value={font} onChange={e => setFont(e.target.value as PromoFont)}>
                  <option value="">По умолчанию</option>
                  {Object.values(PromoFont).map(f => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field>
                Цвет заголовка
                <Input
                  type="color"
                  value={titleColor || '#000000'}
                  onChange={e => setTitleColor(e.target.value)}
                />
              </Field>

              <Field>
                Цвет текста
                <Input
                  type="color"
                  value={textColor || '#000000'}
                  onChange={e => setTextColor(e.target.value)}
                />
              </Field>

              <Field>
                Цвет фона CTA
                <Input
                  type="color"
                  value={ctaBg || '#000000'}
                  onChange={e => setCtaBg(e.target.value)}
                />
              </Field>

              <Field>
                Цвет текста CTA
                <Input
                  type="color"
                  value={ctaColor || '#ffffff'}
                  onChange={e => setCtaColor(e.target.value)}
                />
              </Field>

              <Field>
                Цвет фона секции
                <Input
                  type="color"
                  value={bgColor || '#ffffff'}
                  onChange={e => setBgColor(e.target.value)}
                />
              </Field>

              <Field>
                Высота секции (px)
                <Input
                  type="number"
                  value={heightPx}
                  onChange={e => setHeightPx(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="Например: 500"
                  min={0}
                />
              </Field>

              <Field>
                Положение контента
                <Select
                  value={contentSide}
                  onChange={e => setContentSide(e.target.value as ContentSideEnum)}
                >
                  <option value="">По умолчанию</option>
                  <option value={ContentSideEnum.LEFT}>Слева</option>
                  <option value={ContentSideEnum.CENTER}>По центру</option>
                  <option value={ContentSideEnum.RIGHT}>Справа</option>
                </Select>
              </Field>

              <Field>
                Активность
                <div>
                  <input
                    id="cps-active"
                    type="checkbox"
                    checked={isActive}
                    onChange={e => setIsActive(e.target.checked)}
                  />
                  <label htmlFor="cps-active" style={{ marginLeft: 8 }}>
                    Активно
                  </label>
                </div>
              </Field>

              <Field>
                Порядок отображения
                <Input
                  type="number"
                  value={order}
                  onChange={e => setOrder(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="Необязательно"
                />
              </Field>

              <Field>
                Дата начала
                <Input
                  type="datetime-local"
                  value={startsAt}
                  onChange={e => setStartsAt(e.target.value)}
                />
              </Field>

              <Field>
                Дата окончания
                <Input
                  type="datetime-local"
                  value={endsAt}
                  onChange={e => setEndsAt(e.target.value)}
                />
              </Field>
            </>
          )}

          <Footer>
            <Button type="button" variant="ghost" onClick={onClose}>
              Отмена
            </Button>
            <Button type="submit" disabled={!canSubmit || submitting}>
              {submitting ? 'Сохраняем…' : 'Сохранить'}
            </Button>
          </Footer>
        </Body>
      </Modal>
    </Backdrop>
  );
}
