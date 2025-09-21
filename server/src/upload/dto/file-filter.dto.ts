import { ApiPropertyOptional } from "@nestjs/swagger";
import { FileType, FileStatus } from "@prisma/client";
import { Type } from "class-transformer";
import { IsEnum, IsOptional, IsString, IsInt, Min } from "class-validator";

export class FileFilterDto {
  @ApiPropertyOptional({ enum: FileType })
  @IsOptional()
  @IsEnum(FileType)
  type?: FileType;

  @ApiPropertyOptional({ enum: FileStatus })
  @IsOptional()
  @IsEnum(FileStatus)
  status?: FileStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  mimetype?: string;

  @ApiPropertyOptional({ minimum: 1, default: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ minimum: 1, maximum: 100, default: 20 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number = 20;
}

