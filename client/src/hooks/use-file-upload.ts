// src/hooks/useFileUpload.ts
import { useState, useCallback } from 'react';

export interface UploadedFile {
  id: string;
  filename: string;
  storedName: string;
  url: string;
  mimetype: string;
  size: number;
  type: 'IMAGE' | 'DOCUMENT' | 'VIDEO' | 'AUDIO' | 'OTHER';
  status: 'UPLOADING' | 'PROCESSING' | 'READY' | 'ERROR';
  width?: number;
  height?: number;
  alt?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UseFileUploadOptions {
  multiple?: boolean;
  maxSize?: number; // в байтах
  allowedTypes?: string[];
  onSuccess?: (files: UploadedFile[]) => void;
  onError?: (error: string) => void;
  onProgress?: (progress: number) => void;
}

export interface UseFileUploadReturn {
  uploading: boolean;
  progress: number;
  uploadFile: (
    file: File,
    metadata?: { alt?: string; description?: string },
  ) => Promise<UploadedFile | null>;
  uploadFiles: (
    files: File[],
    metadata?: { alt?: string; description?: string },
  ) => Promise<UploadedFile[]>;
  abortUpload: () => void;
}

export const useFileUpload = (options: UseFileUploadOptions = {}): UseFileUploadReturn => {
  const {
    multiple = false,
    maxSize = 25 * 1024 * 1024, // 25MB по умолчанию
    allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
    onSuccess,
    onError,
    onProgress,
  } = options;

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  // Получение токена авторизации
  const getAuthToken = useCallback(() => {
    return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  }, []);

  // Валидация файла
  const validateFile = useCallback(
    (file: File): string | null => {
      if (!allowedTypes.includes(file.type)) {
        return `Неподдерживаемый тип файла. Разрешены: ${allowedTypes.join(', ')}`;
      }

      if (file.size > maxSize) {
        return `Файл слишком большой. Максимальный размер: ${(maxSize / 1024 / 1024).toFixed(1)}MB`;
      }

      return null;
    },
    [allowedTypes, maxSize],
  );

  // Загрузка одного файла
  const uploadFile = useCallback(
    async (
      file: File,
      metadata?: { alt?: string; description?: string },
    ): Promise<UploadedFile | null> => {
      const token = getAuthToken();
      if (!token) {
        const error = 'Необходима авторизация для загрузки файлов';
        onError?.(error);
        throw new Error(error);
      }

      const validationError = validateFile(file);
      if (validationError) {
        onError?.(validationError);
        throw new Error(validationError);
      }

      setUploading(true);
      setProgress(0);

      // Создаем AbortController для возможности отмены
      const controller = new AbortController();
      setAbortController(controller);

      try {
        const formData = new FormData();
        formData.append('file', file);

        if (metadata?.alt) formData.append('alt', metadata.alt);
        if (metadata?.description) formData.append('description', metadata.description);

        // Используем XMLHttpRequest для отслеживания прогресса
        const uploadPromise = new Promise<UploadedFile>((resolve, reject) => {
          const xhr = new XMLHttpRequest();

          // Отслеживание прогресса
          xhr.upload.addEventListener('progress', e => {
            if (e.lengthComputable) {
              const progressPercent = (e.loaded / e.total) * 100;
              setProgress(progressPercent);
              onProgress?.(progressPercent);
            }
          });

          xhr.onload = () => {
            try {
              if (xhr.status >= 200 && xhr.status < 300) {
                const response = JSON.parse(xhr.responseText);
                if (response.files && response.files.length > 0) {
                  resolve(response.files[0]);
                } else {
                  reject(new Error('Файл не был загружен'));
                }
              } else {
                const errorResponse = JSON.parse(xhr.responseText);
                reject(new Error(errorResponse.message || `HTTP error! status: ${xhr.status}`));
              }
            } catch (e) {
              reject(new Error('Ошибка парсинга ответа сервера'));
            }
          };

          xhr.onerror = () => {
            reject(new Error('Ошибка сети при загрузке файла'));
          };

          xhr.onabort = () => {
            reject(new Error('Загрузка отменена'));
          };

          // Обработка отмены через AbortController
          controller.signal.addEventListener('abort', () => {
            xhr.abort();
          });

          xhr.open('POST', '/api/upload/single');
          xhr.setRequestHeader('Authorization', `Bearer ${token}`);
          xhr.send(formData);
        });

        const uploadedFile = await uploadPromise;
        onSuccess?.(multiple ? [uploadedFile] : [uploadedFile]);
        return uploadedFile;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Ошибка загрузки файла';
        onError?.(errorMessage);
        throw error;
      } finally {
        setUploading(false);
        setProgress(0);
        setAbortController(null);
      }
    },
    [getAuthToken, validateFile, onSuccess, onError, onProgress, multiple],
  );

  // Загрузка нескольких файлов
  const uploadFiles = useCallback(
    async (
      files: File[],
      metadata?: { alt?: string; description?: string },
    ): Promise<UploadedFile[]> => {
      if (!multiple) {
        throw new Error('Множественная загрузка не разрешена');
      }

      const token = getAuthToken();
      if (!token) {
        const error = 'Необходима авторизация для загрузки файлов';
        onError?.(error);
        throw new Error(error);
      }

      // Валидируем все файлы
      for (const file of files) {
        const validationError = validateFile(file);
        if (validationError) {
          onError?.(validationError);
          throw new Error(validationError);
        }
      }

      setUploading(true);
      setProgress(0);

      const controller = new AbortController();
      setAbortController(controller);

      try {
        const formData = new FormData();

        files.forEach(file => {
          formData.append('files', file);
        });

        if (metadata?.alt) formData.append('alt', metadata.alt);
        if (metadata?.description) formData.append('description', metadata.description);

        const uploadPromise = new Promise<UploadedFile[]>((resolve, reject) => {
          const xhr = new XMLHttpRequest();

          xhr.upload.addEventListener('progress', e => {
            if (e.lengthComputable) {
              const progressPercent = (e.loaded / e.total) * 100;
              setProgress(progressPercent);
              onProgress?.(progressPercent);
            }
          });

          xhr.onload = () => {
            try {
              if (xhr.status >= 200 && xhr.status < 300) {
                const response = JSON.parse(xhr.responseText);
                if (response.files && response.files.length > 0) {
                  resolve(response.files);
                } else {
                  reject(new Error('Файлы не были загружены'));
                }
              } else {
                const errorResponse = JSON.parse(xhr.responseText);
                reject(new Error(errorResponse.message || `HTTP error! status: ${xhr.status}`));
              }
            } catch (e) {
              reject(new Error('Ошибка парсинга ответа сервера'));
            }
          };

          xhr.onerror = () => {
            reject(new Error('Ошибка сети при загрузке файлов'));
          };

          xhr.onabort = () => {
            reject(new Error('Загрузка отменена'));
          };

          controller.signal.addEventListener('abort', () => {
            xhr.abort();
          });

          xhr.open('POST', '/api/upload/multiple');
          xhr.setRequestHeader('Authorization', `Bearer ${token}`);
          xhr.send(formData);
        });

        const uploadedFiles = await uploadPromise;
        onSuccess?.(uploadedFiles);
        return uploadedFiles;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Ошибка загрузки файлов';
        onError?.(errorMessage);
        throw error;
      } finally {
        setUploading(false);
        setProgress(0);
        setAbortController(null);
      }
    },
    [multiple, getAuthToken, validateFile, onSuccess, onError, onProgress],
  );

  // Отмена загрузки
  const abortUpload = useCallback(() => {
    if (abortController) {
      abortController.abort();
      setAbortController(null);
      setUploading(false);
      setProgress(0);
    }
  }, [abortController]);

  return {
    uploading,
    progress,
    uploadFile,
    uploadFiles,
    abortUpload,
  };
};
