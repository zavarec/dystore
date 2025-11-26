import {
  Controller,
  Post,
  Get,
  Delete,
  Patch,
  Param,
  Query,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  ParseUUIDPipe,
  Res,
  HttpException,
  HttpStatus,
  BadRequestException,
  Logger,
  ValidationPipe,
  UsePipes,
} from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
  ApiParam,
  ApiQuery,
} from "@nestjs/swagger";
import { Response } from "express";
import { UploadService } from "./upload.service";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { FileType, User } from "@prisma/client";
import { UploadFileDto } from "./dto/upload-file.dto";
import { FileFilterDto } from "./dto/file-filter.dto";
import { UpdateFileDto } from "./dto/update-file.dto";
import { FileResponseDto } from "./dto/file-response.dto";
import { UploadResponseDto } from "./dto/upload-response.dto";
import { createReadStream, existsSync, statSync } from "fs";
import { join } from "path";
import sharp from "sharp";
import { S3Service } from "./s3.service";
import * as multer from "multer";
import { Public } from "src/common/decorators/public.decorator";

@ApiTags("Upload")
@Controller("upload")
export class UploadController {
  private readonly logger = new Logger(UploadController.name);

  constructor(
    private readonly uploadService: UploadService,
    private readonly s3Service: S3Service,
  ) {}

  /**
   * Тест эндпоинт для проверки работы
   */
  @ApiOperation({ summary: "Тест эндпоинт" })
  @Get("test")
  async test() {
    return { message: "Upload module is working!" };
  }

