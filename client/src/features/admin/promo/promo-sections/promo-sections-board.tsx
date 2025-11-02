import { useEffect, useMemo, useState } from 'react';

import { useSelector } from 'react-redux';

import {
  Wrapper,
  HeaderRow,
  Title,
  Sub,
  CategoryPromoGrid as Grid,
  Empty,
} from '@/features/admin/promotions/promotions-list/promotions-list.style';
import { useAppDispatch } from '@/hooks';
import { selectPromoSections } from '@/store/slices/promo/promo.selectors';
import {
  listPromoSections,
  deletePromoSection,
  duplicatePromoSection,
} from '@/store/slices/promo/promo.thunks';
import type { PromoSection } from '@/types/models/promo-section.model';

import { PromoSectionCard } from './ui/promo-section-card';
import { PromoSectionCreateModal } from './ui/promo-section-create-modal';
import { PromoSectionEditModal } from './ui/promo-section-edit-modal';

export function PromoSectionsBoard() {
  const dispatch = useAppDispatch();
  const sections = useSelector(selectPromoSections) as PromoSection[];
  const [q, setQ] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editing, setEditing] = useState<PromoSection | null>(null);

  useEffect(() => {
    dispatch(listPromoSections(q || undefined));
  }, [dispatch, q]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return sections;
    return sections.filter(x => (x.title || '').toLowerCase().includes(s));
  }, [sections, q]);

  const handleDelete = async (id: number) => {
    if (window.confirm('Удалить секцию?')) await dispatch(deletePromoSection(id));
  };

  const handleDuplicate = async (item: PromoSection) => {
    await dispatch(duplicatePromoSection(item));
  };

  return (
    <>
      <Wrapper>
        <HeaderRow>
          <Title>Промо → Контент секций</Title>
          <Sub>Каталог секций. Создание / редактирование / дублирование</Sub>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Поиск по заголовку"
              style={{ width: 260 }}
            />
            <button onClick={() => setIsCreateOpen(true)}>Создать</button>
            <button onClick={() => dispatch(listPromoSections(q || undefined))}>Обновить</button>
          </div>
        </HeaderRow>

        {filtered.length === 0 ? (
          <Empty>Ничего не найдено</Empty>
        ) : (
          <Grid>
            {filtered.map(item => (
              <PromoSectionCard
                key={item.id}
                item={item}
                onEdit={() => setEditing(item)}
                onDelete={() => handleDelete(item.id)}
                onDuplicate={() => handleDuplicate(item)}
              />
            ))}
          </Grid>
        )}
      </Wrapper>

      {isCreateOpen && <PromoSectionCreateModal onClose={() => setIsCreateOpen(false)} />}
      {editing && <PromoSectionEditModal item={editing} onClose={() => setEditing(null)} />}
    </>
  );
}
