import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateSpecAttributeDto {
  @IsString() key!: string;     // уникальный machine key
  @IsString() label!: string;   // человекочитаемое имя
  @IsOptional() @IsString() unit?: string;
  @IsOptional() @IsString() group?: string;
  @IsOptional() @IsInt() @Min(0) order?: number;

  @IsOptional() @IsIn(['STRING', 'NUMBER', 'BOOLEAN'])
  type?: 'STRING' | 'NUMBER' | 'BOOLEAN';
}
