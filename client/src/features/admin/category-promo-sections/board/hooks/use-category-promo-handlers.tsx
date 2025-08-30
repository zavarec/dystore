// features/admin/promotions/promotions-list/useCategoryPromoDndHandlers.ts
import { useState } from 'react';
import {
  DndContextProps,
  closestCorners,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  DragCancelEvent,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { arrayMove } from '@dnd-kit/sortable';
import { useAppDispatch } from '@/hooks/redux';
import {
  PlacementMap,
  setOrderForPlacement,
} from '@/store/slices/category-promo-sections/category-promo-sections.slice';
import { CategoryPromoPlacement } from '@/types/models/category-promo-section.model';

type Item = {
  id: number;
  order?: number;
  placement?: CategoryPromoPlacement;
  title?: string | null;
  variant?: string | number;
  category?: { name?: string | null } | null;
  categoryId?: string | number | null;
  isActive?: boolean | null;
};

// type ByPlacement = Record<CategoryPromoPlacement, Item[] | undefined>;

interface Params {
  sortMode: boolean;
  placements: CategoryPromoPlacement[];
  byPlacement: PlacementMap;
  /** вызвать, чтобы сохранить на бэке порядок в колонке */
  savePlacementOrder: (placement: CategoryPromoPlacement, ids: number[]) => Promise<any>;
}

export function useCategoryPromoDndHandlers({
  sortMode,
  placements,
  byPlacement,
  savePlacementOrder,
}: Params) {
  const dispatch = useAppDispatch();

  const [activeId, setActiveId] = useState<number | null>(null);
  const [activeCard, setActiveCard] = useState<Item | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 140, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const collisionDetection: DndContextProps['collisionDetection'] = closestCorners;

  const findPlacementOf = (id: number | string) =>
    placements.find(p => (byPlacement[p] || []).some(i => i.id === Number(id)));

  const onDragStart = (e: DragStartEvent) => {
    if (!sortMode) return;
    const id = Number(e.active.id);
    setActiveId(id);
    const placement = findPlacementOf(id);
    const item = placement ? (byPlacement[placement] || []).find(i => i.id === id) : undefined;
    setActiveCard(item || null);
  };

  /** SWAP-эффект: двигаем локально уже во время перетаскивания */
  const onDragOver = (e: DragOverEvent) => {
    if (!sortMode) return;
    const { active, over } = e;
    if (!over || active.id === over.id) return;

    const fromPlacement = findPlacementOf(active.id);
    const toPlacement = findPlacementOf(over.id);
    if (!fromPlacement || !toPlacement) return;

    // Перенос между колонками игнорим (у вас через select)
    if (fromPlacement !== toPlacement) return;

    const list = byPlacement[fromPlacement] || [];
    const ids = list.map(i => i.id);
    const oldIndex = ids.indexOf(Number(active.id));
    const newIndex = ids.indexOf(Number(over.id));
    if (oldIndex < 0 || newIndex < 0 || oldIndex === newIndex) return;

    const newOrder = arrayMove(ids, oldIndex, newIndex);
    // оптимистично обновляем order у сущностей
    dispatch(setOrderForPlacement({ placement: fromPlacement, ids: newOrder }));
  };

  const onDragEnd = async (e: DragEndEvent) => {
    if (!sortMode) {
      setActiveId(null);
      setActiveCard(null);
      return;
    }
    const { active, over } = e;
    setActiveId(null);
    setActiveCard(null);

    if (!over || active.id === over.id) return;

    const fromPlacement = findPlacementOf(active.id);
    const toPlacement = findPlacementOf(over.id);
    if (!fromPlacement || !toPlacement) return;
    if (fromPlacement !== toPlacement) return;

    // берём актуальные ids (уже после onDragOver)
    const idsNow = (byPlacement[fromPlacement] || []).map(i => i.id);
    // сохраняем на бэке
    await savePlacementOrder(fromPlacement, idsNow);
  };

  const onDragCancel = (_e: DragCancelEvent) => {
    setActiveId(null);
    setActiveCard(null);
  };

  return {
    sensors,
    collisionDetection,
    activeId,
    activeCard,
    onDragStart,
    onDragOver,
    onDragEnd,
    onDragCancel,
  };
}
