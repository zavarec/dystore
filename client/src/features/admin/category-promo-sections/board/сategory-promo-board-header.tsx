import { Button } from '@/components/atoms/button';
import {
  HeaderRow,
  Title,
  Sub,
} from '@/features/admin/promotions/promotions-list/promotions-list.style';

interface Props {
  sortMode: boolean;
  setSortMode: (v: boolean) => void;
  onRefresh: () => void;
  onCreate?: () => void;
}

export function CategoryPromoBoardHeader({ sortMode, setSortMode, onRefresh, onCreate }: Props) {
  return (
    <HeaderRow>
      <Title>Промо-секции категорий</Title>
      <Sub>DnD сортировка, смена колонки, CRUD</Sub>
      <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
        {onCreate && <Button onClick={onCreate}>Добавить секцию</Button>}
        <Button onClick={() => setSortMode(!sortMode)}>
          {sortMode ? 'Готово' : 'Сортировать'}
        </Button>
        <Button onClick={onRefresh}>Обновить</Button>
      </div>
    </HeaderRow>
  );
}
