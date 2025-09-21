import { Type } from "class-transformer";
import {
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from "class-validator";

export class BoxItemDto {
  @IsOptional() @IsInt() accessoryId?: number;
  @IsOptional() @IsString() customName?: string;
  @IsOptional() @IsString() customImageId?: string;
  @IsOptional() @IsString() description?: string;
  @IsInt() @Min(1) qty!: number;
  @IsInt() @Min(0) order!: number;
}

export class SaveBoxItemsDto {
  @ValidateNested({ each: true })
  @Type(() => BoxItemDto)
  items!: BoxItemDto[];
}
