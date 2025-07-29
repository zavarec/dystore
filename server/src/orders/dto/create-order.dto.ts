import { IsOptional, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsOptional()
  @IsString({ message: 'Адрес доставки должен быть строкой' })
  deliveryAddress?: string;

  @IsOptional()
  @IsString({ message: 'Комментарий должен быть строкой' })
  comment?: string;
}
