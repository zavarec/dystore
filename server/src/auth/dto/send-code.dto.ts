import { IsString, IsPhoneNumber, IsNotEmpty } from 'class-validator';

export class SendCodeDto {
  @IsNotEmpty({ message: 'Номер телефона обязателен' })
  @IsString({ message: 'Номер телефона должен быть строкой' })
  @IsPhoneNumber('RU', { message: 'Неверный формат номера телефона' })
  phone: string;
}
