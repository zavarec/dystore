// promo.service.ts
import { Injectable, NotFoundException } from "@nestjs/common";
import {
  ContentSide,
  Prisma,
  PromoFont,
  PromoPageType,
  PromoSlot,
  PromoVariant,
} from "@prisma/client";
import { PrismaService } from "../database/prisma.service";
import { CreateProductPromoInput } from "./dto/promo-section-dto/create-promo-section.dto";

@Injectable()
export class PromoService {
  constructor(private prisma: PrismaService) {}

  async getForPage(
    pageType: PromoPageType,
    entityId: string,
    now = new Date(),
  ) {
    return this.prisma.promoPlacement.findMany({
      where: {
        pageType: pageType.toUpperCase() as any,
        entityId,
        isActive: true,
        promoSection: {
          isActive: true,
          AND: [
            { OR: [{ startsAt: null }, { startsAt: { lte: now } }] },
            { OR: [{ endsAt: null }, { endsAt: { gt: now } }] },
          ],
        },
      },
      include: { promoSection: true },
      orderBy: [{ slot: "asc" }, { order: "asc" }, { id: "asc" }],
    });
  }

  async createProductPromo(input: CreateProductPromoInput) {
    const product = await this.prisma.product.findUnique({
      where: { slug: input.productSlug },
      select: { slug: true },
    });
    if (!product) throw new NotFoundException("Product not found");

    // 1) Создаём контент секции
    const section = await this.prisma.promoSection.create({
      data: {
        variant: input.variant as any,
        title: input.title,
        subtitle: input.subtitle,
        imageUrl: input.imageUrl,
        videoUrl: input.videoUrl,
        ctaText: input.ctaText,
        ctaLink: input.ctaLink,
        font: input.font as any,
        titleColor: input.titleColor,
        textColor: input.textColor,
        ctaBg: input.ctaBg,
        ctaColor: input.ctaColor,
        bgColor: input.bgColor,
        contentSide: input.contentSide as any,
        heightPx: input.heightPx ?? null,
        paddingTopPx: input.paddingTopPx ?? null,
        paddingBottomPx: input.paddingBottomPx ?? null,
        contentFontSizePx: input.contentFontSizePx ?? null,
        startsAt: input.startsAt ?? null,
        endsAt: input.endsAt ?? null,
        isActive: input.isActive ?? true,
        createdById: input.createdById,
        titleFontSizePx: input.titleFontSizePx ?? null,
      },
      select: { id: true },
    });

    // 2) Вставляем placement для страницы продукта
    const placement = await this.prisma.promoPlacement.create({
      data: {
        pageType: "PRODUCT",
        entityId: product.slug, // главное: привязка к конкретному продукту через slug
        slot: input.slot,
        order: input.order ?? 0,
        isActive: true,
        promoSectionId: section.id, // связываем с контентом
        // локальные оверрайды
        fullWidth: input.fullWidth ?? null,
        marginTop: input.marginTop ?? null,
        marginBottom: input.marginBottom ?? null,
        zIndex: input.zIndex ?? null,
      },
    });

    return placement;
  }

  async listForProduct(productSlug: string) {
    // Опционально: фильтровать по активным/по таймингу
    const now = new Date();
    return this.prisma.promoPlacement.findMany({
      where: {
        pageType: "PRODUCT",
        entityId: productSlug,
        isActive: true,
        promoSection: {
          isActive: true,
          AND: [
            { OR: [{ startsAt: null }, { startsAt: { lte: now } }] },
            { OR: [{ endsAt: null }, { endsAt: { gte: now } }] },
          ],
        },
      },
      orderBy: [{ slot: "asc" }, { order: "asc" }, { createdAt: "asc" }],
      include: { promoSection: true },
    });
  }
}