  /**
   * Загрузка одного файла (БЕЗ дополнительных interceptor'ов)
   */
  @ApiOperation({ summary: "Загрузить один файл" })
  @ApiResponse({
    status: 201,
    description: "Файл загружен успешно",
    type: UploadResponseDto,
  })
  @ApiResponse({ status: 400, description: "Ошибка валидации файла" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
        },
        alt: {
          type: "string",
          description: "Альтернативный текст",
        },
        description: {
          type: "string",
          description: "Описание файла",
        },
      },
    },
  })
  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  // @UseInterceptors(FileInterceptor("file"))
  // @UsePipes(
  //   new ValidationPipe({
  //     whitelist: true,
  //     forbidNonWhitelisted: false,
  //     transform: true,
  //   }),
  // )
  // @Post("single")
  // async uploadSingle(
  //   @UploadedFile() file: Express.Multer.File,
  //   @Body() metadata: UploadFileDto,
  //   @CurrentUser() user: User,
  // ): Promise<UploadResponseDto> {
  //   this.logger.log(`Upload attempt by user ${user.id}`);
  //   this.logger.log(
  //     `BODY KEYS: ${Object.keys((metadata as any) ?? {}).join(", ")}`,
  //   );

  //   // Детальная диагностика
  //   this.logger.log(`Received file: ${file ? "YES" : "NO"}`);
  //   if (file) {
  //     this.logger.log(
  //       `File details: ${JSON.stringify({
  //         originalname: file.originalname,
  //         mimetype: file.mimetype,
  //         size: file.size,
  //         filename: file.filename,
  //       })}`,
  //     );
  //   }

  //   this.logger.log(`Metadata: ${JSON.stringify(metadata)}`);

  //   if (!file) {
  //     this.logger.error("No file received in request");
  //     throw new BadRequestException("Файл не был загружен");
  //   }

  //   try {
  //     const savedFiles = await this.uploadService.saveFiles(
  //       [file],
  //       user.id,
  //       metadata,
  //     );

  //     this.logger.log(`Successfully saved ${savedFiles.length} files`);

  //     return {
  //       files: savedFiles as FileResponseDto[],
  //       message: "Файл загружен успешно",
  //     };
  //   } catch (error) {
  //     this.logger.error(`Upload error: ${error.message}`, error.stack);
  //     throw new HttpException(
  //       `Ошибка при загрузке файла: ${error.message}`,
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  // }
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post("single")
  // @Public()
  @UseInterceptors(
    FileInterceptor("file", {
      storage: multer.memoryStorage(),
      limits: { fileSize: 25 * 1024 * 1024 }, // 25MB
    }),
  )
  async uploadSingle(
    @UploadedFile() file: Express.Multer.File,
    @Body() metadata: UploadFileDto,
    @CurrentUser() user: User, // если публично — user может быть undefined
  ) {
    try {
      if (!file) {
        throw new BadRequestException("Файл не был загружен");
      }

      // лог без обращения к user.id
      this.logger.log(`Upload attempt (public). File: ${file.originalname}`);

      // 1) грузим в S3
      const { key, url } = await this.s3Service.uploadFile(file);

      // 2) сохраняем запись в БД БЕЗ uploadedById (или сделай uploadedById nullable в схеме)
      const saved = await this.uploadService.saveExternalFile({
        filename: file.originalname,
        storedName: key,
        path: key,
        url,
        mimetype: file.mimetype,
        size: file.size,
        uploadedById: user.id, // не передаём, если нет юзера
      });

      return {
        files: [saved as any],
        message: "Файл загружен успешно",
      };
    } catch (e) {
      this.logger.error(`Upload error: ${e.message}`, e.stack);
      throw new HttpException(
        "Внутренняя ошибка сервера",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Загрузка множественных файлов
   */
  @ApiOperation({ summary: "Загрузить несколько файлов" })
  @ApiResponse({
    status: 201,
    description: "Файлы загружены успешно",
    type: UploadResponseDto,
  })
  // @ApiConsumes("multipart/form-data")
  // @ApiBody({
  //   schema: {
  //     type: "object",
  //     properties: {
  //       files: {
  //         type: "array",
  //         items: {
  //           type: "string",
  //           format: "binary",
  //         },
  //       },
  //     },
  //   },
  // })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FilesInterceptor("files", 10, {
      storage: multer.memoryStorage(),
      limits: { fileSize: 25 * 1024 * 1024 }, // 25MB на файл
    }),
  )
  @Post("multiple")
  async uploadMultiple(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() metadata: UploadFileDto,
    @CurrentUser() user: User,
  ): Promise<UploadResponseDto> {
    this.logger.log(`Multiple upload attempt by user ${user.id}`);

    if (!files || files.length === 0) {
      this.logger.error("No files received in request");
      throw new BadRequestException("Файлы не были загружены");
    }

    this.logger.log(`Received ${files.length} files`);

    try {
      const savedFiles = await this.uploadService.saveFiles(
        files,
        user.id,
        metadata,
      );

      return {
        files: savedFiles as FileResponseDto[],
        message: `Загружено ${savedFiles.length} файлов`,
      };
    } catch (error) {
      this.logger.error(`Multiple upload error: ${error.message}`, error.stack);
      throw new HttpException(
        `Ошибка при загрузке файлов: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Получение списка файлов с фильтрацией
   */
  @ApiOperation({ summary: "Получить список файлов" })
  @ApiResponse({
    status: 200,
    description: "Список файлов",
    schema: {
      type: "object",
      properties: {
        files: {
          type: "array",
          items: { $ref: "#/components/schemas/FileResponseDto" },
        },
        total: { type: "number" },
        page: { type: "number" },
        limit: { type: "number" },
        totalPages: { type: "number" },
      },
    },
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get("files")
  async getFiles(@Query() filters: FileFilterDto, @CurrentUser() user: User) {
    try {
      return await this.uploadService.findMany(filters, user.id);
    } catch (error) {
      this.logger.error(`Get files error: ${error.message}`, error.stack);
      throw new HttpException(
        "Ошибка при получении списка файлов",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Получение файла по ID
   */
  @ApiOperation({ summary: "Получить информацию о файле" })
  @ApiResponse({
    status: 200,
    description: "Информация о файле",
    type: FileResponseDto,
  })
  @ApiResponse({ status: 404, description: "Файл не найден" })
  @ApiParam({ name: "id", description: "ID файла" })
  @Get("files/:id")
  async getFile(@Param("id", ParseUUIDPipe) id: string) {
    try {
      const file = await this.uploadService.findById(id);

      if (!file) {
        throw new HttpException("Файл не найден", HttpStatus.NOT_FOUND);
      }

      return file;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(`Get file error: ${error.message}`, error.stack);
      throw new HttpException(
        "Ошибка при получении файла",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Статистика файлов пользователя
   */
  @ApiOperation({ summary: "Получить статистику файлов" })
  @ApiResponse({
    status: 200,
    description: "Статистика файлов",
    schema: {
      type: "object",
      properties: {
        total: { type: "number" },
        byType: {
          type: "object",
          additionalProperties: { type: "number" },
        },
        totalSize: { type: "number" },
        avgSize: { type: "number" },
      },
    },
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get("stats")
  async getStats(@CurrentUser() user: User) {
    try {
      return await this.uploadService.getFileStats(user.id);
    } catch (error) {
      this.logger.error(`Get stats error: ${error.message}`, error.stack);
      throw new HttpException(
        "Ошибка при получении статистики",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get("files/:storedName/view")
  async viewFile(
    @Param("storedName") storedName: string,
    @Res() res: Response,
  ) {
    const file = await this.uploadService.findByStoredName(storedName);
    if (!file) {
      throw new HttpException("Файл не найден", HttpStatus.NOT_FOUND);
    }

    const absPath = join(this.uploadService.getUploadPath(), file.storedName);
    if (!existsSync(absPath)) {
      throw new HttpException(
        "Файл отсутствует на диске",
        HttpStatus.NOT_FOUND,
      );
    }

    // Кэширование (можно настроить гибче)
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    res.setHeader("Content-Type", file.mimetype);
    res.setHeader("Content-Length", statSync(absPath).size);

    return createReadStream(absPath).pipe(res);
  }

  @Get("files/:storedName/download")
  async downloadFile(
    @Param("storedName") storedName: string,
    @Res() res: Response,
  ) {
    const file = await this.uploadService.findByStoredName(storedName);
    if (!file) throw new HttpException("Файл не найден", HttpStatus.NOT_FOUND);

    const absPath = join(this.uploadService.getUploadPath(), file.storedName);
    if (!existsSync(absPath)) {
      throw new HttpException(
        "Файл отсутствует на диске",
        HttpStatus.NOT_FOUND,
      );
    }

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${encodeURIComponent(file.filename)}"`,
    );
    res.setHeader("Content-Type", file.mimetype);
    return createReadStream(absPath).pipe(res);
  }

  @Get("files/:storedName/thumbnail")
  async thumbnail(
    @Res() res: Response,
    @Param("storedName") storedName: string,
    @Query("width") width?: string,
    @Query("height") height?: string,
  ) {
    const file = await this.uploadService.findByStoredName(storedName);
    if (!file) throw new HttpException("Файл не найден", HttpStatus.NOT_FOUND);
    if (file.type !== FileType.IMAGE) {
      throw new HttpException("Только для изображений", HttpStatus.BAD_REQUEST);
    }

    const absPath = join(this.uploadService.getUploadPath(), file.storedName);
    if (!existsSync(absPath)) {
      throw new HttpException(
        "Файл отсутствует на диске",
        HttpStatus.NOT_FOUND,
      );
    }

    const w = width ? parseInt(width, 10) : undefined;
    const h = height ? parseInt(height, 10) : undefined;

    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    res.setHeader("Content-Type", "image/webp");

    const transformer = sharp(absPath)
      .resize({ width: w, height: h, fit: "inside", withoutEnlargement: true })
      .webp();
    return transformer.pipe(res);
  }

  @ApiOperation({ summary: "Обновить метаданные файла" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch("files/:id")
  async patchFile(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateFileDto,
    @CurrentUser() user: User,
  ) {
    return this.uploadService.updateFile(id, dto, user.id);
  }

  @ApiOperation({ summary: "Удалить файл" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete("files/:id")
  async removeFile(
    @Param("id", new ParseUUIDPipe()) id: string,
    @CurrentUser() user: User,
  ) {
    return this.uploadService.removeFile(id, user.id);
  }
}
