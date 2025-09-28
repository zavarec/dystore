import { Type } from "class-transformer";
import {
  IsString,
  IsNumber,
  IsOptional,
  IsPositive,
  Min,
  IsUrl,
  IsNotEmpty,
  ValidateNested,
  IsBoolean,
  IsUUID,
  IsArray,
} from "class-validator";
import { BoxItemDto } from "./save-box-items.dto";
import { SpecItemDto } from "./save-specs.dto";
import { KeyFeatureDto } from "./key-feature.dto";

export class CreateProductDto {
  @IsString({ message: "Название должно быть строкой" })
  name: string;

  @IsString({ message: "Slug должно быть строкой" })
  @IsNotEmpty({ message: "Slug обязателен" })
  slug: string;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsString({ message: "Описание должно быть строкой" })
  description?: string;

  @IsOptional()
  @IsString({ message: "Короткое описание должно быть строкой" })
  shortDescription?: string;

  @IsOptional()
  @IsString({ message: "URL изображения габаритов должно быть строкой" })
  dimensionsImageUrl?: string;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: "Цена должна быть числом с максимум 2 знаками после запятой" },
  )
  @IsPositive({ message: "Цена должна быть положительным числом" })
  price: number;

  @IsOptional()
  @IsNumber({}, { message: "Количество должно быть числом" })
  @Min(0, { message: "Количество не может быть отрицательным" })
  stock?: number;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsNumber({}, { message: "ID категории должен быть числом" })
  @IsPositive({ message: "ID категории должен быть положительным числом" })
  categoryId: number;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => BoxItemDto)
  boxItems?: BoxItemDto[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => SpecItemDto)
  specs?: SpecItemDto[];

  @IsOptional()
  @IsString()
  mainImageId?: string;

  @IsOptional()
  @IsString()
  dimensionsImageId?: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  motifId?: string; // id файла

  @IsOptional() @IsString() marketingNote?: string;
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => KeyFeatureDto)
  keyFeatures?: KeyFeatureDto[];
}
