import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/atoms/button';
import { Promotion } from '@/types/models/promotion.model';
import {
  PromotionsCard,
  Thumb,
  VideoBadge,
  Row,
  Status,
  CardTitle,
  Meta,
  MetaItem,
  Actions,
  CardBody,
} from '../promotions-list.style';
import { ButtonVariant } from '@/components/atoms/button/button.style';

interface SortablePromoCardProps {
  id: number;
  promo: Promotion;
  sortMode: boolean;
  onDelete: () => void;
  onEdit: (promo: Promotion) => void;
}

export function SortablePromoCard({
  id,
  promo,
  sortMode,
  onDelete,
  onEdit,
}: SortablePromoCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style: React.CSSProperties = sortMode
    ? { transform: CSS.Transform.toString(transform), transition }
    : {};

  return (
    <div ref={setNodeRef} style={style} {...(sortMode ? { ...attributes, ...listeners } : {})}>
      <PromotionsCard>
        <Thumb
          style={{
            backgroundImage: promo?.bgImageUrl ? `url(${promo.bgImageUrl})` : undefined,
          }}
        >
          {promo?.bgVideoUrl && <VideoBadge>video</VideoBadge>}
        </Thumb>

        <CardBody>
          <Row>
            <Status $on={promo.isPublished} />
            <CardTitle title={promo.title ?? promo.product?.name ?? ''}>
              {promo.title ?? promo.product?.name ?? 'Без названия'}
            </CardTitle>
          </Row>

          <Meta>
            {promo.product?.name && <MetaItem>Товар: {promo.product.name}</MetaItem>}
            {promo.startAt && (
              <MetaItem>
                {new Date(promo.startAt).toLocaleDateString()}–
                {new Date(promo.endAt).toLocaleDateString()}
              </MetaItem>
            )}
            {typeof promo.position === 'number' && <MetaItem>Позиция: {promo.position}</MetaItem>}
          </Meta>

          <Actions>
            <Button size="small" variant={ButtonVariant.SECONDARY} onClick={() => onEdit(promo)}>
              Редактировать
            </Button>
            <Button size="small" onClick={onDelete}>
              Удалить
            </Button>
          </Actions>
        </CardBody>
      </PromotionsCard>
    </div>
  );
}
