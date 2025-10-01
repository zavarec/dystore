import { IsEmail, IsOptional, IsString, Matches } from "class-validator";

export class CreateOrderDto {
  @IsOptional()
  @IsString({ message: "Адрес доставки должен быть строкой" })
  deliveryAddress?: string;

  @IsOptional()
  @IsString({ message: "Комментарий должен быть строкой" })
  comment?: string;

  // опционально — если хочешь перезаписать снапшот клиента из формы
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @Matches(/^\+?[0-9\s\-()]{7,20}$/)
  phone?: string;

  // опционально — чтобы прокинуть в amoCRM кастомными полями
  @IsOptional()
  @IsString()
  deliveryMethod?: string;

  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @IsOptional()
  @IsString()
  promoCode?: string;
}
