import { Module } from "@nestjs/common";
import { PromotionsService } from "./promotions.service";
import { AdminPromotionsController } from "./controllers/admin-promotions.controller";
import { PublicPromotionsController } from "./controllers/public-promotions.controller";

@Module({
  controllers: [AdminPromotionsController, PublicPromotionsController],
  providers: [PromotionsService],
  exports: [PromotionsService],
})
export class PromotionsModule {}
