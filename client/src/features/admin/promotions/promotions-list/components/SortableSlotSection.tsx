import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PromotionSlot, Promotion } from '@/types/models/promotion.model';
import { SLOT_LABEL } from '../constants';
import { Grid, Count, SlotBadge, SlotSection, Empty, SlotHeader } from '../promotions-list.style';
import { SortablePromoCard } from '@/features/admin/promotions/promotions-list/components/SortablePromoCard';

interface SortableSlotSectionProps {
  slot: PromotionSlot;
  promotions: Promotion[];
  order: number[];
  sortMode: boolean;
  onCardDragEnd: (slot: PromotionSlot, event: any) => void;
  onDeletePromo: (id: number) => void;
  onEditPromo: (promo: Promotion) => void;
}

export function SortableSlotSection({
  slot,
  promotions: list,
  order,
  sortMode,
  onCardDragEnd,
  onDeletePromo,
  onEditPromo,
}: SortableSlotSectionProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: slot,
    disabled: !sortMode || slot === PromotionSlot.HERO, // HERO не может быть перетащен
  });

  const style: React.CSSProperties = sortMode
    ? {
        transform: CSS.Transform.toString(transform),
        transition,
      }
    : {};

  return (
    <div ref={setNodeRef} style={style}>
      <SlotSection
        $sortMode={sortMode}
        $isHero={slot === PromotionSlot.HERO}
        {...(sortMode && slot !== PromotionSlot.HERO ? { ...attributes, ...listeners } : {})}
      >
        <SlotHeader>
          <SlotBadge>{SLOT_LABEL[slot]}</SlotBadge>
          <Count>({list.length})</Count>
          {sortMode && slot !== PromotionSlot.HERO && (
            <span style={{ fontSize: '12px', color: '#6b7280' }}>↕ Перетащите секцию</span>
          )}
          {sortMode && slot === PromotionSlot.HERO && (
            <span style={{ fontSize: '12px', color: '#9ca3af' }}>🔒 Не перетаскивается</span>
          )}
        </SlotHeader>

        {list.length === 0 ? (
          <Empty>Нет промо в этом слоте</Empty>
        ) : (
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={event => onCardDragEnd(slot, event)}
          >
            <SortableContext items={order} strategy={verticalListSortingStrategy}>
              <Grid>
                {order.map(id => {
                  const promo = list.find(p => p.id === id);
                  if (!promo) return null;
                  return (
                    <SortablePromoCard
                      key={id}
                      id={id}
                      promo={promo}
                      sortMode={sortMode}
                      onDelete={() => onDeletePromo(promo.id)}
                      onEdit={onEditPromo}
                    />
                  );
                })}
              </Grid>
            </SortableContext>
          </DndContext>
        )}
      </SlotSection>
    </div>
  );
}
