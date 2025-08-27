'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { promotionSchema } from './promotion-form.schema';
import { Modal } from '@/components/atoms/modal/modal';
import { Form, Error } from './promotion-form.style';
import { Promotion, PromotionSlot, PromoFont } from '@/types/models/promotion.model';

type FormValues = any;

interface EditPromotionModalProps {
  promo: Promotion;
  onClose: () => void;
  onSubmit: (dto: Partial<Promotion>) => Promise<any> | void;
}

export const EditPromotionModal: React.FC<EditPromotionModalProps> = ({
  promo,
  onClose,
  onSubmit,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: yupResolver(promotionSchema),
    defaultValues: {
      slot: promo.slot ?? PromotionSlot.HERO,
      title: promo.title ?? '',
      subtitle: promo.subtitle ?? '',
      ctaText: promo.ctaText ?? '',
      ctaLink: promo.ctaLink ?? '',
      productId: promo.product?.id ?? undefined,
      bgImageUrl: promo.bgImageUrl ?? '',
      bgVideoUrl: promo.bgVideoUrl ?? '',
      startAt: promo.startAt ? promo.startAt.slice(0, 16) : '',
      endAt: promo.endAt ? promo.endAt.slice(0, 16) : '',
      isPublished: !!promo.isPublished,
      position: promo.position ?? 0,
      font: promo.font ?? '',
      titleColor: promo.titleColor ?? '',
      textColor: promo.textColor ?? '',
      ctaBg: promo.ctaBg ?? '',
      ctaColor: promo.ctaColor ?? '',
    },
  });

  const submit = async (data: FormValues) => {
    const payload = { ...data, productId: data.productId ?? undefined } as Partial<Promotion>;
    await onSubmit(payload);
  };

  return (
    <Modal isOpen onClose={onClose}>
      <h3 style={{ marginTop: 0, marginBottom: 12 }}>Редактировать промо</h3>
      <Form onSubmit={handleSubmit(submit)}>
        <label>
          Слот:
          <select {...register('slot')}>
            <option value={PromotionSlot.HERO}>Hero</option>
            <option value={PromotionSlot.PRODUCT_OF_DAY}>Товар дня</option>
            <option value={PromotionSlot.FEATURED}>Featured</option>
            <option value={PromotionSlot.CUSTOM}>Custom</option>
          </select>
          {errors.slot && <Error>{String(errors.slot.message)}</Error>}
        </label>

        <label>
          Заголовок:
          <input {...register('title')} />
          {errors.title && <Error>{String(errors.title.message)}</Error>}
        </label>

        <label>
          Подзаголовок:
          <input {...register('subtitle')} />
          {errors.subtitle && <Error>{String(errors.subtitle.message)}</Error>}
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
            {errors.titleColor && <Error>{String(errors.titleColor.message)}</Error>}
          </label>

          <label>
            Цвет текста:
            <input type="color" {...register('textColor')} />
            {errors.textColor && <Error>{String(errors.textColor.message)}</Error>}
          </label>

          <label>
            Цвет фона CTA:
            <input type="color" {...register('ctaBg')} />
            {errors.ctaBg && <Error>{String(errors.ctaBg.message)}</Error>}
          </label>

          <label>
            Цвет текста CTA:
            <input type="color" {...register('ctaColor')} />
            {errors.ctaColor && <Error>{String(errors.ctaColor.message)}</Error>}
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
          {errors.bgImageUrl && <Error>{String(errors.bgImageUrl.message)}</Error>}
        </label>

        <label>
          Фоновое видео (URL):
          <input {...register('bgVideoUrl')} />
          {errors.bgVideoUrl && <Error>{String(errors.bgVideoUrl.message)}</Error>}
        </label>

        <label>
          Дата начала:
          <input type="datetime-local" {...register('startAt')} />
          {errors.startAt && <Error>{String(errors.startAt.message)}</Error>}
        </label>

        <label>
          Дата окончания:
          <input type="datetime-local" {...register('endAt')} />
          {errors.endAt && <Error>{String(errors.endAt.message)}</Error>}
        </label>

        <label>
          Порядок (position):
          <input type="number" {...register('position')} />
        </label>

        <label>
          Опубликовать:
          <input type="checkbox" {...register('isPublished')} />
        </label>

        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" onClick={onClose} disabled={isSubmitting}>
            Отмена
          </button>
          <button type="submit" disabled={isSubmitting}>
            Сохранить
          </button>
        </div>
      </Form>
    </Modal>
  );
};
