// dto/create-promo-section.dto.ts
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Min,
} from "class-validator";
import {
  PromoVariant,
  ContentSide,
  PromoFont,
  PromoSlot,
} from "@prisma/client";

export interface CreateProductPromoInput {
  productSlug: string; // ← slug продукта
  slot: PromoSlot; // ABOVE_PRODUCTS / BETWEEN_PRODUCTS / …
  order?: number;
  // Контент секции:
  variant: PromoVariant;
  title?: string;
  subtitle?: string;
  imageUrl?: string;
  videoUrl?: string;
  ctaText?: string;
  ctaLink?: string;
  // Стили (опционально)
  font?: PromoFont;
  titleColor?: string;
  textColor?: string;
  ctaBg?: string;
  ctaColor?: string;
  bgColor?: string;
  contentSide?: ContentSide;
  heightPx?: number;
  paddingTopPx?: number;
  paddingBottomPx?: number;
  contentFontSizePx?: number;
  titleFontSizePx?: number;
  // Тайминг/видимость
  startsAt?: Date | null;
  endsAt?: Date | null;
  isActive?: boolean;
  // Локальные оверрайды placement (опционально)
  fullWidth?: boolean;
  marginTop?: number;
  marginBottom?: number;
  zIndex?: number;
  createdById: string;
}

type Media =
  | { type: "image"; src: string }
  | { type: "video"; src: string; poster?: string };

export interface PromoCarouselContent {
  kind: "carousel";
  autoplay?: boolean;
  intervalMs?: number;
  showDots?: boolean;
  showArrows?: boolean;
  slides: Array<{
    id: string;
    title?: string;
    subtitle?: string;
    media?: Media;
    cta?: { text: string; href: string };
    align?: "left" | "right" | "center";
    bgColor?: string;
  }>;
}

export class CreatePromoSectionDto {
  @IsEnum(PromoVariant) variant: PromoVariant;

  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() subtitle?: string;

  // todo: check why isOptional not working
  @IsOptional() imageUrl?: string;
  @IsOptional() videoUrl?: string;

  @IsOptional() @IsString() ctaText?: string;
  @IsOptional() @IsString() ctaLink?: string;

  @IsOptional() @IsEnum(PromoFont) font?: PromoFont;
  @IsOptional() @IsString() titleColor?: string;
  @IsOptional() @IsString() textColor?: string;
  @IsOptional() @IsString() ctaBg?: string;
  @IsOptional() @IsString() ctaColor?: string;
  @IsOptional() @IsString() bgColor?: string;
  @IsOptional() @IsEnum(ContentSide) contentSide?: ContentSide;
  @IsOptional() @IsInt() @Min(0) heightPx?: number;

  @IsOptional() @IsInt() @Min(0) paddingTopPx?: number;
  @IsOptional() @IsInt() @Min(0) paddingBottomPx?: number;
  @IsOptional() @IsInt() @Min(0) contentFontSizePx?: number;
  @IsOptional() @IsInt() @Min(0) titleFontSizePx?: number;

  @IsOptional() content?: unknown;

  @IsOptional() @IsString() startsAt?: string; // ISO
  @IsOptional() @IsString() endsAt?: string; // ISO
  @IsOptional() @IsBoolean() isActive?: boolean;

  @IsOptional() @IsString() createdById?: string;
}

// dto/update-promo-section.dto.ts
import { PartialType } from "@nestjs/mapped-types";
export class UpdatePromoSectionDto extends PartialType(CreatePromoSectionDto) {}
