import { PromoSlot, PromoVariant } from '@/types/models/promo-section.model';

export const promoVariantLabelsMap: Record<PromoVariant, string> = {
  [PromoVariant.BANNER]: 'Баннер',
  // старый TEXT больше не используется в типах модели
  [PromoVariant.TEXT_STRIP]: 'Текстовая плашка',
  [PromoVariant.TEXT_QUOTE]: 'Цитата',

  [PromoVariant.GRID]: 'Сетка (несколько элементов)',
  [PromoVariant.STRIP_USP]: 'Плашка с преимуществами',
  [PromoVariant.IMAGE_PAIR]: 'Две картинки (сравнение)',
  [PromoVariant.HEADLINE_STRIP]: 'Заголовочная плашка',
  [PromoVariant.CAROUSEL]: 'Карусель',
};

export const promoSlotLabelsMap: Record<PromoSlot, string> = {
  [PromoSlot.ABOVE_HERO]: 'Над Hero-баннером',
  [PromoSlot.BELOW_HERO]: 'Под Hero-баннером',

  [PromoSlot.ABOVE_SUBCATEGORIES]: 'Перед подкатегориями',
  [PromoSlot.BELOW_SUBCATEGORIES]: 'После подкатегорий',

  [PromoSlot.ABOVE_FILTERS]: 'Перед фильтрами',
  [PromoSlot.BELOW_FILTERS]: 'После фильтров',

  [PromoSlot.ABOVE_PRODUCTS]: 'Перед списком товаров',
  [PromoSlot.BETWEEN_PRODUCTS]: 'Между товарами',
  [PromoSlot.BELOW_PRODUCTS]: 'После списка товаров',

  [PromoSlot.PDP_FEATURES]: 'На странице товара (особенности)',
  [PromoSlot.PDP_BELOW_GALLERY]: 'На странице товара (ниже галереи)',
  [PromoSlot.PDP_BELOW_SPECS]: 'На странице товара (ниже характеристик)',
  [PromoSlot.PDP_BELOW_ACCESSORY]: 'На странице товара (ниже аксессуаров)',
};
