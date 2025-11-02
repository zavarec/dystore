import { useEffect } from 'react';
import { LayoutService, PageSectionDTO } from '@/services/layout.service';
import { PromotionSlot } from '@/types/models/promotion.model';

// Маппинг PromotionSlot к SectionKey (HERO не мапится, так как не в PageSection)
const SLOT_TO_SECTION_KEY: Partial<Record<PromotionSlot, PageSectionDTO['key']>> = {
  PRODUCT_OF_DAY: 'PRODUCT_OF_DAY',
  FEATURED: 'FEATURED',
  CUSTOM: 'CUSTOM',
  // HERO не мапится
};

interface UseSectionOrderSyncProps {
  pageSections: PageSectionDTO[];
  setPageSections: (sections: PageSectionDTO[]) => void;
  setSectionOrder: (order: PromotionSlot[]) => void;
}

export function useSectionOrderSync({
  pageSections,
  setPageSections,
  setSectionOrder,
}: UseSectionOrderSyncProps) {
  // Загрузка порядка секций при монтировании
  useEffect(() => {
    LayoutService.adminList()
      .then(sections => {
        setPageSections(sections);

        // Обновляем sectionOrder на основе порядка секций
        const orderedSections = sections.slice().sort((a, b) => a.position - b.position);

        const newSectionOrder: PromotionSlot[] = [PromotionSlot.HERO]; // HERO всегда первый

        orderedSections.forEach(section => {
          // Находим соответствующий PromotionSlot для SectionKey
          const slot = Object.keys(SLOT_TO_SECTION_KEY).find(
            key => SLOT_TO_SECTION_KEY[key as PromotionSlot] === section.key,
          ) as PromotionSlot;

          if (slot) {
            newSectionOrder.push(slot);
          }
        });

        setSectionOrder(newSectionOrder);
      })
      .catch(console.error);
  }, [setPageSections, setSectionOrder]);

  // Функция для синхронизации порядка секций
  const syncSectionOrder = async (sectionOrder: PromotionSlot[]) => {
    const reorderItems: { id: number; position: number }[] = [];
    let position = 0;

    sectionOrder.forEach(slot => {
      if (slot === PromotionSlot.HERO) return; // HERO не в PageSection

      const sectionKey = SLOT_TO_SECTION_KEY[slot];
      if (sectionKey) {
        const pageSection = pageSections.find(s => s.key === sectionKey);
        if (pageSection) {
          reorderItems.push({ id: pageSection.id, position });
          position++;
        }
      }
    });

    if (reorderItems.length > 0) {
      const updatedSections = await LayoutService.reorder(reorderItems);
      setPageSections(updatedSections);
      return updatedSections;
    }

    return null;
  };

  // Функция для обновления секций
  const refreshSections = async () => {
    const sections = await LayoutService.adminList();
    setPageSections(sections);
    return sections;
  };

  return {
    SLOT_TO_SECTION_KEY,
    syncSectionOrder,
    refreshSections,
  };
}
