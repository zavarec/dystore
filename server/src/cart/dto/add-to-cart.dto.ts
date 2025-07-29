import { IsNumber, IsPositive, Min } from 'class-validator';

export class AddToCartDto {
  @IsNumber({}, { message: 'ID товара должен быть числом' })
  @IsPositive({ message: 'ID товара должен быть положительным числом' })
  productId: number;

  @IsNumber({}, { message: 'Количество должно быть числом' })
  @Min(1, { message: 'Количество должно быть больше 0' })
  quantity: number;
}
