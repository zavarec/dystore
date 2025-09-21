import { Controller, Get, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { PromoService } from "../promo.service";

@ApiTags("Public Promo")
@Controller("promo")
export class PublicPromoController {
  constructor(private promo: PromoService) {}

  @Get()
  list(
    @Query("pageType") pageType: "PRODUCT" | "CATEGORY" | "LANDING" | "STATIC",
    @Query("entityId") entityId: string,
  ) {
    return this.promo.getForPage(pageType as any, entityId);
  }
}
