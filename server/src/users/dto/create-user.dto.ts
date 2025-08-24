import { IsString, IsPhoneNumber, IsOptional, IsEnum } from "class-validator";
import { Role } from "@prisma/client";

export class CreateUserDto {
  @IsString({ message: "Номер телефона должен быть строкой" })
  @IsPhoneNumber("RU", { message: "Неверный формат номера телефона" })
  phone: string;

  @IsOptional()
  @IsString({ message: "Имя должно быть строкой" })
  name?: string;

  @IsOptional()
  @IsEnum(Role, { message: "Некорректная роль" })
  role?: Role;
}
