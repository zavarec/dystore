import React from 'react';
import {
  HeaderRow,
  Title,
  Sub,
} from '@/features/admin/promotions/promotions-list/promotions-list.style';
import { PromoPageType } from '@/types/models/promo-placement.model';

interface Props {
  isLoading?: boolean;
  sortMode: boolean;
  onToggleSort: () => void;
  onCreate: () => void;
  onRefresh: () => void;
  params: { pageType?: PromoPageType; entityId?: string };
  onChangeParams: (p: { pageType?: PromoPageType; entityId?: string }) => void;
}

export const PromoPlacementsHeader: React.FC<Props> = ({
  isLoading,
  sortMode,
  onToggleSort,
  onCreate,
  onRefresh,
  params,
  onChangeParams,
}) => {
  return (
    <HeaderRow>
      <Title>Размещения</Title>
      <Sub>{isLoading ? 'Загрузка…' : 'Готово'}</Sub>

      <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
        <button onClick={onRefresh}>Обновить</button>
        <select
          value={params.pageType ?? ''}
          onChange={e =>
            onChangeParams({ ...params, pageType: (e.target.value || undefined) as any })
          }
        >
          <option value="">Все страницы</option>
          <option value={PromoPageType.CATEGORY}>Категории</option> 
          <option value={PromoPageType.PRODUCT}>Продукты</option>
          <option value={PromoPageType.LANDING}>Лендинги</option>
          <option value={PromoPageType.STATIC}>Статические</option>
        </select>

        <input
          placeholder="entityId"
          value={params.entityId ?? ''}
          onChange={e =>
            onChangeParams({ ...(params as any), entityId: e.target.value || undefined })
          }
          style={{ width: 220 }}
        />

        <button onClick={onToggleSort}>{sortMode ? 'Завершить сортировку' : 'Сортировать'}</button>
        <button onClick={onCreate}>Создать размещение</button>
      </div>
    </HeaderRow>
  );
};
