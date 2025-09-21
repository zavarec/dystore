import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { UpdatePromoPlacementDto } from "../dto/promo-placements-dto/update-promo-placement.dto";
import { CreatePromoPlacementDto } from "../dto/promo-placements-dto/create-promo-placement.dto";

@Controller("admin/promo-placements")
export class AdminPromoPlacementsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  list(
    @Query("pageType") pageType?: string,
    @Query("entityId") entityId?: string,
  ) {
    return this.prisma.promoPlacement.findMany({
      where: { pageType: pageType as any, entityId: entityId || undefined },
      include: { promoSection: true },
      orderBy: [{ slot: "asc" }, { order: "asc" }],
    });
  }

  @Post()
  create(@Body() dto: CreatePromoPlacementDto) {
    return this.prisma.promoPlacement.create({
      data: { ...dto, order: dto.order ?? 0 },
      include: { promoSection: true },
    });
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdatePromoPlacementDto) {
    return this.prisma.promoPlacement.update({
      where: { id: Number(id) },
      data: { ...dto },
      include: { promoSection: true },
    });
  }

  @Post("reorder")
  async reorder(@Body() body: { items: { id: number; order: number }[] }) {
    const tx = body.items.map((i) =>
      this.prisma.promoPlacement.update({
        where: { id: i.id },
        data: { order: i.order },
      }),
    );
    await this.prisma.$transaction(tx);
    return { ok: true };
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.prisma.promoPlacement.delete({ where: { id: Number(id) } });
  }
}
