import styled from '@emotion/styled';

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

export const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
`;

export const ModalTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #111827;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  color: #6b7280;
  transition: all 0.2s;

  &:hover {
    background: #f3f4f6;
    color: #374151;
  }
`;

export const UploadArea = styled.div<{
  $dragging: boolean;
  $uploading: boolean;
}>`
  margin: 24px;
  border: 2px dashed ${props => (props.$dragging ? '#3b82f6' : '#d1d5db')};
  border-radius: 8px;
  padding: 40px 20px;
  text-align: center;
  cursor: ${props => (props.$uploading ? 'not-allowed' : 'pointer')};
  transition: all 0.2s;
  background: ${props => (props.$dragging ? '#eff6ff' : props.$uploading ? '#f9fafb' : 'white')};

  &:hover {
    border-color: ${props => (props.$uploading ? '#d1d5db' : '#3b82f6')};
    background: ${props => (props.$uploading ? '#f9fafb' : '#eff6ff')};
  }
`;

export const UploadContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

export const UploadIcon = styled.div<{ $isDragOver: boolean }>`
  color: ${props => (props.$isDragOver ? '#3b82f6' : '#6b7280')};
  transition: color 0.2s;
`;

export const UploadTitle = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: #111827;
`;

export const UploadSubtitle = styled.div`
  font-size: 14px;
  color: #6b7280;
`;

export const UploadHint = styled.div`
  font-size: 12px;
  color: #9ca3af;
  margin-top: 8px;

  p {
    margin: 2px 0;
  }
`;

export const HiddenFileInput = styled.input`
  display: none;
`;

export const PreviewsContainer = styled.div`
  margin: 0 24px 24px;
  max-height: 300px;
  overflow-y: auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
`;

export const PreviewItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #f9fafb;
`;

export const PreviewImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
`;

export const PreviewInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const PreviewActions = styled.div`
  display: flex;
  gap: 4px;
`;

export const ActionButton = styled.button<{ $variant: 'delete' | 'edit' }>`
  background: ${props => (props.$variant === 'delete' ? '#ef4444' : '#3b82f6')};
  color: white;
  border: none;
  border-radius: 6px;
  padding: 6px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${props => (props.$variant === 'delete' ? '#dc2626' : '#2563eb')};
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

export const ErrorMessage = styled.div`
  margin: 0 24px 16px;
  padding: 12px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 6px;
  color: #dc2626;
  font-size: 14px;
`;

export const ModalActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 20px 24px;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
`;

export const CancelButton = styled.button`
  padding: 8px 16px;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  color: #374151;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    background: #f9fafb;
    border-color: #9ca3af;
  }
`;

export const UploadButton = styled.button`
  padding: 8px 16px;
  background: #3b82f6;
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: #2563eb;
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;
