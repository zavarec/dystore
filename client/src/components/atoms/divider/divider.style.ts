import { css } from '@emotion/react';
import styled from '@emotion/styled';

import type { DividerProps } from './divider';

export const StyledDivider = styled.div<DividerProps>`
  background-color: ${({ color }) => color || 'rgba(0,0,0,0.1)'};
  ${({ orientation, thickness, length, margin }) =>
    orientation === 'vertical'
      ? css`
          width: ${thickness};
          height: ${length};
          margin: ${margin};
        `
      : css`
          height: ${thickness};
          width: ${length};
          margin: ${margin};
        `}
`;
