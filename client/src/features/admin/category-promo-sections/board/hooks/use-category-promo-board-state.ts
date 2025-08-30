import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
  fetchAllCategoryPromoSections,
  updateCategoryPromoSection,
} from '@/store/slices/category-promo-sections/category-promo-sections.thunks';
import {
  selectCategoryPromoSectionsByPlacement,
  selectCategoryPromoSectionsLoading,
} from '@/store/slices/category-promo-sections/category-promo-sections.selectors';
import { CategoryPromoPlacement } from '@/types/models/category-promo-section.model';

export function useCategoryPromoBoardState() {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectCategoryPromoSectionsLoading);
  const byPlacement = useAppSelector(selectCategoryPromoSectionsByPlacement);

  const [sortMode, setSortMode] = useState(false);

  // загрузка
  useEffect(() => {
    dispatch(fetchAllCategoryPromoSections());
  }, [dispatch]);

  const placements: CategoryPromoPlacement[] = useMemo(
    () => [
      CategoryPromoPlacement.ABOVE_HERO,
      CategoryPromoPlacement.BELOW_HERO,
      CategoryPromoPlacement.ABOVE_SUBCATEGORIES,
      CategoryPromoPlacement.BELOW_SUBCATEGORIES,
      CategoryPromoPlacement.ABOVE_FILTERS,
      CategoryPromoPlacement.BELOW_FILTERS,
      CategoryPromoPlacement.ABOVE_PRODUCTS,
      CategoryPromoPlacement.BETWEEN_PRODUCTS,
      CategoryPromoPlacement.BELOW_PRODUCTS,
    ],
    [],
  );

  const savePlacementOrder = async (placement: CategoryPromoPlacement, ids: number[]) => {
    const updates = ids.map(
      (id, idx) =>
        dispatch(updateCategoryPromoSection({ id, dto: { placement, order: idx + 1 } })) as any,
    );
    await Promise.all(updates);
  };

  return {
    loading,
    byPlacement,
    sortMode,
    setSortMode,
    placements,
    savePlacementOrder,
    reloadAll: () => dispatch(fetchAllCategoryPromoSections() as any),
  };
}
