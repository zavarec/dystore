export enum FileType {
  IMAGE = 'IMAGE',
  DOCUMENT = 'DOCUMENT',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  OTHER = 'OTHER',
}

export enum FileStatus {
  UPLOADING = 'UPLOADING',
  PROCESSING = 'PROCESSING',
  READY = 'READY',
  ERROR = 'ERROR',
}

export interface UploadedFile {
  id: string;
  filename: string;
  storedName: string;
  url: string;
  mimetype: string;
  size: number;
  type: FileType;
  status: FileStatus;
  width?: number;
  height?: number;
  alt?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UploadResponse {
  files: UploadedFile[];
  message: string;
}

export interface FileListResponse {
  files: UploadedFile[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}


