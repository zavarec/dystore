import styled from '@emotion/styled';

export const DeleteButton = styled.button`
  margin-left: auto;
  margin-right: 8px;
  margin-top: 8px;

  width: 28px;
  height: 28px;
  border-radius: 8px;
  border: 1px solid rgba(185, 28, 28, 0.18);
  background: #fff;
  color: #b91c1c;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 0;
  transition:
    background 0.15s ease,
    transform 0.08s ease,
    box-shadow 0.15s ease;
  box-shadow: 0 2px 8px rgba(185, 28, 28, 0.15);

  &:hover {
    background: #fef2f2;
  }
  &:active {
    transform: scale(0.96);
  }
`;

export const CloseIcon = styled.svg`
  width: 16px;
  height: 16px;
`;

export const Form = styled.form`
  display: grid;
  gap: 12px;
  width: min(780px, 100%);
`;

export const Row = styled.label`
  display: grid;
  gap: 6px;
  font-size: 13px;
  color: #374151;
`;

export const Inline = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

export const Input = styled.input`
  height: 38px;
  padding: 8px 10px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #fff;
  outline: none;
  &:focus {
    border-color: #111827;
    box-shadow: 0 0 0 3px rgba(17, 24, 39, 0.08);
  }
`;

export const SelectEl = styled.select`
  height: 38px;
  padding: 8px 10px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #fff;
  outline: none;
  &:focus {
    border-color: #111827;
    box-shadow: 0 0 0 3px rgba(17, 24, 39, 0.08);
  }
`;

export const Checkbox = styled.input`
  width: 18px;
  height: 18px;
`;

export const Footer = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 8px;
`;

export const Button = styled.button<{ variant?: 'primary' | 'ghost' }>`
  height: 38px;
  padding: 0 14px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid ${({ variant }) => (variant === 'ghost' ? '#e5e7eb' : '#111827')};
  background: ${({ variant }) => (variant === 'ghost' ? '#fff' : '#111827')};
  color: ${({ variant }) => (variant === 'ghost' ? '#111827' : '#fff')};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  &:hover {
    filter: brightness(0.98);
  }

  &:active:not(:disabled) {
    transform: scale(0.97);
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const Hint = styled.div`
  font-size: 12px;
  color: #6b7280;
`;

export const ColorRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

export const Swatch = styled.span<{ color?: string }>`
  width: 24px;
  height: 24px;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  background: ${({ color }) => color || '#fff'};
`;
