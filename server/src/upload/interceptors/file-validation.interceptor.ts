

// src/upload/interceptors/file-validation.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class FileValidationInterceptor implements NestInterceptor {
  constructor(
    private readonly maxSize: number = 10 * 1024 * 1024, // 10MB
    private readonly allowedTypes: string[] = [
      'image/jpeg',
      'image/png', 
      'image/gif',
      'image/webp',
      'application/pdf',
    ]
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const files = request.files || [request.file];

    if (!files || files.length === 0) {
      throw new BadRequestException('Файлы не найдены');
    }

    // Валидация каждого файла
    for (const file of files) {
      if (!file) continue;

      // Проверка размера
      if (file.size > this.maxSize) {
        throw new BadRequestException(
          `Файл ${file.originalname} превышает максимальный размер ${this.maxSize / 1024 / 1024}MB`
        );
      }

      // Проверка типа
      if (!this.allowedTypes.includes(file.mimetype)) {
        throw new BadRequestException(
          `Тип файла ${file.mimetype} не поддерживается`
        );
      }

      // Проверка имени файла на безопасность
      if (this.hasUnsafeCharacters(file.originalname)) {
        throw new BadRequestException(
          `Небезопасное имя файла: ${file.originalname}`
        );
      }
    }

    return next.handle();
  }

  private hasUnsafeCharacters(filename: string): boolean {
    // Проверка на небезопасные символы
    const unsafeChars = /[<>:"/\\|?*\x00-\x1f]/;
    return unsafeChars.test(filename);
  }
}