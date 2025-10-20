import Link from 'next/link';

import styled from '@emotion/styled';

export const DropdownRoot = styled.div<{ fullWidth?: boolean }>`
  position: relative;
  display: inline-block;
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
`;

export const DropdownTrigger = styled.button<{ fullWidth?: boolean; hasBorder?: boolean }>`
  background: transparent;
  color: inherit;
  font: inherit;
  border: ${({ hasBorder }) => (hasBorder ? `1px solid rgba(0, 0, 0, 0.2)` : 'none')};
  border-radius: 10px;
  padding: 10px 14px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;

  /* новенькое */
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
  justify-content: ${({ fullWidth }) => (fullWidth ? 'space-between' : 'center')};

  &:hover {
    border-color: rgba(0, 0, 0, 0.35);
  }
  &:focus-visible {
    outline: 3px solid rgba(0, 0, 0, 0.25);
    outline-offset: 2px;
  }
`;

export const DropdownMenu = styled.ul<{
  align?: 'start' | 'end';
  fullWidth?: boolean;
  hasBorder?: boolean;
}>`
  position: absolute;
  top: calc(100% + 8px);
  ${({ align }) => (align === 'end' ? 'right: 0;' : 'left: 0;')}

  /* новенькое */
  ${({ fullWidth }) => (fullWidth ? 'width: 100%; min-width: unset;' : 'min-width: 220px;')}

  margin: 0;
  padding: 6px;
  list-style: none;
  background: #1f1f1f;
  color: #fff;
  border: ${({ hasBorder }) => (hasBorder ? `1px solid rgba(0, 0, 0, 0.2)` : 'none')};
  border-radius: 12px;
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.35);
  z-index: 50;
`;

export const DropdownChevron = styled.span<{ open?: boolean }>`
  width: 14px;
  height: 14px;
  display: inline-block;
  transform: rotate(${({ open }) => (open ? 180 : 0)}deg);
  transition: transform 0.18s ease;
  &::before {
    content: '';
    display: block;
    width: 100%;
    height: 100%;
    border-right: 2px solid currentColor;
    border-bottom: 2px solid currentColor;
    transform: rotate(45deg) translateY(-2px);
  }
`;

export const DropdownItemButton = styled.button<{ active?: boolean }>`
  width: 100%;
  display: block;
  text-align: left;
  background: transparent;
  color: #fff;
  border: 0;
  border-radius: 8px;
  padding: 10px 12px;
  cursor: pointer;
  font-size: 15px;
  line-height: 1.4;
  ${({ active }) => (active ? 'background: rgba(255,255,255,0.08);' : '')}
  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const DropdownItemLink = styled(Link)<{ active?: boolean }>`
  display: block;
  border-radius: 8px;
  padding: 10px 12px;
  color: #fff;
  text-decoration: none;
  font-size: 15px;
  line-height: 1.4;
  ${({ active }) => (active ? 'background: rgba(255,255,255,0.08);' : '')}
  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
`;
