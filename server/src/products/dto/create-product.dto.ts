import {
  IsString,
  IsNumber,
  IsOptional,
  IsPositive,
  Min,
  IsUrl,
} from 'class-validator';

export class CreateProductDto {
  @IsString({ message: 'Название должно быть строкой' })
  name: string;

  @IsOptional()
  @IsString({ message: 'Описание должно быть строкой' })
  description?: string;

  @IsOptional()
  @IsString({ message: 'Короткое описание должно быть строкой' })
  shortDescription?: string;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Цена должна быть числом с максимум 2 знаками после запятой' },
  )
  @IsPositive({ message: 'Цена должна быть положительным числом' })
  price: number;

  @IsOptional()
  @IsNumber({}, { message: 'Количество должно быть числом' })
  @Min(0, { message: 'Количество не может быть отрицательным' })
  stock?: number;

  @IsOptional()
  @IsUrl({}, { message: 'URL изображения должен быть корректным' })
  imageUrl?: string;

  @IsNumber({}, { message: 'ID категории должен быть числом' })
  @IsPositive({ message: 'ID категории должен быть положительным числом' })
  categoryId: number;
}
