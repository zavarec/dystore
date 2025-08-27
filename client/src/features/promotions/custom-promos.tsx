'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { fetchActivePromosBySlot } from '@/store/slices/promotion-slice/promotion.thunk';
import { selectPromotionsBySlot } from '@/store/slices/promotion-slice/promotions.selectors';
import { PromotionSlot } from '@/types/models/promotion.model';
import { PromoCard } from './promo-card/promo-card';

export default function CustomPromos() {
  const dispatch = useAppDispatch();
  const selectCustom = selectPromotionsBySlot(PromotionSlot.CUSTOM);
  const promos = useAppSelector(selectCustom);

  useEffect(() => {
    if (!promos.length) {
      dispatch(fetchActivePromosBySlot(PromotionSlot.CUSTOM));
    }
  }, [dispatch]);

  if (!promos.length) return null;

  return (
    <>
      {promos.map(p => (
        <PromoCard key={p.id} promo={p} label="Спецпредложение" />
      ))}
    </>
  );
}
