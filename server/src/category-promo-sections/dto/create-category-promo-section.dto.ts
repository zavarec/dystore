import {
  IsString,
  IsOptional,
  IsInt,
  IsBoolean,
  IsUrl,
  IsEnum,
  IsISO8601,
} from "class-validator";
import {
  CategoryPromoPlacement,
  PromoFont,
  CategoryPromoVariant,
} from "@prisma/client";

// Локальный enum для валидации, чтобы избежать проблем с типами при генерации клиента
export enum ContentSideDtoEnum {
  LEFT = "LEFT",
  RIGHT = "RIGHT",
  CENTER = "CENTER",
}

export class CreateCategoryPromoSectionDto {
  @IsInt()
  categoryId: number;

  @IsEnum(CategoryPromoVariant)
  variant: CategoryPromoVariant;

  @IsEnum(CategoryPromoPlacement)
  placement: CategoryPromoPlacement;

  @IsOptional()
  @IsInt()
  order?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  subtitle?: string;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @IsOptional()
  @IsUrl()
  videoUrl?: string;

  @IsOptional()
  @IsString()
  ctaText?: string;

  @IsOptional()
  @IsString()
  ctaLink?: string;

  @IsOptional()
  @IsEnum(PromoFont)
  font?: PromoFont;

  @IsOptional()
  @IsString()
  titleColor?: string;

  @IsOptional()
  @IsString()
  textColor?: string;

  @IsOptional()
  @IsString()
  ctaBg?: string;

  @IsOptional()
  @IsString()
  ctaColor?: string;

  @IsOptional()
  @IsString()
  bgColor?: string;

  @IsOptional()
  @IsEnum(ContentSideDtoEnum)
  contentSide?: ContentSideDtoEnum;

  @IsOptional()
  @IsInt()
  heightPx?: number;

  @IsOptional()
  @IsISO8601()
  startsAt?: string;

  @IsOptional()
  @IsISO8601()
  endsAt?: string;
}
