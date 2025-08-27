// src/features/promotions/FeaturedPromos.tsx
'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { fetchActivePromosBySlot } from '@/store/slices/promotion-slice/promotion.thunk';
import { selectPromotionsBySlot } from '@/store/slices/promotion-slice/promotions.selectors';
import { PromotionSlot } from '@/types/models/promotion.model';
import { PromoCard } from './promo-card/promo-card';

export default function FeaturedPromos() {
  const dispatch = useAppDispatch();
  const selectFeatured = selectPromotionsBySlot(PromotionSlot.FEATURED);
  const promos = useAppSelector(selectFeatured);

  useEffect(() => {
    if (!promos.length) {
      dispatch(fetchActivePromosBySlot(PromotionSlot.FEATURED));
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
