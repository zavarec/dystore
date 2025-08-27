import { Button } from '@/components/atoms/button';
import { ButtonVariant } from '@/components/atoms/button/button.style';
import { PromotionSlot } from '@/types/models/promotion.model';
import { PageSectionDTO } from '@/services/layout.service';
import { HeaderRow, Title, Sub } from '../promotions-list.style';
import { Dispatch, SetStateAction } from 'react';

interface PromotionsListHeaderProps {
  promotions: Record<PromotionSlot, any[]>;
  sortMode: boolean;
  setSortMode: Dispatch<SetStateAction<boolean>>;
  sectionOrder: PromotionSlot[];
  order: Record<PromotionSlot, number[]>;
  reloadPromotions: () => Promise<void>;
  refreshSections: () => Promise<PageSectionDTO[]>;
  syncSectionOrder: (sectionOrder: PromotionSlot[]) => Promise<PageSectionDTO[] | null>;
  onSaveOrder: () => Promise<void>;
}

export function PromotionsListHeader({
  promotions,
  sortMode,
  setSortMode,
  onSaveOrder,
}: PromotionsListHeaderProps) {
  const totalPromotions = Object.values(promotions).reduce((a, arr) => a + arr.length, 0);

  const handleSaveOrder = async () => {
    try {
      await onSaveOrder();
    } catch (error) {
      console.error('Ошибка при сохранении порядка:', error);
    }
  };

  return (
    <HeaderRow>
      <Title>Промо</Title>
      <Sub>Всего: {totalPromotions}</Sub>

      <Button size="small" variant={ButtonVariant.SECONDARY} onClick={() => setSortMode(v => !v)}>
        {sortMode ? 'Отмена' : 'Изменить порядок'}
      </Button>

      {sortMode && (
        <Button size="small" onClick={handleSaveOrder}>
          Сохранить порядок
        </Button>
      )}
    </HeaderRow>
  );
}
