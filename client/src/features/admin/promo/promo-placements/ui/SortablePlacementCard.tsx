import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import {
  PromotionsCard,
  CardBody,
  CardTitle,
  Meta,
  MetaItem,
  Actions,
  Status,
} from '@/features/admin/promotions/promotions-list/promotions-list.style';
import type { PromoPlacement } from '@/types/models/promo-placement.model';
import { PromoSlot } from '@/types/models/promo-section.model';

import { CloseIcon, DeleteButton } from '../promo-placements-board.style';
import { Preview } from './card-preview';

interface Props {
  id: number;
  item: PromoPlacement;
  sortMode: boolean;
  onEdit: () => void;
  onEditSection?: () => void;
  onDelete: () => void;
  onChangeSlot: (slot: PromoSlot) => void;
  onToggleActive: (v: boolean) => void;
}

export const SortablePlacementCard: React.FC<Props> = ({
  id,
  item,
  sortMode,
  onEdit,
  onEditSection,
  onDelete,
  onChangeSlot,
  onToggleActive,
}: Props) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });
  const style = { transform: CSS.Transform.toString(transform), transition } as React.CSSProperties;

  const dragProps = sortMode ? { ...attributes, ...listeners } : {};

  return (
    <PromotionsCard
      ref={setNodeRef}
      style={style}
      sortable={sortMode}
      dragging={isDragging}
      {...dragProps}
    >
      <DeleteButton
        aria-label="Удалить размещение"
        title="Удалить"
        onClick={e => {
          e.stopPropagation();
          onDelete();
        }}
        onMouseDown={e => e.stopPropagation()}
      >
        <CloseIcon viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M6 6l12 12M18 6L6 18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </CloseIcon>
      </DeleteButton>

      <Preview item={item} />

      {/* <Thumb /> */}

      <CardBody>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Status $on={!!item.isActive} />
          <CardTitle>
            #{item.id} · {item.entityId} · {item.pageType}
          </CardTitle>
        </div>
        <Meta>
          <MetaItem>slot: {item.slot}</MetaItem>
          <MetaItem>order: {item.order}</MetaItem>
          {item.promoSection && <MetaItem>section: {item.promoSection.id}</MetaItem>}
        </Meta>
        <Actions>
          {onEditSection && <button onClick={onEditSection}>Ред. секцию</button>}
          <button onClick={onEdit}>Редактировать</button>
          <button onClick={() => onToggleActive(!item.isActive)}>
            {item.isActive ? 'Выключить' : 'Включить'}
          </button>
          <select value={item.slot} onChange={e => onChangeSlot(e.target.value as PromoSlot)}>
            {Object.values(PromoSlot).map(s => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Actions>
      </CardBody>
    </PromotionsCard>
  );
};
