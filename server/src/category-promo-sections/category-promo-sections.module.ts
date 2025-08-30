import { Module } from "@nestjs/common";
import { CategoryPromoSectionsService } from "./category-promo-sections.service";
import { AdminCategoryPromoSectionsController } from "./controllers/admin-category-promo-sections.controller";
import { PublicCategoryPromoSectionsController } from "./controllers/public-category-promo-sections.controller";

@Module({
  controllers: [
    AdminCategoryPromoSectionsController,
    PublicCategoryPromoSectionsController,
  ],
  providers: [CategoryPromoSectionsService],
  exports: [CategoryPromoSectionsService],
})
export class CategoryPromoSectionsModule {}
