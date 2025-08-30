import { Controller, Get, Param } from "@nestjs/common";
import { CategoryPromoSectionsService } from "../category-promo-sections.service";
import { PrismaService } from "../../database/prisma.service";

@Controller("categories/:slug/promo-sections")
export class PublicCategoryPromoSectionsController {
  constructor(
    private readonly service: CategoryPromoSectionsService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  async byCategory(@Param("slug") slug: string) {
    const category = await this.prisma.category.findUnique({
      where: { slug },
    });
    if (!category) return [];

    return this.service.listForCategory(category.id);
  }
}
