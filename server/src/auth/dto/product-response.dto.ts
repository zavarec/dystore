import { ApiProperty } from "@nestjs/swagger";

export class ProductResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false })
  shortDescription?: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  stock: number;

  @ApiProperty({ required: false })
  imageUrl?: string;

  @ApiProperty()
  categoryId: number;

  @ApiProperty()
  isFeatured: boolean;

  @ApiProperty()
  popularity: number;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
