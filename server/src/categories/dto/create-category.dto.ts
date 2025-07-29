import { IsString, IsNotEmpty, IsOptional, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCategoryDto {
  @IsString({ message: 'Название должно быть строкой' })
  @IsNotEmpty({ message: 'Название обязательно' })
  name: string;

  @IsString({ message: 'Slug должен быть строкой' })
  @IsNotEmpty({ message: 'Slug обязателен' })
  slug: string;

  @IsOptional()
  @IsString({ message: 'URL изображения должен быть строкой' })
  image?: string;

  @IsOptional()
  @IsInt({ message: 'ID родительской категории должен быть числом' })
  @Type(() => Number)
  parentId?: number;
}
