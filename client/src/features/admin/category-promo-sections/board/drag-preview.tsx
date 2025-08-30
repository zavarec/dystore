import {
  PromotionsCard,
  CardBody,
  Meta,
  MetaItem,
} from '../../promotions/promotions-list/promotions-list.style';
import styled from '@emotion/styled';

export const SortableCard = styled.div`
  transition:
    transform 200ms ease,
    box-shadow 200ms ease;
  &:active {
    cursor: grabbing;
  }
`;

// Можно рядом с SortableCpsCard
export function DragPreview({
  title,
  order,
  variant,
  categoryLabel,
  isActive,
}: {
  title: string;
  order?: number | null;
  variant: string;
  categoryLabel: string | number | null;
  isActive: boolean;
}) {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: 560,
        transform: 'rotate(1.5deg) scale(1.02)',
        boxShadow: '0 12px 30px rgba(0,0,0,0.25)',
        borderRadius: 12,
        background: 'white',
        opacity: 0.95,
      }}
    >
      <PromotionsCard>
        <CardBody>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <strong>{title}</strong>
            {typeof order === 'number' && <span>#{order}</span>}
          </div>
          <Meta>
            <MetaItem>Вариант: {variant}</MetaItem>
            <MetaItem>Категория: {categoryLabel}</MetaItem>
            <MetaItem>{isActive ? 'Активно' : 'Выключено'}</MetaItem>
          </Meta>
        </CardBody>
      </PromotionsCard>
    </div>
  );
}
