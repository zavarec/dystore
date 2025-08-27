import { arrayMove } from '@dnd-kit/sortable';
import { PromotionSlot } from '@/types/models/promotion.model';
import { PageSectionDTO } from '@/services/layout.service';
import { Dispatch, SetStateAction } from 'react';

interface UsePromotionsDragDropProps {
  order: Record<PromotionSlot, number[]>;
  setOrder: Dispatch<SetStateAction<Record<PromotionSlot, number[]>>>;
  sectionOrder: PromotionSlot[];
  setSectionOrder: Dispatch<SetStateAction<PromotionSlot[]>>;
  pageSections: PageSectionDTO[];
  syncSectionOrder: (sectionOrder: PromotionSlot[]) => Promise<PageSectionDTO[] | null>;
  SLOT_TO_SECTION_KEY: Partial<Record<PromotionSlot, PageSectionDTO['key']>>;
}

export function usePromotionsDragDrop({
  order,
  setOrder,
  sectionOrder,
  setSectionOrder,
  syncSectionOrder,
}: UsePromotionsDragDropProps) {
  // Обработчик перетаскивания карточек внутри секции
  const handleCardDragEnd = (currentSlot: PromotionSlot, event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setOrder(prev => {
      const current = prev[currentSlot] && prev[currentSlot].length > 0 ? prev[currentSlot] : [];
      const oldIndex = current.indexOf(active.id);
      const newIndex = current.indexOf(over.id);

      if (oldIndex === -1 || newIndex === -1) return prev;

      const newOrder = arrayMove(current, oldIndex, newIndex);
      return { ...prev, [currentSlot]: newOrder };
    });
  };

  // Обработчик перетаскивания секций
  const handleSectionDragEnd = async (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    // Проверяем, перетаскивается ли секция
    if (Object.values(PromotionSlot).includes(active.id as PromotionSlot)) {
      const oldIndex = sectionOrder.indexOf(active.id as PromotionSlot);
      const newIndex = sectionOrder.indexOf(over.id as PromotionSlot);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = arrayMove(sectionOrder, oldIndex, newIndex);
        setSectionOrder(newOrder);

        // Синхронизируем с PageSection
        try {
          await syncSectionOrder(newOrder);
        } catch (error) {
          console.error('Ошибка синхронизации порядка секций:', error);
          // В случае ошибки возвращаем старый порядок
          setSectionOrder(sectionOrder);
        }
      }
    }
  };

  // Получение порядка карточек для секции
  const getCardOrderForSlot = (slot: PromotionSlot, promotions: any[]) => {
    const list = promotions || [];
    return order[slot] && order[slot].length > 0
      ? order[slot]
      : list
          .slice()
          .sort((a: any, b: any) => (a.position || 0) - (b.position || 0))
          .map((p: any) => p.id);
  };

  return {
    handleCardDragEnd,
    handleSectionDragEnd,
    getCardOrderForSlot,
  };
}
