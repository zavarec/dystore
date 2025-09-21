import React from 'react';
import { SortableCard } from '@/features/admin/promo/promo-sections/promo-sections-board.style';
import { PromoSection } from '@/types/models/promo-section.model';

type Props = {
  item: PromoSection;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
};

export function PromoSectionCard({ item, onEdit, onDelete, onDuplicate }: Props) {
  return (
    <SortableCard>
      <div style={{ display: 'grid', gap: 6 }}>
        <strong>{item.title || 'Без названия'}</strong>
        <small>Вариант: {item.variant}</small>
        {item.subtitle && <small style={{ opacity: 0.8 }}>{item.subtitle}</small>}
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <button onClick={onEdit}>Редактировать</button>
        <button onClick={onDuplicate}>Дублировать</button>
        <button onClick={onDelete}>Удалить</button>
      </div>
    </SortableCard>
  );
}
