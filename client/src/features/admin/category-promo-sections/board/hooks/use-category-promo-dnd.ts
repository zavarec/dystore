import { arrayMove } from '@dnd-kit/sortable';
import { useAppDispatch } from '@/hooks/redux';
import {
  moveItemToPlacement,
  setOrderForPlacement,
} from '@/store/slices/category-promo-sections/category-promo-sections.slice';
import { CategoryPromoPlacement } from '@/types/models/category-promo-section.model';

export function useCategoryPromoDnd() {
  const dispatch = useAppDispatch();

  const handleCardDragEnd = (placement: CategoryPromoPlacement, ids: number[], event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return ids;
    const oldIndex = ids.indexOf(active.id);
    const newIndex = ids.indexOf(over.id);
    if (oldIndex === -1 || newIndex === -1) return ids;
    const newOrder = arrayMove(ids, oldIndex, newIndex);
    dispatch(setOrderForPlacement({ placement, ids: newOrder }));
    return newOrder;
  };

  const handleMoveBetweenPlacements = (
    id: number,
    from: CategoryPromoPlacement,
    to: CategoryPromoPlacement,
    index?: number,
  ) => {
    if (typeof index === 'number') {
      dispatch(moveItemToPlacement({ id, from, to, index }));
    } else {
      dispatch(moveItemToPlacement({ id, from, to }));
    }
  };

  return { handleCardDragEnd, handleMoveBetweenPlacements };
}
