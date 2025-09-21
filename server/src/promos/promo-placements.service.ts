import { Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { CreatePromoPlacementDto } from "./dto/promo-placements-dto/create-promo-placement.dto";
import { UpdatePromoPlacementDto } from "./dto/promo-placements-dto/update-promo-placement.dto";
import { Prisma } from "@prisma/client";

@Injectable()
export class PromoPlacementsService {
  constructor(private prisma: PrismaService) {}

  list(query: {
    pageType?: any;
    entityId?: string;
    slot?: any;
    take?: number;
    skip?: number;
  }) {
    return this.prisma.promoPlacement.findMany({
      where: {
        pageType: query.pageType,
        entityId: query.entityId,
        slot: query.slot,
      },
      include: { promoSection: true },
      orderBy: [
        { isActive: "desc" },
        { slot: "asc" },
        { order: "asc" },
        { createdAt: "desc" },
      ],
      take: query.take,
      skip: query.skip,
    });
  }

  create(dto: CreatePromoPlacementDto) {
    const data: Prisma.PromoPlacementCreateInput = {
      pageType: dto.pageType,
      entityId: dto.entityId,
      slot: dto.slot,
      order: dto.order ?? 0,
      isActive: dto.isActive ?? true,
      // entityType: dto.entityType,
      ...(dto.promoSectionId
        ? {
            promoSection: {
              connect: { id: dto.promoSectionId },
            },
          }
        : {}),

      fullWidth: dto.fullWidth ?? null,
      marginTop: dto.marginTop ?? null,
      marginBottom: dto.marginBottom ?? null,
      bgColor: dto.bgColor ?? null,
      contentSide: dto.contentSide ?? null,
      zIndex: dto.zIndex ?? null,
    };

    return this.prisma.promoPlacement.create({
      data,
      include: { promoSection: true },
    });
  }

  update(id: number, dto: UpdatePromoPlacementDto) {
    const data: Prisma.PromoPlacementUpdateInput = {
      pageType: dto.pageType ?? undefined,
      entityId: dto.entityId ?? undefined,
      slot: dto.slot ?? undefined,
      order: dto.order ?? undefined,
      isActive: dto.isActive ?? undefined,
      // entityType: dto.entityType ?? undefined,
      promoSection: dto.promoSectionId
        ? { connect: { id: dto.promoSectionId } }
        : dto.promoSectionId === null
          ? { disconnect: true }
          : undefined,

      fullWidth: dto.fullWidth ?? undefined,
      marginTop: dto.marginTop ?? undefined,
      marginBottom: dto.marginBottom ?? undefined,
      bgColor: dto.bgColor ?? undefined,
      contentSide: dto.contentSide ?? undefined,
      zIndex: dto.zIndex ?? undefined,
    };

    return this.prisma.promoPlacement.update({
      where: { id },
      data,
      include: { promoSection: true },
    });
  }

  remove(id: number) {
    return this.prisma.promoPlacement.delete({ where: { id } });
  }

  async reorder(pairs: { id: number; order: number }[]) {
    return this.prisma.$transaction(
      pairs.map((p) =>
        this.prisma.promoPlacement.update({
          where: { id: p.id },
          data: { order: p.order },
        }),
      ),
    );
  }

  publicList(pageType: any, entityId: string) {
    return this.prisma.promoPlacement.findMany({
      where: { pageType, entityId, isActive: true },
      include: { promoSection: true },
      orderBy: [{ slot: "asc" }, { order: "asc" }],
    });
  }
}
