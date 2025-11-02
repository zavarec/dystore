// src/components/ProductForm/ProductImageUpload/ProductImageUpload.tsx
import React, { useState, useCallback, useRef, useEffect } from 'react';
import Image from 'next/image';
import { UploadSimple, Camera, Trash, WarningCircle, CircleNotch } from '@phosphor-icons/react';

import {
  UploadContainer,
  UploadContent,
  UploadIcon,
  UploadTitle,
  UploadSubtitle,
  UploadHint,
  ImagePreview,
  ImageOverlay,
  ActionButton,
  LoadingOverlay,
  LoadingContent,
  FileInfo,
  ErrorContent,
  ErrorIcon,
  ErrorTitle,
  ErrorSubtitle,
  RetryButton,
  HiddenInput,
  Tip,
} from './product-file-upload.style';
import UploadsService from '@/services/uploads.service';

// Типы для загруженного файла (совместимые с вашим API)
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
}

interface ProductImageUploadProps {
  value?: string; // ID текущего изображения
  currentImageUrl?: string; // URL текущего изображения
  onChange: (fileId?: string | null, file?: UploadedFile | undefined) => void;
  onError?: (error: string) => void;
  disabled?: boolean;
  className?: string;
  label?: string;

  size?: 'sm' | 'md' | 'lg';

  containerMinHeight?: number; // px
  previewMaxHeight?: number; // px
  previewWidth?: number; // px (рендер next/image width prop)
  previewHeight?: number; // px (рендер next/image height prop)
  borderRadius?: number; // px
}

const SIZE_PRESETS = {
  sm: {
    containerMinHeight: 140,
    previewMaxHeight: 180,
    previewWidth: 320,
    previewHeight: 240,
    borderRadius: 8,
  },
  md: {
    containerMinHeight: 200,
    previewMaxHeight: 320,
    previewWidth: 400,
    previewHeight: 300,
    borderRadius: 8,
  },
  lg: {
    containerMinHeight: 280,
    previewMaxHeight: 420,
    previewWidth: 640,
    previewHeight: 480,
    borderRadius: 10,
  },
} as const;

