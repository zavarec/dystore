import { IsString, IsPhoneNumber, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'Номер телефона должен быть строкой' })
  @IsPhoneNumber('RU', { message: 'Неверный формат номера телефона' })
  phone: string;

  @IsOptional()
  @IsString({ message: 'Имя должно быть строкой' })
  name?: string;
}
