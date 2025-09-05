import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsObject, IsOptional, IsString } from "class-validator";
import { SeoPageType } from "@prisma/client";

export class UpsertSeoMetaDto {
  @IsEnum(SeoPageType)
  pageType!: SeoPageType;

  @IsString()
  entityId!: string;

  @IsString()
  @IsOptional()
  locale?: string = "ru";

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  keywords?: string;

  @IsString()
  @IsOptional()
  canonical?: string;

  @IsString()
  @IsOptional()
  robots?: string;

  @IsString()
  @IsOptional()
  ogTitle?: string;

  @IsString()
  @IsOptional()
  ogDescription?: string;

  @IsString()
  @IsOptional()
  ogImage?: string;

  @IsString()
  @IsOptional()
  twitterCard?: string;

  @IsObject()
  @IsOptional()
  @ApiPropertyOptional({ type: Object })
  structuredData?: Record<string, unknown>;

  @IsObject()
  @IsOptional()
  @ApiPropertyOptional({ type: Object })
  hreflang?: Record<string, unknown>;
}
