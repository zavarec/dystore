import { Injectable } from "@nestjs/common";
import { Prisma, PromotionSlot } from "@prisma/client";
import { PrismaService } from "../database/prisma.service";
import { CreatePromotionDto } from "./dto/create-promotion.dto";
import { UpdatePromotionDto } from "./dto/update-promotion.dto";

@Injectable()
export class PromotionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePromotionDto, userId: string) {
    const data: Prisma.PromotionCreateInput = {
      slot: dto.slot,
      title: dto.title ?? null,
      subtitle: dto.subtitle ?? null,
      ctaText: dto.ctaText ?? null,
      ctaLink: dto.ctaLink ?? null,
      bgImageUrl: dto.bgImageUrl ?? null,
      bgVideoUrl: dto.bgVideoUrl ?? null,
      // Если шрифт не передан — пусть сработает дефолт в БД
      font: dto.font ?? undefined,
      titleColor: dto.titleColor ?? null,
      textColor: dto.textColor ?? null,
      ctaBg: dto.ctaBg ?? null,
      ctaColor: dto.ctaColor ?? null,
      isPublished: dto.isPublished ?? false,
      startAt: new Date(dto.startAt),
      endAt: new Date(dto.endAt),
      position: dto.position ?? 0,
      createdBy: { connect: { id: userId } },
      ...(dto.productId ? { product: { connect: { id: dto.productId } } } : {}),
    };

    if (dto.slot === PromotionSlot.PRODUCT_OF_DAY && dto.isPublished) {
      return this.prisma.$transaction(async (tx) => {
        const created = await tx.promotion.create({ data });
        await tx.promotion.updateMany({
          where: {
            id: { not: created.id },
            slot: PromotionSlot.PRODUCT_OF_DAY,
            isPublished: true,
            NOT: [
              { endAt: { lte: created.startAt } },
              { startAt: { gte: created.endAt } },
            ],
          },
          data: { isPublished: false },
        });
        return created;
      });
    }

    return this.prisma.promotion.create({ data });
  }

  async update(id: number, dto: UpdatePromotionDto) {
    const existing = await this.prisma.promotion.findUnique({ where: { id } });
    if (!existing) return null;

    const data: Prisma.PromotionUpdateInput = {
      slot: dto.slot ?? undefined,
      title: dto.title ?? undefined,
      subtitle: dto.subtitle ?? undefined,
      ctaText: dto.ctaText ?? undefined,
      ctaLink: dto.ctaLink ?? undefined,
      bgImageUrl: dto.bgImageUrl ?? undefined,
      bgVideoUrl: dto.bgVideoUrl ?? undefined,
      font: dto.font ?? undefined,
      titleColor: dto.titleColor ?? undefined,
      textColor: dto.textColor ?? undefined,
      ctaBg: dto.ctaBg ?? undefined,
      ctaColor: dto.ctaColor ?? undefined,
      isPublished: dto.isPublished ?? undefined,
      startAt: dto.startAt ? new Date(dto.startAt) : undefined,
      endAt: dto.endAt ? new Date(dto.endAt) : undefined,
      position: dto.position ?? undefined,
      product: dto.productId
        ? { connect: { id: dto.productId } }
        : dto.productId === null
          ? { disconnect: true }
          : undefined,
    };

    if (
      (dto.slot ?? existing.slot) === PromotionSlot.PRODUCT_OF_DAY &&
      dto.isPublished
    ) {
      return this.prisma.$transaction(async (tx) => {
        const updated = await tx.promotion.update({ where: { id }, data });
        await tx.promotion.updateMany({
          where: {
            id: { not: updated.id },
            slot: PromotionSlot.PRODUCT_OF_DAY,
            isPublished: true,
            NOT: [
              { endAt: { lte: updated.startAt } },
              { startAt: { gte: updated.endAt } },
            ],
          },
          data: { isPublished: false },
        });
        return updated;
      });
    }

    return this.prisma.promotion.update({ where: { id }, data });
  }

  async list(filter?: { slot?: PromotionSlot; isPublished?: boolean }) {
    return this.prisma.promotion.findMany({
      where: {
        slot: filter?.slot,
        isPublished: filter?.isPublished,
      },
      include: { product: true, createdBy: true },
      orderBy: [
        { isPublished: "desc" },
        { slot: "asc" },
        { position: "asc" },
        { startAt: "desc" },
      ],
    });
  }

  async remove(id: number) {
    // Жёсткое удаление (при необходимости — поменять на soft delete)
    return this.prisma.promotion.delete({ where: { id } });
  }

  async getActiveBySlot(slot: PromotionSlot, now = new Date()) {
    const where: Prisma.PromotionWhereInput = {
      slot,
      isPublished: true,
      startAt: { lte: now },
      endAt: { gt: now },
    };

    if (slot === PromotionSlot.PRODUCT_OF_DAY) {
      return this.prisma.promotion.findFirst({
        where,
        orderBy: [{ position: "asc" }, { startAt: "desc" }],
        include: { product: true },
      });
    }

    return this.prisma.promotion.findMany({
      where,
      orderBy: [{ position: "asc" }, { startAt: "desc" }],
      include: { product: true },
    });
  }
}
