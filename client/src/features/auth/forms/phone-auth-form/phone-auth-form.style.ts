import styled from '@emotion/styled';
import { motion } from 'framer-motion';

export const AuthFormContainer = styled.div<{ isModal?: boolean }>`
  min-height: ${({ isModal }) => (isModal ? 'auto' : '100vh')};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ isModal }) => (isModal ? '0' : '20px')};
  background: ${({ isModal }) =>
    isModal ? 'transparent' : 'linear-gradient(135deg, #f5f5f5 0%, #e5e5e5 100%)'};
`;

export const AuthFormCard = styled(motion.div)<{ isModal?: boolean }>`
  background: white;
  border-radius: 16px;
  padding: 48px;
  width: 100%;
  max-width: 440px;
  box-shadow: ${({ isModal }) => (isModal ? 'none' : '0 20px 60px rgba(0, 0, 0, 0.1)')};
  border: ${({ isModal }) => (isModal ? 'none' : '1px solid #e5e5e5')};
  position: relative;

  @media (max-width: 768px) {
    padding: 32px 24px;
    border-radius: 12px;
  }
`;

export const AuthFormTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
  text-align: center;
  margin-bottom: 8px;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

export const AuthFormSubtitle = styled.p`
  font-size: 1rem;
  color: #525252;
  text-align: center;
  margin-bottom: 32px;
  line-height: 1.5;

  @media (max-width: 768px) {
    font-size: 0.9rem;
    margin-bottom: 24px;
  }
`;

export const FormGroup = styled.div`
  margin-bottom: 24px;

  &:last-of-type {
    margin-bottom: 32px;
  }
`;

export const Label = styled.label`
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px;
`;

export const Input = styled.input<{ error?: boolean }>`
  width: 100%;
  padding: 16px;
  font-size: 1rem;
  border: 2px solid ${({ error }) => (error ? '#dc3545' : '#e5e5e5')};
  border-radius: 8px;
  background: white;
  color: #1a1a1a;
  transition: all 0.2s ease;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    outline: none;
    border-color: ${({ error }) => (error ? '#dc3545' : '#1a1a1a')};
    box-shadow: 0 0 0 3px
      ${({ error }) => (error ? 'rgba(220, 53, 69, 0.1)' : 'rgba(26, 26, 26, 0.1)')};
  }

  &:hover:not(:focus) {
    border-color: ${({ error }) => (error ? '#dc3545' : '#d0d0d0')};
  }
`;

export const ErrorMessage = styled.span`
  display: block;
  font-size: 0.875rem;
  color: #dc3545;
  margin-top: 6px;
  font-weight: 500;
`;

export const SuccessMessage = styled.span`
  display: block;
  font-size: 0.875rem;
  color: #28a745;
  margin-top: 6px;
  font-weight: 500;
`;

export const FormActions = styled.div`
  margin-bottom: 24px;
`;

export const ResendButton = styled.button`
  background: none;
  border: none;
  color: #1a1a1a;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  margin-top: 16px;
  width: 100%;
  text-decoration: underline;
  transition: color 0.2s ease;
  padding: 8px;

  &:hover:not(:disabled) {
    color: #404040;
  }

  &:focus {
    outline: none;
    color: #404040;
  }

  &:disabled {
    color: #9ca3af;
    cursor: not-allowed;
    text-decoration: none;
  }
`;

export const TimerText = styled.p`
  text-align: center;
  font-size: 0.9rem;
  color: #525252;
  margin: 16px 0 0 0;
  font-weight: 500;
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 32px;
  height: 32px;
  border: none;
  background: #f5f5f5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
  color: #525252;
  transition: all 0.2s ease;
  z-index: 10;

  &:hover {
    background: #e5e5e5;
    color: #1a1a1a;
    transform: scale(1.05);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(26, 26, 26, 0.2);
  }

  @media (max-width: 768px) {
    top: 16px;
    right: 16px;
    width: 28px;
    height: 28px;
    font-size: 14px;
  }
`;
