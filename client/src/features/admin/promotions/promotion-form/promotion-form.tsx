'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { useAppDispatch } from '@/hooks/redux';
import { createPromotion } from '@/store/slices/promotion-slice/promotion.thunk';
import { promotionSchema } from './promotion-form.schema';
import { Form, Error } from './promotion-form.style';
import { PromotionSlot, PromoFont } from '@/types/models/promotion.model';

type PromotionFormValues = yup.InferType<typeof promotionSchema>;

export const PromotionForm: React.FC = () => {
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(promotionSchema),
    defaultValues: {
      slot: PromotionSlot.HERO,
      isPublished: false,
      position: 0,
    },
  });

  const onSubmit = async (data: PromotionFormValues) => {
    const payload = { ...data, productId: data.productId ?? undefined } as any;
    await dispatch(createPromotion(payload));
    reset(); // очистить форму после успешного создания
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <label>
        Слот:
        <select {...register('slot')}>
          <option value={PromotionSlot.HERO}>Hero</option>
          <option value={PromotionSlot.PRODUCT_OF_DAY}>Товар дня</option>
          <option value={PromotionSlot.FEATURED}>Featured</option>
          <option value={PromotionSlot.CUSTOM}>Custom</option>
        </select>
        {errors.slot && <Error>{errors.slot.message}</Error>}
      </label>

      <label>
        Заголовок:
        <input {...register('title')} />
        {errors.title && <Error>{errors.title.message}</Error>}
      </label>

      <label>
        Подзаголовок:
        <input {...register('subtitle')} />
        {errors.subtitle && <Error>{errors.subtitle.message}</Error>}
      </label>

      <fieldset style={{ border: '1px solid #eaeaea', padding: 12, marginBottom: 12 }}>
        <legend>Стили</legend>

        <label>
          Шрифт:
          <select {...register('font')}>
            <option value="">(по умолчанию)</option>
            <option value={PromoFont.INTER}>Inter</option>
            <option value={PromoFont.ROBOTO}>Roboto</option>
            <option value={PromoFont.MONTSERRAT}>Montserrat</option>
            <option value={PromoFont.POPPINS}>Poppins</option>
          </select>
        </label>

        <label>
          Цвет заголовка:
          <input type="color" {...register('titleColor')} />
          {errors.titleColor && <Error>{errors.titleColor.message}</Error>}
        </label>

        <label>
          Цвет текста:
          <input type="color" {...register('textColor')} />
          {errors.textColor && <Error>{errors.textColor.message}</Error>}
        </label>

        <label>
          Цвет фона CTA:
          <input type="color" {...register('ctaBg')} />
          {errors.ctaBg && <Error>{errors.ctaBg.message}</Error>}
        </label>

        <label>
          Цвет текста CTA:
          <input type="color" {...register('ctaColor')} />
          {errors.ctaColor && <Error>{errors.ctaColor.message}</Error>}
        </label>
      </fieldset>

      <label>
        CTA текст:
        <input {...register('ctaText')} />
      </label>

      <label>
        CTA ссылка:
        <input {...register('ctaLink')} />
      </label>

      <label>
        ID товара (если нужно связать):
        <input type="number" {...register('productId', { valueAsNumber: true })} />
      </label>

      <label>
        Фоновая картинка (URL):
        <input {...register('bgImageUrl')} />
        {errors.bgImageUrl && <Error>{errors.bgImageUrl.message}</Error>}
      </label>

      <label>
        Фоновое видео (URL):
        <input {...register('bgVideoUrl')} />
        {errors.bgVideoUrl && <Error>{errors.bgVideoUrl.message}</Error>}
      </label>

      <label>
        Дата начала:
        <input type="datetime-local" {...register('startAt')} />
        {errors.startAt && <Error>{errors.startAt.message}</Error>}
      </label>

      <label>
        Дата окончания:
        <input type="datetime-local" {...register('endAt')} />
        {errors.endAt && <Error>{errors.endAt.message}</Error>}
      </label>

      <label>
        Порядок (position):
        <input type="number" {...register('position')} />
      </label>

      <label>
        Опубликовать:
        <input type="checkbox" {...register('isPublished')} />
      </label>

      <button type="submit" disabled={isSubmitting}>
        Сохранить
      </button>
    </Form>
  );
};
