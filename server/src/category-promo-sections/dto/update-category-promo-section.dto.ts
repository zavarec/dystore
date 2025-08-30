import { PartialType } from "@nestjs/mapped-types";
import { CreateCategoryPromoSectionDto } from "./create-category-promo-section.dto";    

export class UpdateCategoryPromoSectionDto extends PartialType(
  CreateCategoryPromoSectionDto,
) {}
