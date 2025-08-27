import { usePromotionsListState } from './hooks/usePromotionsListState';
import { useSectionOrderSync } from './hooks/useSectionOrderSync';
import { usePromotionsDragDrop } from './hooks/usePromotionsDragDrop';
import { usePromotionsActions } from './hooks/usePromotionsActions';
import { PromotionsListHeader } from './components/PromotionsListHeader';
import { PromotionsListContent } from './components/PromotionsListContent';
import { Wrapper, Empty } from './promotions-list.style';
import { useState } from 'react';
import { EditPromotionModal } from '@/features/admin/promotions/promotion-form/edit-promotion-modal';

export function PromotionsList() {
  // Состояние и данные
  const {
    promotions,
    loading,
    sortMode,
    setSortMode,
    order,
    setOrder,
    sectionOrder,
    setSectionOrder,
    pageSections,
    setPageSections,
    reloadPromotions,
  } = usePromotionsListState();

  // Синхронизация с PageSection
  const { SLOT_TO_SECTION_KEY, syncSectionOrder, refreshSections } = useSectionOrderSync({
    pageSections,
    setPageSections,
    setSectionOrder,
  });

  // Drag & Drop логика
  const { handleCardDragEnd, handleSectionDragEnd, getCardOrderForSlot } = usePromotionsDragDrop({
    order,
    setOrder,
    sectionOrder,
    setSectionOrder,
    pageSections,
    syncSectionOrder,
    SLOT_TO_SECTION_KEY,
  });

  // Действия с промо
  const { handleDeletePromotion, handleUpdatePromotion, handleSaveOrder } = usePromotionsActions();

  const [editingPromo, setEditingPromo] = useState<any | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const openEdit = (promo: any) => {
    setEditingPromo(promo);
    setIsEditOpen(true);
  };
  const closeEdit = () => {
    setIsEditOpen(false);
    setEditingPromo(null);
  };

  // Состояние загрузки
  if (loading) {
    return (
      <Wrapper>
        <h2>Промо</h2>
        <Empty>Загрузка…</Empty>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <PromotionsListHeader
        promotions={promotions}
        sortMode={sortMode}
        setSortMode={setSortMode}
        sectionOrder={sectionOrder}
        order={order}
        reloadPromotions={reloadPromotions}
        refreshSections={refreshSections}
        syncSectionOrder={syncSectionOrder}
        onSaveOrder={async () => {
          await handleSaveOrder(order);
          await syncSectionOrder(sectionOrder);
          await reloadPromotions();
          await refreshSections();
          setSortMode(false);
        }}
      />

      <PromotionsListContent
        promotions={promotions}
        sectionOrder={sectionOrder}
        sortMode={sortMode}
        getCardOrderForSlot={getCardOrderForSlot}
        handleSectionDragEnd={handleSectionDragEnd}
        handleCardDragEnd={handleCardDragEnd}
        onDeletePromo={handleDeletePromotion}
        onEditPromo={openEdit}
      />

      {isEditOpen && editingPromo && (
        <EditPromotionModal
          promo={editingPromo}
          onClose={closeEdit}
          onSubmit={async (dto: any) => {
            await handleUpdatePromotion(editingPromo.id, dto);
            closeEdit();
            await reloadPromotions();
          }}
        />
      )}
    </Wrapper>
  );
}
