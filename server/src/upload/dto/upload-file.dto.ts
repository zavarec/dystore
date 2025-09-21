import { ApiPropertyOptional } from "@nestjs/swagger";
import { FileType } from "@prisma/client";
import {
  Allow,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";

export class UploadFileDto {
  @ApiPropertyOptional({ description: "Альтернативный текст для изображения" })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  alt?: string;

  @ApiPropertyOptional({ description: "Описание файла" })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({ enum: FileType, description: "Тип файла" })
  @IsOptional()
  @IsEnum(FileType)
  type?: FileType;

  @Allow()
  file?: any;

  @Allow()
  files?: any;
}
