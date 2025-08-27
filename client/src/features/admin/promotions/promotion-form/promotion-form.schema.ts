import { PromotionSlot, PromoFont } from '@/types/models/promotion.model';
import { boolean, date, number, object, ref } from 'yup';
import { string } from 'yup';
import type {} from 'yup';

export interface UpdatePromotionFormSchema {
  slot: PromotionSlot;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
}

export const promotionSchema = object({
  slot: string()
    .oneOf([
      PromotionSlot.HERO,
      PromotionSlot.PRODUCT_OF_DAY,
      PromotionSlot.FEATURED,
      PromotionSlot.CUSTOM,
    ])
    .required(),
  title: string().optional(),
  subtitle: string().optional(),
  ctaText: string().optional(),
  ctaLink: string().optional(),
  productId: number()
    .transform((value, originalValue) =>
      originalValue === '' || Number.isNaN(value) ? null : value,
    )
    .nullable()
    .optional(),
  bgImageUrl: string()
    .transform(value => (value === '' ? null : value))
    .url('Некорректная ссылка')
    .nullable()
    .optional(),
  bgVideoUrl: string()
    .transform(value => (value === '' ? null : value))
    .url('Некорректная ссылка')
    .nullable()
    .optional(),
  startAt: date().required('Дата начала обязательна'),
  endAt: date()
    .required('Дата окончания обязательна')
    .min(ref('startAt'), 'Дата окончания должна быть позже начала'),
  isPublished: boolean().default(false),
  position: number().min(0).default(0),

  // Стили
  font: string()
    .transform(value => (value === '' ? null : value))
    .oneOf([PromoFont.INTER, PromoFont.ROBOTO, PromoFont.MONTSERRAT, PromoFont.POPPINS])
    .nullable()
    .optional(),
  titleColor: string()
    .transform(value => (value === '' ? null : value))
    .matches(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, 'HEX цвет, например #fff или #112233')
    .nullable()
    .optional(),
  textColor: string()
    .transform(value => (value === '' ? null : value))
    .matches(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, 'HEX цвет, например #fff или #112233')
    .nullable()
    .optional(),
  ctaBg: string()
    .transform(value => (value === '' ? null : value))
    .matches(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, 'HEX цвет, например #fff или #112233')
    .nullable()
    .optional(),
  ctaColor: string()
    .transform(value => (value === '' ? null : value))
    .matches(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, 'HEX цвет, например #fff или #112233')
    .nullable()
    .optional(),
});
