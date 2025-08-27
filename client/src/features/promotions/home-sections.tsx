'use client';

import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { fetchHomeLayoutSections } from '@/store/slices/promotion-slice/promotion.thunk';
import { selectHomeSections } from '@/store/slices/promotion-slice/promotions.selectors';
import ProductOfDay from './product-of-day';
import FeaturedPromos from './featured-promos';
import CustomPromos from './custom-promos';

export default function HomeSections() {
  const dispatch = useAppDispatch();
  const sections = useAppSelector(selectHomeSections);

  useEffect(() => {
    if (!sections.length) {
      dispatch(fetchHomeLayoutSections());
    }
  }, [dispatch]);

  const ordered = useMemo(() => {
    return sections.slice().sort((a, b) => a.position - b.position);
  }, [sections]);

  if (!sections.length) return null;

  return (
    <div>
      {ordered.map(section => {
        switch (section.key) {
          case 'PRODUCT_OF_DAY':
            return <ProductOfDay key={section.id} />;
          case 'FEATURED':
            return <FeaturedPromos key={section.id} />;
          case 'CUSTOM':
            return <CustomPromos key={section.id} />;
          case 'HITS':
            return null; // TODO: подключить реальный блок "Хиты"
          default:
            return null;
        }
      })}
    </div>
  );
}
