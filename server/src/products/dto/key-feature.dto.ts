import { IsInt, IsOptional, IsString } from "class-validator";

export class KeyFeatureDto {
  @IsString() text!: string;
  @IsOptional() @IsString() footnote?: string;
  @IsOptional() @IsInt() order?: number;
}
