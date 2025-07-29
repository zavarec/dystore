import {
  IsString,
  IsPhoneNumber,
  IsNotEmpty,
  Length,
  Matches,
} from 'class-validator';

export class VerifyCodeDto {
  @IsNotEmpty({ message: 'Номер телефона обязателен' })
  @IsString({ message: 'Номер телефона должен быть строкой' })
  @IsPhoneNumber('RU', { message: 'Неверный формат номера телефона' })
  phone: string;

  @IsNotEmpty({ message: 'Код подтверждения обязателен' })
  @IsString({ message: 'Код должен быть строкой' })
  @Length(6, 6, { message: 'Код должен состоять из 6 цифр' })
  @Matches(/^\d{6}$/, { message: 'Код должен содержать только цифры' })
  code: string;
}
