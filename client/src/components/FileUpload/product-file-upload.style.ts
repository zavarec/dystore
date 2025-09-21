import styled from '@emotion/styled';

// Стили с использованием styled-components (в стиле вашего проекта)
export const UploadContainer = styled.div<{
  $isDragOver: boolean;
  $hasImage: boolean;
  $disabled: boolean;
  $minHeight: number;
}>`
  position: relative;
  border: 2px dashed
    ${props => (props.$isDragOver ? '#3b82f6' : props.$hasImage ? '#e5e7eb' : '#d1d5db')};
  border-radius: 8px;
  transition: all 0.2s ease;
  cursor: ${props => (props.$disabled ? 'not-allowed' : 'pointer')};
  background: ${props => (props.$isDragOver ? '#eff6ff' : props.$hasImage ? '#f9fafb' : '#ffffff')};
  opacity: ${props => (props.$disabled ? 0.5 : 1)};
  min-height: ${props => (props.$hasImage ? 'auto' : `${props.$minHeight}px`)};

  &:hover {
    border-color: ${props => (!props.$disabled && !props.$hasImage ? '#9ca3af' : '')};
    background: ${props => (!props.$disabled && !props.$hasImage ? '#f9fafb' : '')};
  }
`;

export const UploadContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px;
  color: #6b7280;
  text-align: center;
`;

export const UploadIcon = styled.div<{ $isDragOver: boolean }>`
  width: 64px;
  height: 64px;
  margin-bottom: 16px;
  border-radius: 50%;
  background: ${props => (props.$isDragOver ? '#dbeafe' : '#f3f4f6')};
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 32px;
    height: 32px;
    color: ${props => (props.$isDragOver ? '#3b82f6' : '#9ca3af')};
  }
`;

export const UploadTitle = styled.h3`
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 8px;
  color: #111827;
`;

export const UploadSubtitle = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 16px;
`;

export const UploadHint = styled.div`
  font-size: 12px;
  color: #9ca3af;

  p {
    margin: 2px 0;
  }
`;

export const ImagePreview = styled.div<{ $radius: number }>`
  position: relative;
  border-radius: ${p => p.$radius}px;

  &:hover .image-overlay {
    opacity: 1;
  }
`;

export const ImageOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.2s ease;
  border-radius: 8px;
`;

export const ActionButton = styled.button<{ $variant: 'edit' | 'delete' }>`
  background: ${props => (props.$variant === 'delete' ? '#ef4444' : '#ffffff')};
  color: ${props => (props.$variant === 'delete' ? '#ffffff' : '#374151')};
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => (props.$variant === 'delete' ? '#dc2626' : '#f3f4f6')};
    transform: scale(1.05);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

export const LoadingOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  z-index: 10;
`;

export const LoadingContent = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #3b82f6;
  font-weight: 500;
`;

export const FileInfo = styled.div`
  position: absolute;
  bottom: 8px;
  left: 8px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  max-width: calc(100% - 16px);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ErrorContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px;
  color: #ef4444;
  text-align: center;
`;

export const ErrorIcon = styled.div`
  width: 48px;
  height: 48px;
  margin-bottom: 16px;
  color: #f87171;
`;

export const ErrorTitle = styled.p`
  font-weight: 500;
  margin-bottom: 4px;
`;

export const ErrorSubtitle = styled.p`
  font-size: 12px;
  color: #9ca3af;
  margin-bottom: 16px;
`;

export const RetryButton = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #2563eb;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const HiddenInput = styled.input`
  display: none;
`;

export const Tip = styled.div`
  margin-top: 8px;
  font-size: 12px;
  color: #6b7280;
`;
