import React, { useState, useCallback, useRef } from 'react';
import { UploadSimple, Trash, WarningCircle, CircleNotch, X } from '@phosphor-icons/react';
import { toast } from 'react-toastify';
import UploadsService from '@/services/uploads.service';
import { UploadedFile } from '@/types/upload';
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  CloseButton,
  UploadArea,
  UploadContent,
  UploadIcon,
  UploadTitle,
  UploadSubtitle,
  UploadHint,
  HiddenFileInput,
  PreviewsContainer,
  PreviewItem,
  PreviewImage,
  PreviewInfo,
  PreviewActions,
  ActionButton,
  ErrorMessage,
  ModalActions,
  CancelButton,
  UploadButton,
} from './FileUploadModal.style';

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploaded: (files: UploadedFile[]) => void;
  accept?: string[];
  maxFiles?: number;
  maxSize?: number; // в байтах
}

export const FileUploadModal: React.FC<FileUploadModalProps> = ({
  isOpen,
  onClose,
  onUploaded,
  accept = ['image/*', 'application/pdf', 'video/*', 'audio/*'],
  maxFiles = 10,
  maxSize = 25 * 1024 * 1024, // 25MB по умолчанию
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Валидация файла
  const validateFile = useCallback(
    (file: File): string | null => {
      if (file.size > maxSize) {
        return `Размер файла не должен превышать ${Math.round(maxSize / 1024 / 1024)}MB`;
      }

      // Проверяем MIME тип
      const isValidType = accept.some(type => {
        if (type.endsWith('/*')) {
          const category = type.split('/')[0];
          return file.type.startsWith(category + '/');
        }
        return file.type === type;
      });

      if (!isValidType) {
        return `Неподдерживаемый тип файла. Разрешены: ${accept.join(', ')}`;
      }

      return null;
    },
    [accept, maxSize],
  );

  // Загрузка файлов
  const uploadFiles = useCallback(
    async (files: File[]) => {
      if (files.length === 0) return;

      // Проверяем лимит файлов
      if (uploadedFiles.length + files.length > maxFiles) {
        const errorMsg = `Максимальное количество файлов: ${maxFiles}`;
        setError(errorMsg);
        toast.error(errorMsg);
        return;
      }

      // Валидируем каждый файл
      for (const file of files) {
        const validationError = validateFile(file);
        if (validationError) {
          setError(validationError);
          toast.error(validationError);
          return;
        }
      }

      setUploading(true);
      setError(null);

      try {
        const { files: uploadedFilesData } = await UploadsService.uploadMultiple(files);

        if (uploadedFilesData && uploadedFilesData.length > 0) {
          const newFiles = [...uploadedFiles, ...uploadedFilesData];
          setUploadedFiles(newFiles);
          toast.success(`Загружено ${uploadedFilesData.length} файлов`);
        } else {
          throw new Error('Файлы не были загружены');
        }
      } catch (error) {
        console.error('Upload error:', error);
        const errorMsg = error instanceof Error ? error.message : 'Ошибка загрузки файлов';
        setError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setUploading(false);
      }
    },
    [uploadedFiles, maxFiles, validateFile],
  );

  // Обработка выбора файлов
  const handleFileSelect = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;
      const fileArray = Array.from(files);
      uploadFiles(fileArray);
    },
    [uploadFiles],
  );

  // Drag & Drop обработчики
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragOver(false);
      if (uploading) return;
      handleFileSelect(e.dataTransfer.files);
    },
    [handleFileSelect, uploading],
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (!uploading) {
        setDragOver(true);
      }
    },
    [uploading],
  );

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  // Обработка клика по области
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (uploading) return;
      fileInputRef.current?.click();
    },
    [uploading],
  );

  // Удаление файла
  const handleRemove = useCallback((fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  }, []);

  // Очистка ошибки
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Обработка закрытия модального окна
  const handleClose = useCallback(() => {
    if (uploadedFiles.length > 0) {
      onUploaded(uploadedFiles);
    }
    setUploadedFiles([]);
    setError(null);
    onClose();
  }, [uploadedFiles, onUploaded, onClose]);

  // Обработка отмены
  const handleCancel = useCallback(() => {
    setUploadedFiles([]);
    setError(null);
    onClose();
  }, [onClose]);

  const getFileIcon = (mime: string): string => {
    if (mime.startsWith('image/')) return '🖼️';
    if (mime.startsWith('video/')) return '🎬';
    if (mime.startsWith('audio/')) return '🎵';
    if (mime === 'application/pdf') return '📕';
    if (mime.includes('zip') || mime.includes('tar')) return '🗜️';
    return '📄';
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={handleCancel}>
      <ModalContent onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Загрузка файлов</ModalTitle>
          <CloseButton onClick={handleCancel}>
            <X size={20} />
          </CloseButton>
        </ModalHeader>

        {/* Скрытый input для выбора файлов */}
        <HiddenFileInput
          ref={fileInputRef}
          type="file"
          accept={accept.join(',')}
          multiple
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileSelect(e.target.files)}
          disabled={uploading}
        />

        {/* Область загрузки */}
        <UploadArea
          $dragging={dragOver}
          $uploading={uploading}
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {uploading ? (
            <UploadContent>
              <CircleNotch size={32} className="animate-spin" />
              <UploadTitle>Загрузка файлов...</UploadTitle>
            </UploadContent>
          ) : (
            <UploadContent>
              <UploadIcon $isDragOver={dragOver}>
                <UploadSimple size={32} />
              </UploadIcon>
              <UploadTitle>
                {dragOver ? 'Отпустите для загрузки' : 'Выберите файлы для загрузки'}
              </UploadTitle>
              <UploadSubtitle>
                {dragOver
                  ? 'Файлы будут загружены'
                  : 'Перетащите файлы сюда или нажмите для выбора'}
              </UploadSubtitle>
              <UploadHint>
                <p>Поддерживаемые форматы: {accept.join(', ')}</p>
                <p>Максимальный размер: {Math.round(maxSize / 1024 / 1024)}MB</p>
                <p>Максимум файлов: {maxFiles}</p>
              </UploadHint>
            </UploadContent>
          )}
        </UploadArea>

        {/* Ошибка */}
        {error && (
          <ErrorMessage>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <WarningCircle size={16} />
              <span>{error}</span>
              <button
                onClick={clearError}
                style={{
                  marginLeft: 'auto',
                  background: 'none',
                  border: 'none',
                  color: '#a8071a',
                  cursor: 'pointer',
                  fontSize: 16,
                }}
              >
                ×
              </button>
            </div>
          </ErrorMessage>
        )}

        {/* Превью загруженных файлов */}
        {uploadedFiles.length > 0 && (
          <PreviewsContainer>
            {uploadedFiles.map(file => (
              <PreviewItem key={file.id}>
                {file.mimetype.startsWith('image/') ? (
                  <PreviewImage
                    src={file.url}
                    alt={file.alt || file.filename}
                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 60,
                      height: 60,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 24,
                      background: '#f5f5f5',
                      borderRadius: 8,
                    }}
                  >
                    {getFileIcon(file.mimetype)}
                  </div>
                )}
                <PreviewInfo>
                  <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>
                    {file.filename}
                  </div>
                  <div style={{ fontSize: 12, color: '#666' }}>{formatFileSize(file.size)}</div>
                </PreviewInfo>
                <PreviewActions>
                  <ActionButton
                    $variant="delete"
                    onClick={() => handleRemove(file.id)}
                    title="Удалить файл"
                  >
                    <Trash size={16} />
                  </ActionButton>
                </PreviewActions>
              </PreviewItem>
            ))}
          </PreviewsContainer>
        )}

        {/* Действия */}
        <ModalActions>
          <CancelButton onClick={handleCancel}>Отмена</CancelButton>
          <UploadButton onClick={handleClose} disabled={uploadedFiles.length === 0}>
            Загрузить {uploadedFiles.length > 0 && `(${uploadedFiles.length})`}
          </UploadButton>
        </ModalActions>
      </ModalContent>
    </ModalOverlay>
  );
};
