import { PartialType } from "@nestjs/mapped-types";
import { CreatePromoSectionDto } from "./create-promo-section.dto";

export class UpdatePromoSectionDto extends PartialType(CreatePromoSectionDto) {}
