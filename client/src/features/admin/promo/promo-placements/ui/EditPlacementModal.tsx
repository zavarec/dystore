import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Modal } from '@/components/atoms/modal/modal';
import { updatePlacement } from '@/store/slices/promo/promo.thunks';
import {
  PromoPlacement,
  UpdatePromoPlacementDto,
  PromoPageType,
} from '@/types/models/promo-placement.model';
import { PromoSlot } from '@/types/models/promo-section.model';
import { Select } from '../../promo-sections/ui/promo-sections-modals.style';
import { Input } from '../promo-placements-board.style';

export function EditPlacementModal({
  item,
  onClose,
}: {
  item: PromoPlacement;
  onClose: () => void;
}) {
  const dispatch = useDispatch<any>();
  const { register, handleSubmit } = useForm<UpdatePromoPlacementDto>({
    defaultValues: {
      pageType: item.pageType,
      entityId: item.entityId,
      slot: item.slot,
      order: item.order,
      isActive: item.isActive,
      promoSectionId: item.promoSectionId ?? undefined,
      fullWidth: item.fullWidth ?? undefined,
      marginTop: item.marginTop ?? undefined,
      marginBottom: item.marginBottom ?? undefined,
      bgColor: item.bgColor ?? undefined,
      zIndex: item.zIndex ?? undefined,
      contentSide: (item as any).contentSide ?? undefined,
    } as any,
  });

  const onSubmit = async (dto: UpdatePromoPlacementDto) => {
    await dispatch(updatePlacement({ id: item.id, dto } as any));
    onClose();
  };

  return (
    <Modal isOpen onClose={onClose} title={`Редактировать placement #${item.id}`} size="lg">
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'grid', gap: 12, maxWidth: 680 }}>
        <label>
          Страница
          <Select {...register('pageType' as any)}>
            {Object.values(PromoPageType).map(p => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </Select>
        </label>

        <label>
          Entity ID
          <Input {...register('entityId')} />
        </label>

        <label>
          Slot
          <Select {...register('slot' as any)}>
            {Object.values(PromoSlot).map(s => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        </label>

        <label>
          Order
          <input type="number" {...register('order' as any, { valueAsNumber: true })} />
        </label>
        <label>
          Active
          <input type="checkbox" {...register('isActive' as any)} />
        </label>

        <details>
          <summary>Доп. настройки</summary>
          <div style={{ display: 'grid', gap: 8, marginTop: 8 }}>
            <label>
              Full width
              <input type="checkbox" {...register('fullWidth' as any)} />
            </label>
            <label>
              Margin Top
              <input type="number" {...register('marginTop' as any, { valueAsNumber: true })} />
            </label>
            <label>
              Margin Bottom
              <input type="number" {...register('marginBottom' as any, { valueAsNumber: true })} />
            </label>
            <label>
              Bg Color
              <input {...register('bgColor' as any)} placeholder="#ffffff" />
            </label>
            <label>
              Z-index
              <input type="number" {...register('zIndex' as any, { valueAsNumber: true })} />
            </label>
            <label>
              Content Side
              <select {...register('contentSide' as any)}>
                <option value="">—</option>
                <option value="LEFT">LEFT</option>
                <option value="CENTER">CENTER</option>
                <option value="RIGHT">RIGHT</option>
              </select>
            </label>
          </div>
        </details>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button type="submit">Сохранить</button>
          <button type="button" onClick={onClose}>
            Отмена
          </button>
        </div>
      </form>
    </Modal>
  );
}
