import { Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { Prisma } from "@prisma/client";
import { CreateCategoryPromoSectionDto } from "./dto/create-category-promo-section.dto";
import { UpdateCategoryPromoSectionDto } from "./dto/update-category-promo-section.dto";

@Injectable()
export class CategoryPromoSectionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCategoryPromoSectionDto, userId: string) {
    const d = dto as any;
    const data: any = {
      category: { connect: { id: d.categoryId } },
      variant: d.variant,
      placement: d.placement,
      order: d.order ?? 0,
      isActive: d.isActive ?? true,
      title: d.title ?? null,
      subtitle: d.subtitle ?? null,
      imageUrl: d.imageUrl ?? null,
      videoUrl: d.videoUrl ?? null,
      ctaText: d.ctaText ?? null,
      ctaLink: d.ctaLink ?? null,
      // Если шрифт не передан или null — не отправляем поле, сработает дефолт в БД
      font: d.hasOwnProperty("font") ? (d.font ?? undefined) : undefined,
      titleColor: d.titleColor ?? null,
      textColor: d.textColor ?? null,
      ctaBg: d.ctaBg ?? null,
      ctaColor: d.ctaColor ?? null,
      bgColor: d.bgColor ?? null,
      contentSide: d.contentSide ?? null,
      heightPx: d.heightPx ?? null,
      startsAt: d.startsAt ? new Date(d.startsAt) : null,
      endsAt: d.endsAt ? new Date(d.endsAt) : null,
      createdBy: { connect: { id: userId } },
    };

    return this.prisma.categoryPromoSection.create({ data });
  }

  async update(id: number, dto: UpdateCategoryPromoSectionDto) {
    const d = dto as any;
    const data: any = {
      category: d.categoryId ? { connect: { id: d.categoryId } } : undefined,
      variant: d.variant ?? undefined,
      placement: d.placement ?? undefined,
      order: d.order ?? undefined,
      isActive: d.isActive ?? undefined,
      // Строковые поля: если передан null — очищаем, если не передано — не трогаем
      title: d.hasOwnProperty("title")
        ? d.title === null
          ? null
          : d.title
        : undefined,
      subtitle: d.hasOwnProperty("subtitle")
        ? d.subtitle === null
          ? null
          : d.subtitle
        : undefined,
      imageUrl: d.hasOwnProperty("imageUrl")
        ? d.imageUrl === null
          ? null
          : d.imageUrl
        : undefined,
      videoUrl: d.hasOwnProperty("videoUrl")
        ? d.videoUrl === null
          ? null
          : d.videoUrl
        : undefined,
      ctaText: d.hasOwnProperty("ctaText")
        ? d.ctaText === null
          ? null
          : d.ctaText
        : undefined,
      ctaLink: d.hasOwnProperty("ctaLink")
        ? d.ctaLink === null
          ? null
          : d.ctaLink
        : undefined,
      font: d.font ?? undefined,
      titleColor: d.hasOwnProperty("titleColor")
        ? d.titleColor === null
          ? null
          : d.titleColor
        : undefined,
      textColor: d.hasOwnProperty("textColor")
        ? d.textColor === null
          ? null
          : d.textColor
        : undefined,
      ctaBg: d.hasOwnProperty("ctaBg")
        ? d.ctaBg === null
          ? null
          : d.ctaBg
        : undefined,
      ctaColor: d.hasOwnProperty("ctaColor")
        ? d.ctaColor === null
          ? null
          : d.ctaColor
        : undefined,
      bgColor: d.hasOwnProperty("bgColor")
        ? d.bgColor === null
          ? null
          : d.bgColor
        : undefined,
      contentSide: d.contentSide ?? undefined,
      heightPx: d.hasOwnProperty("heightPx")
        ? d.heightPx === null
          ? null
          : d.heightPx
        : undefined,
      startsAt: d.hasOwnProperty("startsAt")
        ? d.startsAt === null
          ? null
          : new Date(d.startsAt)
        : undefined,
      endsAt: d.hasOwnProperty("endsAt")
        ? d.endsAt === null
          ? null
          : new Date(d.endsAt)
        : undefined,
    };

    return this.prisma.categoryPromoSection.update({ where: { id }, data });
  }

  async remove(id: number) {
    return this.prisma.categoryPromoSection.delete({ where: { id } });
  }

  async listForCategory(categoryId: number) {
    const now = new Date();
    return this.prisma.categoryPromoSection.findMany({
      where: {
        categoryId,
        isActive: true,
        AND: [
          { OR: [{ startsAt: null }, { startsAt: { lte: now } }] },
          { OR: [{ endsAt: null }, { endsAt: { gte: now } }] },
        ],
      },
      orderBy: [{ placement: "asc" }, { order: "asc" }],
    });
  }

  async listAllAdmin() {
    return this.prisma.categoryPromoSection.findMany({
      include: { category: true, createdBy: true },
      orderBy: [{ createdAt: "desc" }],
    });
  }
}
