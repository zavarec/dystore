import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  defaultDropAnimation,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import {
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { useCategoryPromoBoardState } from './hooks/use-category-promo-board-state';
import { useCategoryPromoDnd } from './hooks/use-category-promo-dnd';
import {
  Wrapper,
  Empty,
  SlotSection,
  SlotHeader,
  SlotBadge,
  Count,
  CategoryPromoGrid,
} from '@/features/admin/promotions/promotions-list/promotions-list.style';

import { useCategoryPromoActions } from './hooks/use-category-promo-actions';

import { CategoryPromoCreateModal } from '../category-promo-section-create-modal/category-promo-create-modal';
import { CategoryPromoEditModal } from '../category-promo-section-edit-modal/category-promo-edit-modal';
import { CategoryPromoSectionAdmin } from '@/types/models/category-promo-section.model';
import { CategoryPromoBoardHeader } from './сategory-promo-board-header';
import { SortableCpsCard } from './sortable-cps-card';
import { DragPreview } from './drag-preview';

interface Props {}

export function CategoryPromoBoard(_: Props) {
  const { byPlacement, sortMode, setSortMode, placements, reloadAll, savePlacementOrder } =
    useCategoryPromoBoardState();
  const { handleCardDragEnd } = useCategoryPromoDnd();
  const { remove, moveToPlacement } = useCategoryPromoActions();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editing, setEditing] = useState<CategoryPromoSectionAdmin | null>(null);
  // локальный id перетаскиваемой карточки больше не используется напрямую
  // удалён как неиспользуемый, чтобы пройти тип-проверку
  const [activeCard, setActiveCard] = useState<any>(null); // для превью в оверлее

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const onDragStartHandler = (event: any) => {
    if (!sortMode) return;
    const id = event.active.id as number;
    // setActiveId больше не нужен для внешнего UI
    const placement = placements.find(p => (byPlacement[p] || []).some(i => i.id === id));
    const item = placement ? (byPlacement[placement] || []).find(i => i.id === id) : null;
    setActiveCard(item || null);
  };

  const onDragEndHandler = async (event: any) => {
    const { active, over } = event as any;
    if (!over || active.id === over.id) return;

    const fromPlacement = placements.find(p =>
      (byPlacement[p] || []).some(i => i.id === active.id),
    );
    const toPlacement = placements.find(p => (byPlacement[p] || []).some(i => i.id === over.id));
    if (!fromPlacement || !toPlacement) return;
    if (fromPlacement !== toPlacement) return; // перенос между колонками — через select

    const ids = (byPlacement[fromPlacement] || []).map(i => i.id);

    // 1) локально пересортировали ids
    const newOrder = handleCardDragEnd(fromPlacement, ids, event);

    // 2) сохранили на бэке новый порядок
    if (Array.isArray(newOrder) && newOrder.length) {
      await savePlacementOrder(fromPlacement, newOrder);
    }
  };

  return (
    <>
      <Wrapper>
        <CategoryPromoBoardHeader
          sortMode={sortMode}
          setSortMode={setSortMode}
          onRefresh={() => reloadAll()}
          onCreate={() => setIsCreateOpen(true)}
        />

        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={onDragStartHandler}
          onDragEnd={onDragEndHandler}
          onDragCancel={() => {
            setActiveCard(null);
          }}
        >
          {placements.map(placement => {
            const list = byPlacement[placement] || [];
            const ids = list.map(i => i.id);
            return (
              <SlotSection key={placement} $sortMode={sortMode}>
                <SlotHeader>
                  <SlotBadge>{placement}</SlotBadge>

                  <Count>{list.length}</Count>
                </SlotHeader>

                {list.length === 0 ? (
                  <Empty>Пусто</Empty>
                ) : (
                  <SortableContext items={ids} strategy={rectSortingStrategy}>
                    <CategoryPromoGrid>
                      {list.map(item => (
                        <SortableCpsCard
                          key={item.id}
                          id={item.id}
                          sortMode={sortMode}
                          title={item.title || 'Без названия'}
                          order={item.order}
                          variant={String(item.variant)}
                          categoryLabel={item.category?.name ?? item.categoryId}
                          isActive={!!item.isActive}
                          onEdit={() => setEditing(item)}
                          onDelete={() => remove(item.id)}
                          placements={placements}
                          currentPlacement={placement}
                          onChangePlacement={p => moveToPlacement(item.id, p)}
                        />
                      ))}
                    </CategoryPromoGrid>
                  </SortableContext>
                )}
              </SlotSection>
            );
          })}
          <DragOverlay
            dropAnimation={defaultDropAnimation} // плавное «падение»
          >
            {activeCard ? (
              <DragPreview
                title={activeCard.title || 'Без названия'}
                order={activeCard.order}
                variant={String(activeCard.variant)}
                categoryLabel={activeCard.category?.name ?? activeCard.categoryId}
                isActive={!!activeCard.isActive}
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      </Wrapper>
      {isCreateOpen && <CategoryPromoCreateModal onClose={() => setIsCreateOpen(false)} />}
      {editing && <CategoryPromoEditModal item={editing} onClose={() => setEditing(null)} />}
    </>
  );
}
