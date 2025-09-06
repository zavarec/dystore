import styled from '@emotion/styled';

export const AuthFormContainer = styled.div`
  padding: 48px;
  position: relative;
`;

export const AuthFormCard = styled.div`
  background: white;
  border-radius: 24px;
  padding: 48px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  position: relative;
`;

export const AuthFormTitle = styled.h2`
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 8px 0;
  text-align: center;
  line-height: 1.2;
`;

export const AuthFormSubtitle = styled.p`
  font-size: 16px;
  color: #666;
  margin: 0 0 32px 0;
  text-align: center;
  line-height: 1.4;
`;

export const FormGroup = styled.div`
  margin-bottom: 24px;
`;

export const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
`;

export const Input = styled.input<{ error?: boolean }>`
  width: 100%;
  padding: 16px 20px;
  border: 2px solid ${props => (props.error ? '#e74c3c' : '#e5e5e5')};
  border-radius: 12px;
  font-size: 16px;
  transition: all 0.2s ease;
  background: white;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${props => (props.error ? '#e74c3c' : '#3498db')};
    box-shadow: 0 0 0 3px
      ${props => (props.error ? 'rgba(231, 76, 60, 0.1)' : 'rgba(52, 152, 219, 0.1)')};
  }

  &::placeholder {
    color: #999;
  }

  &:disabled {
    background: #f8f9fa;
    cursor: not-allowed;
  }
`;

export const ErrorMessage = styled.div`
  color: #e74c3c;
  font-size: 14px;
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 6px;

  &::before {
    content: '⚠';
    font-size: 12px;
  }
`;

export const FormActions = styled.div`
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const SuccessMessage = styled.div`
  color: #27ae60;
  font-size: 14px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 6px;

  &::before {
    content: '✓';
    font-size: 12px;
  }
`;
export const CloseButton = styled.button`
  all: unset;
  position: absolute;
  top: 8px;
  right: 8px;

  /* большой и предсказуемый хитбокс */
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;

  cursor: pointer;
  border-radius: 8px;
  z-index: 100; /* выше содержимого формы */
  -webkit-tap-highlight-color: transparent;

  /* визуальный отклик */
  &:hover {
    background: rgba(0, 0, 0, 0.06);
  }
  &:active {
    transform: translateY(0.5px);
  }

  /* на случай перекрытий */
  pointer-events: auto;

  /* если внутри будет svg — пусть растягивается адекватно */
  svg {
    width: 18px;
    height: 18px;
    pointer-events: none;
  }
`;

export const SwitchModeButton = styled.button`
  background: none;
  border: none;
  color: #3498db;
  font-size: 14px;
  cursor: pointer;
  margin-top: 24px;
  width: 100%;
  text-align: center;
  padding: 8px;
  transition: color 0.2s ease;

  &:hover {
    color: #2980b9;
    text-decoration: underline;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.3);
    border-radius: 4px;
  }
`;
