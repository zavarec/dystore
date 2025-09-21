import { Type } from "class-transformer";
import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
  ValidateNested,
} from "class-validator";

export class SpecItemDto {
  @ValidateIf((o) => !o.label)
  @IsInt()
  attributeId?: number;

  @ValidateIf((o) => !o.attributeId)
  @IsString()
  label?: string; // название нового атрибута

  @IsOptional() @IsString() valueString?: string;
  @IsOptional() @IsNumber() valueNumber?: number;
  @IsOptional() @IsBoolean() valueBool?: boolean;

  @IsOptional() @IsString() unit?: string;
  @IsInt() @Min(0) order!: number;
}

export class SaveSpecsDto {
  @ValidateNested({ each: true })
  @Type(() => SpecItemDto)
  items!: SpecItemDto[];
}
