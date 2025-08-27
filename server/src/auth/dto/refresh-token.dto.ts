import { IsString, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class RefreshTokenDto {
  @ApiProperty({ description: "Refresh token" })
  @IsNotEmpty({ message: "Refresh token обязателен" })
  @IsString({ message: "Refresh token должен быть строкой" })
  refreshToken: string;
}