export const ProductImageUpload: React.FC<ProductImageUploadProps> = ({
  currentImageUrl,
  onChange,
  onError,
  disabled = false,
  className,
  size = 'md',
  containerMinHeight,
  previewMaxHeight,
  previewWidth,
  previewHeight,
  borderRadius,
  label = 'Главное изображение товара',
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [imageError, setImageError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const preset = SIZE_PRESETS[size];

  const ui = {
    containerMinHeight: containerMinHeight ?? preset.containerMinHeight,
    previewMaxHeight: previewMaxHeight ?? preset.previewMaxHeight,
    previewWidth: previewWidth ?? preset.previewWidth,
    previewHeight: previewHeight ?? preset.previewHeight,
    borderRadius: borderRadius ?? preset.borderRadius,
  };

  // // Получаем токен авторизации
  // const getAuthToken = useCallback(() => {
  //   return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  // }, []);

  const viaProxy = (url?: string) =>
    !url ? '' : url.startsWith('/api/proxy/') ? url : url.replace(/^\/api\//, '/api/proxy/');

  const builtUrl = uploadedFile?.url
    ? viaProxy(uploadedFile.url)
    : uploadedFile?.storedName
      ? viaProxy(`/api/upload/files/${encodeURIComponent(uploadedFile.storedName)}/view`)
      : undefined;

  // Валидация файла
  const validateFile = useCallback((file: File): string | null => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      return 'Поддерживаются только изображения (JPG, PNG, GIF, WebP)';
    }

    if (file.size > maxSize) {
      return 'Размер файла не должен превышать 10MB';
    }

    return null;
  }, []);

  // Загрузка файла
  const uploadFile = useCallback(
    async (file: File) => {
      const validationError = validateFile(file);
      if (validationError) {
        onError?.(validationError);
        return;
      }

      setUploading(true);
      setImageError(false);

      try {
        const { files } = await UploadsService.uploadSingle(file, {
          alt: `${label} - ${file.name}`,
          description: `Изображение товара ${label}`,
        });

        // if (productId && files && files.length > 0) {
        //   await UploadsService.setMainImage(productId, files[0]?.id || '');
        // }

        if (files && files.length > 0) {
          const uploadedFile = files[0];
          setUploadedFile(uploadedFile || null);
          onChange(uploadedFile?.id || null, uploadedFile);
        } else {
          throw new Error('Файл не был загружен');
        }
      } catch (error) {
        console.error('Upload error:', error);
        onError?.(error instanceof Error ? error.message : 'Ошибка загрузки файла');
      } finally {
        setUploading(false);
      }
    },
    [onChange, onError, validateFile, label],
  );

  // Обработка выбора файла
  const handleFileSelect = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;
      uploadFile(files[0] as File);
    },
    [uploadFile],
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

  // Удаление изображения
  const handleRemove = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setUploadedFile(null);
      setImageError(false);
      onChange(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [onChange],
  );

  // Обработка ошибки загрузки изображения
  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  // Определяем текущее изображение для показа
  const displayImageUrl = builtUrl || currentImageUrl;
  const hasImage = !!displayImageUrl && !imageError;

  useEffect(() => {
    if (displayImageUrl) setImageError(false);
  }, [displayImageUrl, currentImageUrl, builtUrl, hasImage]);

  return (
    <div className={className}>
      {/* Скрытый input для выбора файлов */}
      <HiddenInput
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={e => handleFileSelect(e.target.files)}
        disabled={disabled || uploading}
      />

      {/* Основная область загрузки */}
      <UploadContainer
        $isDragOver={dragOver}
        $hasImage={hasImage}
        $disabled={disabled}
        $minHeight={ui.containerMinHeight}
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        style={{ minHeight: containerMinHeight ?? (size === 'sm' ? 100 : 200) }}
      >
        {uploading && (
          <LoadingOverlay>
            <LoadingContent>
              <CircleNotch size={24} className="animate-spin" />
              <span>Загрузка...</span>
            </LoadingContent>
          </LoadingOverlay>
        )}

        {hasImage ? (
          // Превью изображения
          <ImagePreview $radius={ui.borderRadius}>
            <Image
              unoptimized
              src={displayImageUrl}
              alt={label}
              width={ui.previewWidth}
              height={ui.previewHeight}
              style={{
                width: ui.previewWidth ?? '100%',
                height: 'auto',
                maxHeight: ui.previewMaxHeight,
                objectFit: 'contain',
                borderRadius: ui.borderRadius,
              }}
              onLoad={() => setImageError(false)} // сбросить, если раньше была ошибка
              onError={handleImageError}
            />

            {/* Оверлей с действиями */}
            <ImageOverlay className="image-overlay">
              <ActionButton
                type="button"
                $variant="edit"
                onClick={handleClick}
                disabled={disabled || uploading}
                title="Заменить изображение"
              >
                <Camera size={20} />
              </ActionButton>
              <ActionButton
                type="button"
                $variant="delete"
                onClick={handleRemove}
                disabled={disabled || uploading}
                title="Удалить изображение"
              >
                <Trash size={20} />
              </ActionButton>
            </ImageOverlay>

            {/* Информация о файле */}
            {uploadedFile && (
              <FileInfo>
                {uploadedFile.filename} ({(uploadedFile.size / 1024 / 1024).toFixed(1)} MB)
              </FileInfo>
            )}
          </ImagePreview>
        ) : imageError ? (
          // Ошибка загрузки изображения
          <ErrorContent>
            <ErrorIcon>
              <WarningCircle size={48} />
            </ErrorIcon>
            <ErrorTitle>Ошибка загрузки изображения</ErrorTitle>
            <ErrorSubtitle>Проверьте ссылку или загрузите новое изображение</ErrorSubtitle>
            <RetryButton type="button" onClick={handleClick} disabled={disabled || uploading}>
              Загрузить новое
            </RetryButton>
          </ErrorContent>
        ) : (
          // Область для загрузки (пустое состояние)
          <UploadContent>
            <UploadIcon $isDragOver={dragOver}>
              <UploadSimple />
            </UploadIcon>
            {size !== 'sm' && (
              <>
                <UploadTitle>
                  {dragOver ? 'Отпустите для загрузки' : `Загрузите ${label.toLowerCase()}`}
                </UploadTitle>
                <UploadSubtitle>Перетащите изображение сюда или нажмите для выбора</UploadSubtitle>
                <UploadHint>
                  <p>Поддерживаются: JPG, PNG, GIF, WebP</p>
                  <p>Максимальный размер: 10MB</p>
                </UploadHint>
              </>
            )}
          </UploadContent>
        )}
      </UploadContainer>

      {/* Дополнительная информация */}
      {size !== 'sm' && <Tip>💡 Рекомендуемые размеры: 1200x1200px для лучшего качества</Tip>}
    </div>
  );
};
