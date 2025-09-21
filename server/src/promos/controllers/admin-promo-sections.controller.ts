import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import {
  CreateProductPromoInput,
  CreatePromoSectionDto,
} from "../dto/promo-section-dto/create-promo-section.dto";
import { UpdatePromoSectionDto } from "../dto/promo-section-dto/update-promo-section.dto";
import { Prisma } from "@prisma/client";
import {
  normalizeSectionCreate,
  normalizeSectionUpdate,
} from "src/common/utils/promos.utils";

@Controller("admin/promo-sections")
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class AdminPromoSectionsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  list(@Query("q") q?: string) {
    return this.prisma.promoSection.findMany({
      where: q ? { title: { contains: q, mode: "insensitive" } } : undefined,
      orderBy: [{ updatedAt: "desc" }],
    });
  }

  @Get(":id")
  get(@Param("id") id: string) {
    return this.prisma.promoSection.findUnique({ where: { id: Number(id) } });
  }

  @Post()
  create(@Body() dto: CreatePromoSectionDto) {
    const data = normalizeSectionCreate(dto);
    return this.prisma.promoSection.create({
      data,
    });
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdatePromoSectionDto) {
    const data = normalizeSectionUpdate(dto);
    return this.prisma.promoSection.update({
      where: { id: Number(id) },
      data,
    });
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.prisma.promoSection.delete({ where: { id: Number(id) } });
  }

  @Post("create-product-promo")
  createProductPromo(@Body() dto: CreateProductPromoInput) {
    return this.prisma.promoSection.create({
      data: {
        ...dto,
        startsAt: dto.startsAt ? new Date(dto.startsAt) : null,
        endsAt: dto.endsAt ? new Date(dto.endsAt) : null,
        createdById: "admin-system", // подставьте текущего userId
      },
    });
  }

  @Get("list-for-product/:productSlug")
  listForProduct(@Param("productSlug") productSlug: string) {
    return this.prisma.promoSection.findMany({
      where: { placements: { some: { entityId: productSlug } } },
      include: { placements: true },
      orderBy: [{ updatedAt: "desc" }],
    });
  }
}
