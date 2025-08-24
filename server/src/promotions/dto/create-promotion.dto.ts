import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { PromotionSlot, PromoFont } from "@prisma/client";
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from "class-validator";

@ValidatorConstraint({ name: "StartBeforeEnd", async: false })
class StartBeforeEndConstraint implements ValidatorConstraintInterface {
  validate(_: unknown, validationArgs: ValidationArguments) {
    const obj = validationArgs.object as any;
    if (!obj.startAt || !obj.endAt) return true;
    return new Date(obj.startAt) < new Date(obj.endAt);
  }
  defaultMessage() {
    return "startAt должен быть раньше endAt";
  }
}

@ValidatorConstraint({ name: "AtLeastOneBackground", async: false })
class AtLeastOneBackgroundConstraint implements ValidatorConstraintInterface {
  validate(_: unknown, validationArgs: ValidationArguments) {
    const obj = validationArgs.object as any;
    return Boolean(obj.bgImageUrl) || Boolean(obj.bgVideoUrl);
  }
  defaultMessage() {
    return "Нужно указать хотя бы один из bgImageUrl или bgVideoUrl";
  }
}

@ValidatorConstraint({ name: "AtLeastOneTarget", async: false })
class AtLeastOneTargetConstraint implements ValidatorConstraintInterface {
  validate(_: unknown, validationArgs: ValidationArguments) {
    const obj = validationArgs.object as any;
    return obj.productId != null || Boolean(obj.ctaLink);
  }
  defaultMessage() {
    return "Нужно указать хотя бы один из productId или ctaLink";
  }
}

export class CreatePromotionDto {
  @ApiProperty({ enum: PromotionSlot })
  @IsEnum(PromotionSlot)
  slot!: PromotionSlot;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  productId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  subtitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ctaText?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ctaLink?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bgImageUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bgVideoUrl?: string;

  @ApiProperty()
  @IsDateString()
  @Validate(StartBeforeEndConstraint)
  startAt!: string;

  @ApiProperty()
  @IsDateString()
  endAt!: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsInt()
  position?: number;

  @Validate(AtLeastOneBackgroundConstraint)
  private __bgCheck?: string;

  @Validate(AtLeastOneTargetConstraint)
  private __targetCheck?: string;

  // Стили
  @ApiPropertyOptional({ enum: PromoFont })
  @IsOptional()
  @IsEnum(PromoFont)
  font?: PromoFont;

  @ApiPropertyOptional({ description: "HEX-цвет заголовка" })
  @IsOptional()
  @IsString()
  @Matches(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/)
  titleColor?: string;

  @ApiPropertyOptional({ description: "HEX-цвет описания" })
  @IsOptional()
  @IsString()
  @Matches(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/)
  textColor?: string;

  @ApiPropertyOptional({ description: "HEX-цвет фона кнопки" })
  @IsOptional()
  @IsString()
  @Matches(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/)
  ctaBg?: string;

  @ApiPropertyOptional({ description: "HEX-цвет текста кнопки" })
  @IsOptional()
  @IsString()
  @Matches(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/)
  ctaColor?: string;
}
