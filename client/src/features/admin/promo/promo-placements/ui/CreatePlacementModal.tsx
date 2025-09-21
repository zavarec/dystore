import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Modal } from '@/components/atoms/modal/modal';
import { createPlacement } from '@/store/slices/promo/promo.thunks';
import { PromoPageType, CreatePromoPlacementDto } from '@/types/models/promo-placement.model';
import { PromoSlot } from '@/types/models/promo-section.model';

export function CreatePlacementModal({
  initialPageType,
  initialEntityId,
  onClose,
}: {
  initialPageType?: PromoPageType;
  initialEntityId?: string;
  onClose: () => void;
}) {
  const dispatch = useDispatch<any>();
  const { register, handleSubmit } = useForm<CreatePromoPlacementDto>({
    defaultValues: {
      pageType: initialPageType ?? ('' as any),
      entityId: initialEntityId ?? '',
      slot: PromoSlot.ABOVE_PRODUCTS,
      order: 0,
      isActive: true,
    } as any,
  });

  const onSubmit = async (dto: CreatePromoPlacementDto) => {
    await dispatch(createPlacement(dto as any));
    onClose();
  };

  return (
    <Modal isOpen onClose={onClose} title="Добавить placement" size="lg">
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'grid', gap: 12, maxWidth: 640 }}>
        <label>
          Page Type
          <select {...register('pageType' as any)}>
            {Object.values(PromoPageType).map(p => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </label>

        <label>
          Entity ID (slug)
          <input
            {...register('entityId' as any)}
            placeholder="category slug / product slug / key"
          />
        </label>

        <label>
          Slot
          <select {...register('slot' as any)}>
            {Object.values(PromoSlot).map(s => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>

        <label>
          Order
          <input type="number" {...register('order' as any, { valueAsNumber: true })} />
        </label>

        <label>
          Active
          <input type="checkbox" {...register('isActive' as any)} />
        </label>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button type="submit">Создать</button>
          <button type="button" onClick={onClose}>
            Отмена
          </button>
        </div>
      </form>
    </Modal>
  );
}
