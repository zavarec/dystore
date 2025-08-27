'use client';

import { DndContext, closestCenter } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useEffect, useMemo, useState } from 'react';
import styled from '@emotion/styled';
import { DotsSixVertical } from '@phosphor-icons/react';
import { LayoutService, PageSectionDTO } from '@/services/layout.service';

type HomeSection = {
  id: number;
  name: string;
  position: number;
  enabled: boolean;
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 20px;
  font-weight: 700;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SaveButton = styled.button`
  background: #111827;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  cursor: pointer;
  font-weight: 600;
  opacity: ${props => (props.disabled ? 0.6 : 1)};
` as unknown as (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => JSX.Element;

const List = styled.div`
  display: grid;
  gap: 12px;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  border: 1px solid #eaeaea;
  border-radius: 8px;
  background: #fff;
`;

const Left = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const DragHandle = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: #f9fafb;
  cursor: grab;
`;

const NameInput = styled.input`
  padding: 6px 8px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  min-width: 240px;
`;

const EnabledLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
`;

function SortableItem({
  section,
  onNameChange,
  onToggleEnabled,
}: {
  section: HomeSection;
  onNameChange: (id: number, name: string) => void;
  onToggleEnabled: (id: number, enabled: boolean) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: section.id,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Row ref={setNodeRef} style={style} {...attributes}>
      <Left>
        <DragHandle {...listeners} aria-label="Перетащить секцию">
          <DotsSixVertical size={18} />
        </DragHandle>
        <NameInput
          defaultValue={section.name}
          onBlur={e => onNameChange(section.id, e.currentTarget.value)}
        />
      </Left>
      <EnabledLabel>
        Включено
        <input
          type="checkbox"
          defaultChecked={section.enabled}
          onChange={e => onToggleEnabled(section.id, e.currentTarget.checked)}
        />
      </EnabledLabel>
    </Row>
  );
}

export default function HomeLayoutEditor() {
  const [items, setItems] = useState<PageSectionDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    LayoutService.adminList()
      .then(res => setItems(res))
      .finally(() => setLoading(false));
  }, []);

  const sections: HomeSection[] = useMemo(
    () =>
      items
        .slice()
        .sort((a, b) => a.position - b.position)
        .map(s => ({ id: s.id, name: s.title ?? '', position: s.position, enabled: s.isEnabled })),
    [items],
  );

  const updateSection = async (
    id: number,
    payload: Partial<Pick<HomeSection, 'name' | 'enabled'>>,
  ) => {
    const body: Partial<Pick<PageSectionDTO, 'title' | 'isEnabled'>> = {};
    if (payload.name !== undefined) body.title = payload.name;
    if (payload.enabled !== undefined) body.isEnabled = payload.enabled;
    await LayoutService.updateSection(id, body);
    setItems(prev =>
      prev.map(s =>
        s.id === id
          ? {
              ...s,
              ...(body.title !== undefined ? { title: body.title } : {}),
              ...(body.isEnabled !== undefined ? { isEnabled: body.isEnabled } : {}),
            }
          : s,
      ),
    );
  };

  const updateSectionOrder = async (sectionsToSave: HomeSection[]) => {
    await LayoutService.reorder(sectionsToSave.map(s => ({ id: s.id, position: s.position })));
    setDirty(false);
    // обновим локальный items.position чтобы соответствовал сохранённому
    setItems(prev =>
      prev
        .map(s => {
          const found = sectionsToSave.find(x => x.id === s.id);
          return found ? { ...s, position: found.position } : s;
        })
        .slice()
        .sort((a, b) => a.position - b.position),
    );
  };

  if (loading) return <div>Загрузка секций...</div>;

  const onDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = sections.findIndex(i => i.id === active.id);
    const newIndex = sections.findIndex(i => i.id === over.id);
    const newOrder = arrayMove(sections, oldIndex, newIndex).map((s, index) => ({
      ...s,
      position: index,
    }));
    // синхронизируем в items только позиции
    setItems(prev =>
      prev.map(s => {
        const found = newOrder.find(x => x.id === s.id);
        return found ? { ...s, position: found.position } : s;
      }),
    );
    setDirty(true);
  };

  return (
    <Wrapper>
      <Header>
        <Title>Редактор главной страницы</Title>
        <Actions>
          <SaveButton
            disabled={!dirty}
            onClick={() =>
              updateSectionOrder(sections.slice().sort((a, b) => a.position - b.position))
            }
          >
            Сохранить порядок
          </SaveButton>
        </Actions>
      </Header>
      <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={sections.map(i => i.id)} strategy={verticalListSortingStrategy}>
          <List>
            {sections.map(section => (
              <SortableItem
                key={section.id}
                section={section}
                onNameChange={(id, name) => updateSection(id, { name })}
                onToggleEnabled={(id, enabled) => updateSection(id, { enabled })}
              />
            ))}
          </List>
        </SortableContext>
      </DndContext>
    </Wrapper>
  );
}
