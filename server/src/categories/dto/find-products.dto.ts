import { Type } from "class-transformer";
import {
  IsBooleanString,
  IsEnum,
  IsInt,
  IsOptional,
  Max,
  Min,
} from "class-validator";
import { ProductSortBy } from "src/types/product.model";

export class FindProductsDto {
  @IsOptional()
  @IsBooleanString()
  deep?: string; // "true"/"false"

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit = 24;

  @IsOptional()
  @IsEnum(ProductSortBy)
  sort: ProductSortBy = ProductSortBy.POPULARITY;

  // при желании: minPrice, maxPrice, inStock, attrs[] и т.д.
}
