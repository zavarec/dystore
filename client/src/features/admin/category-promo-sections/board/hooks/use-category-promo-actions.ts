import { useAppDispatch } from '@/hooks/redux';
import { setOrderForPlacement } from '@/store/slices/category-promo-sections/category-promo-sections.slice';
import {
  deleteCategoryPromoSection,
  updateCategoryPromoSection,
} from '@/store/slices/category-promo-sections/category-promo-sections.thunks';
import { CategoryPromoPlacement } from '@/types/models/category-promo-section.model';

export function useCategoryPromoActions() {
  const dispatch = useAppDispatch();

  const remove = (id: number) => dispatch(deleteCategoryPromoSection(id));

  const update = (id: number, dto: any) => dispatch(updateCategoryPromoSection({ id, dto }));

  const moveToPlacement = (id: number, placement: CategoryPromoPlacement, order?: number) => {
    const dto: { placement: CategoryPromoPlacement; order?: number } = { placement };
    if (typeof order === 'number') dto.order = order;
    return dispatch(updateCategoryPromoSection({ id, dto }));
  };

  const setPlacementOrder = ({
    placement,
    ids,
  }: {
    placement: CategoryPromoPlacement;
    ids: number[];
  }) => {
    return dispatch(setOrderForPlacement({ placement, ids }));
  };

  return { remove, update, moveToPlacement, setPlacementOrder };
}
