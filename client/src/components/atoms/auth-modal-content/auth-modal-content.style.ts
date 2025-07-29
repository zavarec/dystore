import styled from '@emotion/styled';

export const AuthModeContainer = styled.div`
  padding: 24px 48px 0 48px;
`;

export const AuthModeSelector = styled.div`
  display: flex;
  background: #f8f9fa;
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 24px;
`;

export const AuthModeButton = styled.button<{ active: boolean }>`
  flex: 1;
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  background: ${props => (props.active ? 'white' : 'transparent')};
  color: ${props => (props.active ? '#1a1a1a' : '#666')};
  box-shadow: ${props => (props.active ? '0 2px 8px rgba(0, 0, 0, 0.1)' : 'none')};

  &:hover {
    color: #1a1a1a;
  }

  &:focus {
    outline: none;
    box-shadow: ${props =>
      props.active
        ? '0 2px 8px rgba(0, 0, 0, 0.1), 0 0 0 2px rgba(52, 152, 219, 0.3)'
        : '0 0 0 2px rgba(52, 152, 219, 0.3)'};
  }
`;
