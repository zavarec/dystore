import { Module } from "@nestjs/common";
import { PromoPlacementsService } from "./promo-placements.service";
import { AdminPromoPlacementsController } from "./controllers/admin-promo-placements.controller";
import { PublicPromoController } from "./controllers/public-promo.controller";
import { PromoService } from "./promo.service";
import { AdminPromoSectionsController } from "./controllers/admin-promo-sections.controller";

@Module({
  providers: [PromoPlacementsService, PromoService],
  controllers: [
    AdminPromoPlacementsController,
    PublicPromoController,
    AdminPromoSectionsController,
  ],
  exports: [PromoPlacementsService, PromoService],
})
export class PromosModule {}
