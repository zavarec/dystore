import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { motion } from 'framer-motion';

export enum ButtonVariant {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  OUTLINE = 'outline',
  GHOST = 'ghost',
  GREEN = 'green',
}

interface StyledButtonProps {
  variant?: ButtonVariant;
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  fullWidth?: boolean;
}

export const StyledButton = styled(motion.button, {
  shouldForwardProp: prop => !['variant', 'size', 'fullWidth'].includes(prop as string),
})<StyledButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 8px;
  font-family: inherit;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;

  ${({ fullWidth }) =>
    fullWidth &&
    css`
      width: 100%;
    `}

  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.6;
      cursor: not-allowed;
      pointer-events: none;
    `}

  ${({ size }) => {
    switch (size) {
      case 'small':
        return css`
          padding: 8px 16px;
          font-size: 14px;
          line-height: 1.4;
        `;
      case 'large':
        return css`
          padding: 16px 32px;
          font-size: 18px;
          line-height: 1.4;
        `;
      default:
        return css`
          padding: 12px 24px;
          font-size: 16px;
          line-height: 1.5;
        `;
    }
  }}

  ${({ variant }) => {
    switch (variant) {
      case 'secondary':
        return css`
          background: #ffffff;
          color: #1a1a1a;
          border: 1px solid #e5e5e5;

          &:hover:not(:disabled) {
            background: #f5f5f5;
            border-color: #d0d0d0;
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          }

          &:active:not(:disabled) {
            background: #e5e5e5;
            transform: translateY(0);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          }
        `;
      case 'outline':
        return css`
          background: transparent;
          color: #1a1a1a;
          border: 2px solid #1a1a1a;

          &:hover:not(:disabled) {
            background: #1a1a1a;
            color: white;
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(26, 26, 26, 0.2);
          }

          &:active:not(:disabled) {
            background: #2d2d2d;
            border-color: #2d2d2d;
            transform: translateY(0);
            box-shadow: 0 4px 15px rgba(26, 26, 26, 0.2);
          }
        `;

      case 'green':
        return css`
          background: #79b928;
          color: black;
          border: none;
          border-radius: 0;

          &:hover:not(:disabled) {
            background: rgb(107, 162, 36);
            color: white;
          }

          &:active:not(:disabled) {
            background: #2d2d2d;
            border-color: #2d2d2d;
            transform: translateY(0);
            box-shadow: 0 4px 15px rgba(26, 26, 26, 0.2);
          }
        `;
      case 'ghost':
        return css`
          background: transparent;
          color: #525252;
          border: none;

          &:hover:not(:disabled) {
            background: #f5f5f5;
            color: #1a1a1a;
            transform: translateY(-1px);
          }

          &:active:not(:disabled) {
            background: #e5e5e5;
            transform: translateY(0);
          }
        `;
      default:
        return css`
          background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
          color: white;
          border: none;

          &:hover:not(:disabled) {
            background: linear-gradient(135deg, #2d2d2d 0%, #404040 100%);
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
          }

          &:active:not(:disabled) {
            transform: translateY(0);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
          }
        `;
    }
  }}

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(26, 26, 26, 0.2);
  }
`;

export const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 8px;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
