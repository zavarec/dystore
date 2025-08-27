'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { fetchActivePromosBySlot } from '@/store/slices/promotion-slice/promotion.thunk';
import { selectProductOfDay } from '@/store/slices/promotion-slice/promotions.selectors';
import { PromotionSlot } from '@/types/models/promotion.model';
import { PromoCard } from './promo-card/promo-card';

export default function ProductOfDay() {
  const dispatch = useAppDispatch();
  const promo = useAppSelector(selectProductOfDay);

  useEffect(() => {
    if (!promo) {
      dispatch(fetchActivePromosBySlot(PromotionSlot.PRODUCT_OF_DAY));
    }
  }, [dispatch]);

  if (!promo) return null;

  return <PromoCard promo={promo} label="Товар дня" />;
}
