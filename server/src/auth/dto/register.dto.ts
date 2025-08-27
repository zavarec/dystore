import {
  IsString,
  IsNotEmpty,
  MinLength,
  IsOptional,
  IsEmail,
  IsEnum,
} from "class-validator";
import { Role } from "@prisma/client";

export class RegisterDto {
  @IsNotEmpty({ message: "Email обязателен" })
  @IsEmail({}, { message: "Некорректный формат email" })
  email: string;

  @IsNotEmpty({ message: "Пароль обязателен" })
  @IsString({ message: "Пароль должен быть строкой" })
  @MinLength(6, { message: "Пароль должен быть не менее 6 символов" })
  password: string;

  @IsOptional()
  @IsString({ message: "Имя должно быть строкой" })
  name?: string;

  @IsOptional()
  @IsEnum(Role, { message: "Некорректная роль" })
  role?: Role;
}
