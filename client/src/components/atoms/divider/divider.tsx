import { tokens } from '@/styles/shared';

import { StyledDivider } from './divider.style';

export type DividerProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Горизонтальный (по умолчанию) или вертикальный */
  orientation?: 'horizontal' | 'vertical';
  /** Цвет линии */
  color?: string;
  /** Толщина линии */
  thickness?: string;
  /** Отступы вокруг */
  margin?: string;
  /** Длина линии (width или height, в зависимости от ориентации) */
  length?: string;
};

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  color = tokens.colors.semantic.divider.default,
  thickness = '1px',
  margin = '0',
  length = '100%',
  className,
}) => (
  <StyledDivider
    orientation={orientation}
    color={color}
    thickness={thickness}
    margin={margin}
    length={length}
    className={className}
  />
);
