import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { PromotionSlot } from '@/types/models/promotion.model';
import { SortableSlotSection } from './SortableSlotSection';

interface PromotionsListContentProps {
  promotions: Record<PromotionSlot, any[]>;
  sectionOrder: PromotionSlot[];
  sortMode: boolean;
  getCardOrderForSlot: (slot: PromotionSlot, promotions: any[]) => number[];
  handleSectionDragEnd: (event: any) => Promise<void>;
  handleCardDragEnd: (slot: PromotionSlot, event: any) => void;
  onDeletePromo: (id: number) => void;
  onEditPromo: (promo: any) => void;
}

export function PromotionsListContent({
  promotions,
  sectionOrder,
  sortMode,
  getCardOrderForSlot,
  handleSectionDragEnd,
  handleCardDragEnd,
  onDeletePromo,
  onEditPromo,
}: PromotionsListContentProps) {
  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleSectionDragEnd}>
      <SortableContext items={sectionOrder} strategy={verticalListSortingStrategy}>
        {sectionOrder.map(slot => {
          const list = promotions[slot] || [];
          const order = getCardOrderForSlot(slot, list);

          return (
            <SortableSlotSection
              key={slot}
              slot={slot}
              promotions={list}
              order={order}
              sortMode={sortMode}
              onCardDragEnd={handleCardDragEnd}
              onDeletePromo={onDeletePromo}
              onEditPromo={onEditPromo}
            />
          );
        })}
      </SortableContext>
    </DndContext>
  );
}
