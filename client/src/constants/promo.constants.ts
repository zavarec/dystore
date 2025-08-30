import {
  CategoryPromoVariant,
  CategoryPromoPlacement,
} from '@/types/models/category-promo-section.model';

export const CategoryPromoVariantLabels: Record<CategoryPromoVariant, string> = {
  [CategoryPromoVariant.BANNER]: 'Баннер',
  // старый TEXT больше не используется в типах модели
  [CategoryPromoVariant.TEXT_STRIP]: 'Текстовая плашка',
  [CategoryPromoVariant.TEXT_QUOTE]: 'Цитата',
  
  [CategoryPromoVariant.GRID]: 'Сетка (несколько элементов)',
  [CategoryPromoVariant.STRIP_USP]: 'Плашка с преимуществами',
  [CategoryPromoVariant.IMAGE_PAIR]: 'Две картинки (сравнение)',
  [CategoryPromoVariant.HEADLINE_STRIP]: 'Заголовочная плашка',
};

export const CategoryPromoPlacementLabels: Record<CategoryPromoPlacement, string> = {
  [CategoryPromoPlacement.ABOVE_HERO]: 'Над Hero-баннером',
  [CategoryPromoPlacement.BELOW_HERO]: 'Под Hero-баннером',

  [CategoryPromoPlacement.ABOVE_SUBCATEGORIES]: 'Перед подкатегориями',
  [CategoryPromoPlacement.BELOW_SUBCATEGORIES]: 'После подкатегорий',

  [CategoryPromoPlacement.ABOVE_FILTERS]: 'Перед фильтрами',
  [CategoryPromoPlacement.BELOW_FILTERS]: 'После фильтров',

  [CategoryPromoPlacement.ABOVE_PRODUCTS]: 'Перед списком товаров',
  [CategoryPromoPlacement.BETWEEN_PRODUCTS]: 'Между товарами',
  [CategoryPromoPlacement.BELOW_PRODUCTS]: 'После списка товаров',
};
