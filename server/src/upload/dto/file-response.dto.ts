import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { FileType, FileStatus } from "@prisma/client";

export class FileResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  filename: string;

  @ApiProperty()
  storedName: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  mimetype: string;

  @ApiProperty()
  size: number;

  @ApiProperty({ enum: FileType })
  type: FileType;

  @ApiProperty({ enum: FileStatus })
  status: FileStatus;

  @ApiPropertyOptional()
  width?: number;

  @ApiPropertyOptional()
  height?: number;

  @ApiPropertyOptional()
  duration?: number;

  @ApiPropertyOptional()
  alt?: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
