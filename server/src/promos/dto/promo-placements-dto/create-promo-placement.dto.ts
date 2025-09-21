// dto/create-promo-placement.dto.ts
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from "class-validator";
import { ContentSide, PromoPageType, PromoSlot } from "@prisma/client";

export class CreatePromoPlacementDto {
  @IsEnum(PromoPageType) pageType: PromoPageType;
  @IsString() entityId: string; // slug «category»/«product»/«landing»
  @IsEnum(PromoSlot) slot: PromoSlot;
  @IsInt() @Min(0) promoSectionId: number;

  @IsOptional() @IsInt() @Min(0) order?: number;
  @IsOptional() @IsBoolean() isActive?: boolean;

  // локальные override'ы
  @IsOptional() @IsBoolean() fullWidth?: boolean;
  @IsOptional() @IsInt() marginTop?: number;
  @IsOptional() @IsInt() marginBottom?: number;
  @IsOptional() @IsString() bgColor?: string;
  @IsOptional() @IsEnum(ContentSide) contentSide?: ContentSide;
  @IsOptional() @IsInt() zIndex?: number;
}

