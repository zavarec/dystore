import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  CardBody,
  Meta,
  MetaItem,
  Actions,
  CategoryPromoCreateCard,
} from '@/features/admin/promotions/promotions-list/promotions-list.style';
import { CategoryPromoPlacement } from '@/types/models/category-promo-section.model';

interface Props {
  id: number;
  sortMode: boolean;
  title: string;
  order?: number;
  variant: string;
  categoryLabel: string | number;
  isActive: boolean;
  onEdit: () => void;
  onDelete: () => void;
  placements: CategoryPromoPlacement[];
  currentPlacement: CategoryPromoPlacement;
  onChangePlacement: (placement: CategoryPromoPlacement) => void;
}

export function SortableCpsCard({
  id,
  sortMode,
  title,
  order,
  variant,
  categoryLabel,
  isActive,
  onEdit,
  onDelete,
  placements,
  currentPlacement,
  onChangePlacement,
}: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });
  const style: React.CSSProperties = sortMode
    ? { transform: CSS.Transform.toString(transform), transition }
    : {};

  const draggingStyles: React.CSSProperties = isDragging
    ? {
        opacity: 0, // <- сохраняет «ячейку» на месте
        pointerEvents: 'none',
      }
    : {};

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, ...draggingStyles }}
      {...(sortMode ? { ...attributes, ...listeners } : {})}
    >
      <CategoryPromoCreateCard dragging={isDragging} sortable={sortMode}>
        <CardBody>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <strong>{title || 'Без названия'}</strong>
            {typeof order === 'number' && <span>#{order}</span>}
          </div>
          <Meta>
            <MetaItem>Вариант: {variant}</MetaItem>
            <MetaItem>Категория: {categoryLabel}</MetaItem>
            <MetaItem>{isActive ? 'Активно' : 'Выключено'}</MetaItem>
            <MetaItem>
              Плейсмент:{' '}
              <select
                value={currentPlacement}
                onChange={e => onChangePlacement(e.target.value as CategoryPromoPlacement)}
              >
                {placements.map(p => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </MetaItem>
          </Meta>
          <Actions>
            <button onClick={onEdit}>Редактировать</button>
            <button onClick={onDelete}>Удалить</button>
          </Actions>
        </CardBody>
      </CategoryPromoCreateCard>
    </div>
  );
}
