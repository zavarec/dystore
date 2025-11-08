import styled from '@emotion/styled';
import { IMaskInput } from 'react-imask';

import { tokens } from '@/styles/shared';

export type StyledProps = {
  hasError?: boolean;
  fullWidth?: boolean;
};

export const Masked = styled(IMaskInput)<StyledProps>`
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
  padding: 12px 16px;
  border: 1px solid
    ${({ hasError }) => (hasError ? '#e5484d' : tokens.colors.semantic.border.input)};
  border-radius: 2px;
  background: #fff;
  color: #111827;
  font-size: 16px;
  line-height: 22px;
  outline: none;
  transition:
    border-color 0.15s,
    box-shadow 0.15s;

  &::placeholder {
    color: #9ca3af;
  }

  &:hover {
    border-color: ${({ hasError }) => (hasError ? '#e5484d' : '#9CA3AF')};
  }

  &:focus {
    border-color: ${({ hasError }) => (hasError ? '#e5484d' : '#111827')};
    box-shadow: 0 0 0 3px rgba(17, 24, 39, 0.12);
  }

  /* чтобы цифры были удобнее на мобильных */
  -webkit-text-size-adjust: 100%;
`;
