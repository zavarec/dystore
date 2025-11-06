import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

export class CreateContactRequestDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  fullName?: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  @MaxLength(64)
  orderNumber?: string;

  @IsString()
  @MinLength(8)
  @MaxLength(5000)
  message!: string;
}
