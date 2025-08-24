import { Controller, Get, Param, ParseEnumPipe } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { PromotionSlot } from "@prisma/client";
import { PromotionsService } from "../promotions.service";

@ApiTags("Promotions Public")
@Controller("promotions")
export class PublicPromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @Get("slot/:slot/active")
  getActive(
    @Param("slot", new ParseEnumPipe(PromotionSlot)) slot: PromotionSlot,
  ) {
    return this.promotionsService.getActiveBySlot(slot);
  }
}
