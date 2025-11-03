import { useEffect, useMemo, useState } from 'react';

import {
  DndContext,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  closestCorners,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { useDispatch, useSelector } from 'react-redux';
import ReactSelect from 'react-select';

import { promoSlotLabelsMap } from '@/constants/promo.constants';
import {
  Wrapper,
  HeaderRow,
  Title,
  SlotSection,
  SlotHeader,
  SlotBadge,
  Count,
  CategoryPromoGrid as Grid,
  Empty,
} from '@/features/admin/promotions/promotions-list/promotions-list.style';
import { CategoriesService } from '@/services/categories.service';
import { ProductsService } from '@/services/products.service';
import type { RootState } from '@/store';
import { selectPromoPlacements } from '@/store/slices/promo/promo.selectors';
import { applyLocalReorder } from '@/store/slices/promo/promo.slice';
import {
  deletePlacement,
  listPlacements,
  listPromoSections,
  reorderPlacements,
  updatePlacement,
} from '@/store/slices/promo/promo.thunks';
import type { PromoPlacement } from '@/types/models/promo-placement.model';
import type { PromoSection } from '@/types/models/promo-section.model';
import { PromoSlot } from '@/types/models/promo-section.model';
import { PromoEntityType, PromoPageType } from '@/types/models/promo-placement.model';

import { Button } from './promo-placements-board.style';
import { AttachSectionModal } from './ui/atach-section-modal';
import { CreatePlacementModal } from './ui/CreatePlacementModal';
import { EditPlacementModal } from './ui/EditPlacementModal';
import { PlacementCardPreview } from './ui/placement-card-preview';
import { SortablePlacementCard } from './ui/SortablePlacementCard';
import { PromoSectionEditModal } from '../promo-sections/ui/promo-section-edit-modal';

// import { Select } from '../promo-sections/ui/promo-sections-modals.style';

export function PromoPlacementsBoard() {
  const dispatch = useDispatch<any>();

  const [activeId, setActiveId] = useState<number | null>(null);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editing, setEditing] = useState<PromoPlacement | null>(null);
  const [editingSection, setEditingSection] = useState<PromoSection | null>(null);

  const [attachOpen, setAttachOpen] = useState(false);
  const [attachToSlot, setAttachToSlot] = useState<PromoSlot | null>(null);

  const [pendingLocal, setPendingLocal] = useState(false);

  const byId = useSelector((state: RootState) => state.sectionsWithPlacementsSlice.byPlacementId);
  const byPage = useSelector(
    (state: RootState) => state.sectionsWithPlacementsSlice.byPlacementPage,
  );
  const isLoading = useSelector(
    (state: RootState) => state.sectionsWithPlacementsSlice.placementsLoading,
  );
  const sectionsById = useSelector(
    (state: RootState) => state.sectionsWithPlacementsSlice.bySectionId,
  );

  const [params, setParams] = useState<{ pageType?: PromoPageType; entityId?: string }>({});
  const key =
    params.pageType && params.entityId ? `${params.pageType}:${params.entityId}` : undefined;
  const ids = (key && byPage[key]) || [];
  const items: PromoPlacement[] = ids.map((id: number) => byId[id]).filter(Boolean);

  const activeItem = useMemo(
    () => (activeId != null ? (items.find(i => i.id === activeId) ?? null) : null),
    [activeId, items],
  );

  const placements = useMemo(() => Object.values(PromoSlot) as PromoSlot[], []);
  useSelector(selectPromoPlacements); // подписка (если нужно)

  const byPlacement = useMemo(() => {
    const map: Record<string, PromoPlacement[]> = {};
    for (const p of placements) map[p] = [];
    for (const it of items) (map[it.slot] || (map[it.slot] = [])).push(it);
    for (const p of placements) map[p] = (map[p] || []).slice().sort((a, b) => a.order - b.order);
    return map as Record<PromoSlot, PromoPlacement[]>;
  }, [items, placements]);

  const pageTypeOptions = useMemo(
    () => Object.values(PromoPageType).map(pt => ({ value: pt, label: pt })),
    [],
  );
  const [entityOptions, setEntityOptions] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    (async () => {
      try {
        if (!params.pageType) {
          setEntityOptions([]);
          return;
        }
        if (params.pageType === PromoPageType.PRODUCT) {
          const items = await ProductsService.getAllProducts();
          setEntityOptions(
            (items || [])
              .slice(0, 200)
              .map(p => ({ value: String(p.id), label: `${p.name} (#${p.id})` })),
          );
        } else if (params.pageType === PromoPageType.CATEGORY) {
          const items = await CategoriesService.getAllCategories();
          setEntityOptions(
            (items || []).map(c => ({ value: String(c.id), label: `${c.name} (#${c.id})` })),
          );
        } else {
          setEntityOptions([]);
        }
      } catch (e) {
        setEntityOptions([]);
      }
    })();
  }, [params.pageType]);

  useEffect(() => {
    if (params.pageType && params.entityId) {
      dispatch(listPlacements({ pageType: params.pageType, entityId: params.entityId } as any));
    }
  }, [dispatch, params.pageType, params.entityId]);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 120, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragStart = (event: any) => {
    setActiveId(event.active?.id ?? null);
  };
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    setActiveId(null); // <= обязательно сбрасываем

    if (!over || active.id === over.id) return;
    const findSlotById = (id: number): PromoSlot | null => {
      for (const s of placements) if ((byPlacement[s] || []).some(i => i.id === id)) return s;
      return null;
    };
    const fromSlot = findSlotById(active.id as number);
    const toSlot = findSlotById(over.id as number);
    if (!fromSlot || !toSlot || fromSlot !== toSlot || !key) return;

    const idsBefore: number[] = (byPlacement[fromSlot] || []).map(i => Number(i.id));
    const fromIndex = idsBefore.indexOf(active.id as number);
    const toIndex = idsBefore.indexOf(over.id as number);
    if (fromIndex === -1 || toIndex === -1) return;

    const newIdsInSlot: number[] = idsBefore.slice();
    const moved = newIdsInSlot[fromIndex];
    newIdsInSlot.splice(fromIndex, 1);
    newIdsInSlot.splice(toIndex, 0, moved as number);

    const merged: number[] = placements.flatMap(s =>
      s === fromSlot ? newIdsInSlot : (byPlacement[s] || []).map(i => i.id),
    );
    dispatch(applyLocalReorder({ key, idsOrdered: merged }));
    setPendingLocal(true);
  };

  const saveOrder = async () => {
    if (!key) return;
    const pageItems = (byPage[key] || [])
      .map((id: number) => byId[id])
      .filter(Boolean) as PromoPlacement[];
    const payload = pageItems
      .slice()
      .sort((a, b) => a.order - b.order)
      .map(p => ({ id: p.id, order: p.order }));
    await dispatch(reorderPlacements({ key, items: payload }));
    setPendingLocal(false);
  };

  const openSectionEditor = async (item: PromoPlacement) => {
    const id = (item as any).promoSectionId ?? item.promoSection?.id;
    if (!id) return;

    const existing = sectionsById?.[id];
    if (existing) {
      setEditingSection(existing);
      return;
    }

    const action = await dispatch(listPromoSections());
    const payload = action?.payload ?? action;
    const list: PromoSection[] | undefined = Array.isArray(payload)
      ? payload
      : payload?.allSections;
    const found = list?.find(section => section.id === id);
    if (found) {
      setEditingSection(found);
    }
  };

  const handleEditSection = (item: PromoPlacement) => {
    void openSectionEditor(item);
  };

  const handleSectionModalClose = () => {
    setEditingSection(null);
    if (params.pageType && params.entityId) {
      void dispatch(
        listPlacements({ pageType: params.pageType, entityId: params.entityId } as any),
      );
    }
  };

  const onDetachPlacement = async (item: PromoPlacement) => {
    await dispatch(deletePlacement(item.id));
  };

  return (
    <Wrapper>
      <HeaderRow>
        <Title>Привязки</Title>

        <div>{isLoading && 'Загрузка…'}</div>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <div style={{ minWidth: 200 }}>
            <ReactSelect
              placeholder="Страница…"
              options={pageTypeOptions}
              value={
                params.pageType
                  ? pageTypeOptions.find(o => o.value === params.pageType) || null
                  : null
              }
              onChange={(opt: any) =>
                setParams(p => ({ ...p, pageType: (opt?.value || undefined) as any }))
              }
              isClearable
            />
          </div>
          <div style={{ minWidth: 260 }}>
            <ReactSelect
              placeholder="entityId"
              options={entityOptions}
              value={
                params.entityId
                  ? entityOptions.find(o => o.value === params.entityId) || null
                  : null
              }
              onChange={(opt: any) =>
                setParams(p => ({ ...p, entityId: (opt?.value || undefined) as any }))
              }
              isClearable
              isDisabled={!params.pageType}
            />
          </div>
          <Button
            onClick={() =>
              key &&
              dispatch(
                listPlacements({ pageType: params.pageType!, entityId: params.entityId! } as any),
              )
            }
          >
            Обновить
          </Button>
          <Button disabled={!pendingLocal} onClick={saveOrder}>
            Сохранить порядок
          </Button>

          <Button
            disabled={!params.pageType || !params.entityId}
            onClick={() => setIsCreateOpen(true)}
          >
            Добавить
          </Button>
        </div>
      </HeaderRow>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
      >
        <DragOverlay adjustScale={false}>
          {activeItem && <PlacementCardPreview item={activeItem} />}
        </DragOverlay>

        {placements.map(slot => {
          const list = byPlacement[slot] || [];
          const ids = list.map(i => i.id);
          return (
            <SlotSection key={slot} $sortMode={true}>
              <SlotHeader>
                <SlotBadge>{promoSlotLabelsMap[slot]}</SlotBadge>
                <Count>{list.length}</Count>
                <div style={{ marginLeft: 'auto' }}>
                  <Button
                    disabled={!params.pageType || !params.entityId}
                    onClick={() => {
                      setAttachToSlot(slot);
                      setAttachOpen(true);
                    }}
                  >
                    Привязать секцию
                  </Button>
                </div>
              </SlotHeader>
              {list.length === 0 ? (
                <Empty>Пусто</Empty>
              ) : (
                <SortableContext items={ids} strategy={rectSortingStrategy}>
                  <Grid>
                    {list.map(item => (
                      <SortablePlacementCard
                        key={item.id}
                        id={item.id}
                        item={item}
                        sortMode
                        onEdit={() => setEditing(item)}
                        onEditSection={() => handleEditSection(item)}
                        onDelete={() => onDetachPlacement(item)}
                        onChangeSlot={(s: PromoSlot) => {
                          dispatch(updatePlacement({ id: item.id, dto: { slot: s } }));
                        }}
                        onToggleActive={(v: boolean) => {
                          dispatch(updatePlacement({ id: item.id, dto: { isActive: v } }));
                        }}
                      />
                    ))}
                  </Grid>
                </SortableContext>
              )}
            </SlotSection>
          );
        })}
      </DndContext>

      {isCreateOpen && (
        <CreatePlacementModal
          initialPageType={params.pageType ?? PromoPageType.PRODUCT}
          initialEntityId={params.entityId ?? PromoEntityType.CATEGORY_PROMO_SECTION}
          onClose={() => setIsCreateOpen(false)}
        />
      )}

      {editing && <EditPlacementModal item={editing} onClose={() => setEditing(null)} />}

      {attachOpen && attachToSlot && params.pageType && params.entityId && (
        <AttachSectionModal
          pageType={params.pageType}
          entityId={params.entityId}
          slot={attachToSlot}
          onClose={() => {
            setAttachOpen(false);
            setAttachToSlot(null);
          }}
        />
      )}

      {editingSection && (
        <PromoSectionEditModal item={editingSection} onClose={handleSectionModalClose} />
      )}
    </Wrapper>
  );
}
