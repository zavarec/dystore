'use client';

import React, { ReactNode } from 'react';
import { ScrollContainer, Slide } from './horizontal-scroller.style';

interface HorizontalScrollerProps<T> {
  /** Данные для отображения */
  items: T[];
  /** Функция, которая рендерит каждый элемент */
  renderItem: (item: T, index: number) => ReactNode;
  /** Минимальная ширина карточки */
  minItemWidth?: string;
  /** Отступ между карточками */
  gap?: string;
  /** Внутренние отступы контейнера */
  paddingInline?: string;
  /** aria-label для доступности */
  ariaLabel?: string;
}

export function HorizontalScroller<T>({
  items,
  renderItem,
  minItemWidth = '220px',
  gap = '24px',
  paddingInline = '40px',
  ariaLabel = 'Горизонтальный список',
}: HorizontalScrollerProps<T>) {
  return (
    <ScrollContainer gap={gap} paddingInline={paddingInline} aria-label={ariaLabel} role="region">
      {items.map((item, idx) => (
        <Slide key={idx} minWidth={minItemWidth}>
          {renderItem(item, idx)}
        </Slide>
      ))}
    </ScrollContainer>
  );
}
