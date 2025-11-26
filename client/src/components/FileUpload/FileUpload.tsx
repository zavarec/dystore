import React, { useState, useCallback, useRef } from 'react';
import { UploadSimple, Trash, WarningCircle, CircleNotch } from '@phosphor-icons/react';
import {
  Wrapper,
  Dropzone,
  UploadButton,
  HiddenFileInput,
  PreviewsWrap,
  PreviewItem,
  PreviewImg,
  PreviewMeta,
  ProgressBar,
  ProgressFill,
  ErrorBox,
} from './style';
import UploadsService from '@/services/uploads.service';

export interface UploadedFile {
  id: string;
  filename: string;
  url: string;
  mimetype: string;
  size: number;
  type: 'IMAGE' | 'DOCUMENT' | 'VIDEO' | 'AUDIO' | 'OTHER';
  alt?: string;
  description?: string;
  storedName?: string;
  status?: 'PENDING' | 'PROCESSING' | 'READY' | 'ERROR';
  createdAt?: string;
}

interface FileUploadProps {
  multiple?: boolean;
  accept?: string[];
  label?: string;
  onUploaded?: (files: UploadedFile[]) => void;
  onError?: (error: string) => void;
  disabled?: boolean;
  className?: string;
  maxFiles?: number;
  maxSize?: number; // в байтах
}

export const FileUpload: React.FC<FileUploadProps> = ({
  multiple = false,
  accept = ['image/*'],
  label = 'Выберите файлы',
  onUploaded,
  onError,
  disabled = false,
  className,
  maxFiles = 10,
  maxSize = 25 * 1024 * 1024, // 25MB по умолчанию
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
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
        onError?.(errorMsg);
        return;
      }

      // Валидируем каждый файл
      for (const file of files) {
        const validationError = validateFile(file);
        if (validationError) {
          setError(validationError);
          onError?.(validationError);
          return;
        }
      }

      setUploading(true);
      setError(null);
      setUploadProgress(0);

      try {
        const { files: uploadedFilesData } = await UploadsService.uploadMultiple(files, {
          alt: files.map(f => f.name).join(', '),
          description: `Загружено ${files.length} файлов`,
        });

        if (uploadedFilesData && uploadedFilesData.length > 0) {
          const newFiles = [...uploadedFiles, ...uploadedFilesData];
          setUploadedFiles(newFiles);
          onUploaded?.(uploadedFilesData);
        } else {
          throw new Error('Файлы не были загружены');
        }
      } catch (error) {
        console.error('Upload error:', error);
        const errorMsg = error instanceof Error ? error.message : 'Ошибка загрузки файлов';
        setError(errorMsg);
        onError?.(errorMsg);
      } finally {
        setUploading(false);
        setUploadProgress(0);
      }
    },
    [uploadedFiles, maxFiles, validateFile, onUploaded, onError],
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
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (disabled || uploading) return;
      handleFileSelect(e.dataTransfer.files);
    },
    [handleFileSelect, disabled, uploading],
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled && !uploading) {
        setDragOver(true);
      }
    },
    [disabled, uploading],
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  // Обработка клика по области
  const handleClick = useCallback(() => {
    if (disabled || uploading) return;
    fileInputRef.current?.click();
  }, [disabled, uploading]);

  // Удаление файла
  const handleRemove = useCallback((fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  }, []);

  // Очистка ошибки
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const acceptString = accept.join(',');

  return (
    <Wrapper className={className}>
      {/* Скрытый input для выбора файлов */}
      <HiddenFileInput
        ref={fileInputRef}
        type="file"
        accept={acceptString}
        multiple={multiple}
        onChange={e => handleFileSelect(e.target.files)}
        disabled={disabled || uploading}
      />

      {/* Область загрузки */}
      <Dropzone
        $dragging={dragOver}
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {uploading ? (
          <div style={{ textAlign: 'center' }}>
            <CircleNotch size={32} className="animate-spin" style={{ marginBottom: 16 }} />
            <div>Загрузка файлов...</div>
            <ProgressBar>
              <ProgressFill $progress={uploadProgress} />
            </ProgressBar>
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <UploadSimple size={32} style={{ marginBottom: 16 }} />
            <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 8 }}>
              {dragOver ? 'Отпустите для загрузки' : label}
            </div>
            <div style={{ fontSize: 14, color: '#666', marginBottom: 16 }}>
              {dragOver ? 'Файлы будут загружены' : 'Перетащите файлы сюда или нажмите для выбора'}
            </div>
            <UploadButton as="div" style={{ pointerEvents: 'none' }}>
              Выбрать файлы
            </UploadButton>
            <div style={{ fontSize: 12, color: '#999', marginTop: 8 }}>
              Поддерживаемые форматы: {accept.join(', ')}
              <br />
              Максимальный размер: {Math.round(maxSize / 1024 / 1024)}MB
              <br />
              Максимум файлов: {maxFiles}
            </div>
          </div>
        )}
      </Dropzone>

      {/* Ошибка */}
      {error && (
        <ErrorBox>
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
        </ErrorBox>
      )}

      {/* Превью загруженных файлов */}
      {uploadedFiles.length > 0 && (
        <PreviewsWrap>
          {uploadedFiles.map(file => (
            <PreviewItem key={file.id}>
              {file.mimetype.startsWith('image/') ? (
                <PreviewImg
                  src={file.url}
                  alt={file.alt || file.filename}
                  onError={e => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <div
                  style={{
                    height: 100,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 24,
                    background: '#f5f5f5',
                  }}
                >
                  📄
                </div>
              )}
              <PreviewMeta>
                <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 4 }}>
                  {file.filename}
                </div>
                <div style={{ fontSize: 10, color: '#666' }}>
                  {(file.size / 1024 / 1024).toFixed(1)} MB
                </div>
                <button
                  onClick={() => handleRemove(file.id)}
                  style={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    background: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: 20,
                    height: 20,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: 12,
                  }}
                >
                  <Trash size={12} />
                </button>
              </PreviewMeta>
            </PreviewItem>
          ))}
        </PreviewsWrap>
      )}
    </Wrapper>
  );
};

export default FileUpload;
