// category-promo-create-modal.style.ts
import styled from '@emotion/styled';

export const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(17, 24, 39, 0.45);
  display: grid;
  place-items: center;
  z-index: 1000;
`;

export const Modal = styled.div`
  width: min(900px, 95vw); /* 🔥 шире, прямоугольная форма */
  max-height: 90vh;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.18);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const Header = styled.div`
  position: sticky;
  top: 0;
  z-index: 1;
  padding: 14px 18px;
  border-bottom: 1px solid #eef0f3;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
`;

export const Title = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
`;

export const CloseBtn = styled.button`
  border: 0;
  background: transparent;
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
  color: #6b7280;
  padding: 4px 8px;
  border-radius: 8px;

  &:hover {
    background: #f3f4f6;
  }
`;

export const Body = styled.form`
  flex: 1 1 auto;
  overflow-y: auto;
  padding: 20px 24px;

  display: grid;
  grid-template-columns: 1fr 1fr; /* 🔥 две колонки */
  gap: 16px 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr; /* на мобилке одна колонка */
  }
`;

export const Field = styled.label`
  display: grid;
  gap: 6px;
  font-size: 13px;
  color: #374151;
`;

const control = `
  height: 38px;
  padding: 8px 10px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #fff;
  outline: none;
  transition: border-color .12s ease, box-shadow .12s ease;
  &:focus { border-color: #111827; box-shadow: 0 0 0 3px rgba(17, 24, 39, 0.08); }
`;

export const Input = styled.input`
  ${control}
`;
export const Select = styled.select`
  ${control}
`;

export const Footer = styled.div`
  position: sticky;
  bottom: 0;
  z-index: 1;
  padding: 10px 18px 16px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  border-top: 1px solid #eef0f3;
  background: #fff;
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
`;
