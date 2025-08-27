import { useAppDispatch } from '@/hooks/redux';
import { deletePromotion, updatePromotion } from '@/store/slices/promotion-slice/promotion.thunk';
import { Promotion, PromotionSlot } from '@/types/models/promotion.model';

export function usePromotionsActions() {
  const dispatch = useAppDispatch();

  const handleDeletePromotion = (id: number) => {
    dispatch(deletePromotion(id));
  };

  const handleUpdatePromotion = (id: number, dto: Partial<Promotion>) => {
    return dispatch(updatePromotion({ id, dto }));
  };

  const handleSaveOrder = async (order: Record<PromotionSlot, number[]>) => {
    // для каждого слота отправляем позицию карточек согласно массиву id
    const updates: Array<Promise<any>> = [];
    (Object.keys(order) as PromotionSlot[]).forEach(slot => {
      const ids = order[slot];
      if (!ids || ids.length === 0) return;
      ids.forEach((id, index) => {
        updates.push(dispatch(updatePromotion({ id, dto: { position: index + 1 } })) as any);
      });
    });
    await Promise.all(updates);
  };

  return {
    handleDeletePromotion,
    handleUpdatePromotion,
    handleSaveOrder,
  };
}
