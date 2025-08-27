import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchActivePromosBySlot } from '@/store/slices/promotion-slice/promotion.thunk';
import {
  selectPromotions,
  selectPromotionsLoading,
} from '@/store/slices/promotion-slice/promotions.selectors';
import { PromotionSlot } from '@/types/models/promotion.model';
import { PageSectionDTO } from '@/services/layout.service';

export function usePromotionsListState() {
  const dispatch = useAppDispatch();
  const promotions = useAppSelector(selectPromotions);
  const loading = useAppSelector(selectPromotionsLoading);

  const [sortMode, setSortMode] = useState(false);
  const [order, setOrder] = useState<Record<PromotionSlot, number[]>>({
    HERO: [],
    FEATURED: [],
    PRODUCT_OF_DAY: [],
    CUSTOM: [],
  });
  const [sectionOrder, setSectionOrder] = useState<PromotionSlot[]>([
    PromotionSlot.HERO,
    PromotionSlot.FEATURED,
    PromotionSlot.PRODUCT_OF_DAY,
    PromotionSlot.CUSTOM,
  ]);
  const [pageSections, setPageSections] = useState<PageSectionDTO[]>([]);

  // Загрузка данных промо
  useEffect(() => {
    dispatch(fetchActivePromosBySlot(PromotionSlot.HERO));
    dispatch(fetchActivePromosBySlot(PromotionSlot.FEATURED));
    dispatch(fetchActivePromosBySlot(PromotionSlot.PRODUCT_OF_DAY));
    dispatch(fetchActivePromosBySlot(PromotionSlot.CUSTOM));
  }, [dispatch]);

  // Обновление order когда загружаются данные
  useEffect(() => {
    const newOrder: Record<PromotionSlot, number[]> = {
      HERO: [],
      FEATURED: [],
      PRODUCT_OF_DAY: [],
      CUSTOM: [],
    };

    (Object.keys(promotions) as PromotionSlot[]).forEach(slot => {
      const list = promotions[slot];
      if (list && list.length > 0) {
        newOrder[slot] = list
          .slice()
          .sort((a, b) => (a.position || 0) - (b.position || 0))
          .map(p => p.id);
      }
    });

    setOrder(newOrder);
  }, [promotions]);

  // Функция перезагрузки данных промо
  const reloadPromotions = async () => {
    dispatch(fetchActivePromosBySlot(PromotionSlot.HERO));
    dispatch(fetchActivePromosBySlot(PromotionSlot.FEATURED));
    dispatch(fetchActivePromosBySlot(PromotionSlot.PRODUCT_OF_DAY));
    dispatch(fetchActivePromosBySlot(PromotionSlot.CUSTOM));
  };

  return {
    // Данные
    promotions,
    loading,

    // Состояние
    sortMode,
    setSortMode,
    order,
    setOrder,
    sectionOrder,
    setSectionOrder,
    pageSections,
    setPageSections,

    // Действия
    reloadPromotions,
  };
}
