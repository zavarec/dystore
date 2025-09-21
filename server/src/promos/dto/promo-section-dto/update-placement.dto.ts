// server/src/promos/dto/update-placement.dto.ts
import { PartialType } from "@nestjs/swagger";
import { CreatePromoPlacementDto } from "../promo-placements-dto/create-promo-placement.dto";
export class UpdatePromoPlacementDto extends PartialType(
  CreatePromoPlacementDto,
) {}
