import { ApiProperty } from "@nestjs/swagger";

export class CategoryResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;

  @ApiProperty({ required: false })
  image?: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false })
  parentId?: number;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
