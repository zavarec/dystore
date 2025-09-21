import React, { useEffect, useMemo, useState } from 'react';
import Select from 'react-select';
import { useDispatch } from 'react-redux';
import { Modal } from '@/components/atoms/modal/modal';
import { PromoPageType } from '@/types/models/promo-placement.model';
import { PromoSection, PromoSlot } from '@/types/models/promo-section.model';
import { createPlacement, listPromoSections } from '@/store/slices/promo/promo.thunks';

export function AttachSectionModal({
  pageType,
  entityId,
  slot,
  onClose,
}: {
  pageType: PromoPageType;
  entityId: string;
  slot: PromoSlot;
  onClose: () => void;
}) {
  const dispatch = useDispatch<any>();
  const [sections, setSections] = useState<PromoSection[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<number | undefined>();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const action = await dispatch(listPromoSections()); // реализуй под новый endpoint
        const payload = action?.payload ?? action;
        const list = Array.isArray(payload) ? payload : payload.allSections;
        if (mounted) setSections(list);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const options = useMemo(
    () => sections.map(s => ({ value: s.id, label: `${s.title || s.variant} (#${s.id})` })),
    [sections],
  );

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    await dispatch(
      createPlacement({
        pageType,
        entityId,
        slot,
        promoSectionId: selected,
        isActive: true,
        order: 0,
      } as any),
    );
    onClose();
  };

  return (
    <Modal isOpen onClose={onClose} title="Привязать секцию" size="lg">
      <form onSubmit={submit} style={{ display: 'grid', gap: 12, maxWidth: 560, height: '100%' }}>
        <div>
          Куда: <code>{pageType}</code> / <code>{entityId}</code> / <code>{slot}</code>
        </div>
        <Select
          isLoading={loading}
          options={options}
          placeholder="Выберите секцию…"
          value={options.find(o => o.value === selected) || null}
          onChange={(opt: any) => setSelected(opt?.value)}
          isClearable
        />
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button type="submit" disabled={!selected}>
            Привязать
          </button>
          <button type="button" onClick={onClose}>
            Отмена
          </button>
        </div>
      </form>
    </Modal>
  );
}
