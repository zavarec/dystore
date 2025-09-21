// src/upload/upload.service.ts
import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../database/prisma.service";
import { FileType, FileStatus, File } from "@prisma/client";
import { FileFilterDto } from "./dto/file-filter.dto";
import { UpdateFileDto } from "./dto/update-file.dto";
import { unlinkSync } from "fs";
import { randomUUID } from "crypto";
import { join, extname } from "path";
import axios from "axios";
import { S3Service } from "./s3.service";

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);
  private readonly uploadPath: string;
  private readonly baseUrl: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly s3Service: S3Service,
  ) {
    this.uploadPath = this.configService.get<string>(
      "UPLOAD_PATH",
      "./uploads",
    );
    this.baseUrl = this.configService.get<string>(
      "BASE_URL",
      "http://localhost:3000",
    );
  }

  /**
   * Сохранение загруженных файлов в БД (упрощенная версия)
   */
  async saveFiles(
    files: Express.Multer.File[],
    userId: string,
    metadata?: { alt?: string; description?: string; type?: FileType },
  ): Promise<File[]> {
    this.logger.log(`Saving ${files.length} files for user ${userId}`);
    const savedFiles: File[] = [];
    console.log(files, "FILES");
    console.log(metadata, "METADATA");

    for (const file of files) {
      try {
        this.logger.log(`Processing file: ${file.originalname}`);

        const fileType = this.determineFileType(file.mimetype);
        let storedName =
          file.filename && file.filename.trim().length > 0
            ? file.filename
            : `${randomUUID()}${extname(file.originalname)}`;
        let resolvedPath = file.path ? file.path : join(this.uploadPath, storedName);
        let url = this.generateFileUrl(storedName);

        if (!file.path) {
          if (!file.buffer) {
            throw new BadRequestException(
              `Не удалось сохранить файл ${file.originalname}: отсутствует буфер`,
            );
          }

          const { key, url: uploadedUrl } = await this.s3Service.uploadFile(file);
          storedName = key;
          resolvedPath = key;
          url = uploadedUrl;
        }

        this.logger.log(`File type determined: ${fileType}, URL: ${url}`);

        const fileRecord = await this.prisma.file.create({
          data: {
            filename: file.originalname,
            storedName,
            path: resolvedPath,
            url,
            mimetype: file.mimetype,
            size: file.size,
            type: metadata?.type || fileType,
            status: FileStatus.READY,
            alt: metadata?.alt || null,
            description: metadata?.description || null,
            uploadedById: userId,
          },
        });

        savedFiles.push(fileRecord);
        this.logger.log(
          `File saved to DB: ${fileRecord.id} - ${fileRecord.filename}`,
        );
      } catch (error) {
        this.logger.error(`Failed to save file ${file.originalname}:`, error);
        throw new BadRequestException(
          `Failed to save file ${file.originalname}: ${error.message}`,
        );
      }
    }

    return savedFiles;
  }

  /**
   * Определение типа файла по MIME-type
   */
  private determineFileType(mimetype: string): FileType {
    this.logger.log(`Determining file type for mimetype: ${mimetype}`);

    if (mimetype.startsWith("image/")) return FileType.IMAGE;
    if (mimetype.startsWith("video/")) return FileType.VIDEO;
    if (mimetype.startsWith("audio/")) return FileType.AUDIO;
    if (
      mimetype.includes("pdf") ||
      mimetype.includes("document") ||
      mimetype.includes("text")
    ) {
      return FileType.DOCUMENT;
    }
    return FileType.OTHER;
  }

  /**
   * Генерация публичного URL файла
   */
  private generateFileUrl(storedName: string): string {
    return `/api/upload/files/${storedName}/view`;
  }

  /**
   * Получение файла по ID
   */
  async findById(id: string): Promise<File | null> {
    this.logger.log(`Finding file by ID: ${id}`);

    try {
      return await this.prisma.file.findUnique({
        where: { id },
        include: {
          uploadedBy: {
            select: { id: true, name: true, email: true },
          },
        },
      });
    } catch (error) {
      this.logger.error(`Error finding file ${id}:`, error);
      throw error;
    }
  }

  /**
   * Получение файлов с фильтрацией и пагинацией
   */
  async findMany(
    filters: FileFilterDto,
    userId?: string,
  ): Promise<{
    files: File[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    this.logger.log(
      `Finding files with filters: ${JSON.stringify(filters)}, userId: ${userId}`,
    );

    const { page = 1, limit = 20, type, status, mimetype } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (userId) where.uploadedById = userId;
    if (type) where.type = type;
    if (status) where.status = status;
    if (mimetype) where.mimetype = { contains: mimetype };

    try {
      const [files, total] = await Promise.all([
        this.prisma.file.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: "desc" },
          include: {
            uploadedBy: {
              select: { id: true, name: true, email: true },
            },
          },
        }),
        this.prisma.file.count({ where }),
      ]);

      return {
        files,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      this.logger.error(`Error finding files:`, error);
      throw error;
    }
  }

  /**
   * Обновление метаданных файла
   */
  async updateFile(
    id: string,
    updateData: UpdateFileDto,
    userId?: string,
  ): Promise<File> {
    this.logger.log(`Updating file ${id} by user ${userId}`);

    const file = await this.findById(id);

    if (!file) {
      throw new NotFoundException("Файл не найден");
    }

    // Проверяем права доступа (только владелец может редактировать)
    if (userId && file.uploadedById !== userId) {
      throw new BadRequestException("Нет прав для редактирования этого файла");
    }

    try {
      return await this.prisma.file.update({
        where: { id },
        data: updateData,
      });
    } catch (error) {
      this.logger.error(`Error updating file ${id}:`, error);
      throw error;
    }
  }

  /**
   * Получение статистики файлов
   */
  async getFileStats(userId?: string): Promise<{
    total: number;
    byType: Record<FileType, number>;
    totalSize: number;
    avgSize: number;
  }> {
    this.logger.log(`Getting file stats for user: ${userId}`);

    const where = userId ? { uploadedById: userId } : {};

    try {
      const [stats, totalSize] = await Promise.all([
        this.prisma.file.groupBy({
          by: ["type"],
          where,
          _count: { type: true },
        }),
        this.prisma.file.aggregate({
          where,
          _sum: { size: true },
          _avg: { size: true },
          _count: true,
        }),
      ]);

      const byType = stats.reduce(
        (acc, stat) => {
          acc[stat.type] = stat._count.type;
          return acc;
        },
        {} as Record<FileType, number>,
      );

      return {
        total: totalSize._count,
        byType,
        totalSize: totalSize._sum.size || 0,
        avgSize: Math.round(totalSize._avg.size || 0),
      };
    } catch (error) {
      this.logger.error(`Error getting file stats:`, error);
      throw error;
    }
  }

  getUploadPath() {
    return this.uploadPath;
  }

  async findByStoredName(storedName: string) {
    return this.prisma.file.findFirst({ where: { storedName } });
  }

  async removeFile(id: string, userId: string) {
    const file = await this.findById(id);
    if (!file) throw new NotFoundException("Файл не найден");
    if (file.uploadedById !== userId) {
      throw new BadRequestException("Нет прав на удаление файла");
    }

    // Проверка на связи (например, с продуктом/категорией/медиа)
    const links = await this.prisma.productMedia.count({
      where: { fileId: id },
    });
    const usedAsMain = await this.prisma.product.count({
      where: { mainImageId: id },
    });
    const usedAsDim = await this.prisma.product.count({
      where: { dimensionsImageId: id },
    });
    const usedInCategory = await this.prisma.category.count({
      where: { imageId: id },
    });
    if (links + usedAsMain + usedAsDim + usedInCategory > 0) {
      throw new BadRequestException(
        "Файл используется сущностями — отвяжите перед удалением",
      );
    }

    // Удаляем физический файл
    try {
      unlinkSync(file.path);
    } catch (e) {
      this.logger.warn(`Файл на диске не удалён: ${file.path}`);
    }

    await this.prisma.file.delete({ where: { id } });
    return { success: true };
  }

  async saveExternalFile(input: {
    filename: string;
    storedName: string; // S3 key
    path: string; // можно тот же key
    url: string; // публичная ссылка
    mimetype: string;
    size: number;
    uploadedById: string;
  }) {
    return this.prisma.file.create({
      data: {
        filename: input.filename,
        storedName: input.storedName,
        path: input.path,
        url: input.url,
        mimetype: input.mimetype,
        size: input.size,
        type: this.determineFileType(input.mimetype), // твой метод
        status: "READY",
        uploadedById: input.uploadedById,
      },
    });
  }
}
