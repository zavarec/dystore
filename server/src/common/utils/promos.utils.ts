import { Prisma } from "@prisma/client";
import {
  CreatePromoSectionDto,
  UpdatePromoSectionDto,
} from "src/promos/dto/promo-section-dto/create-promo-section.dto";

function parseJsonMaybe(v: unknown): unknown {
  if (typeof v === "string") {
    try {
      return JSON.parse(v);
    } catch {
      return v;
    }
  }
  return v;
}

function toDateOrNull(v?: string): Date | null | undefined {
  if (v === undefined) return undefined;
  if (!v) return null;
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
}

export function normalizeSectionCreate(dto: CreatePromoSectionDto) {
  const content = parseJsonMaybe(dto.content) as
    | Prisma.InputJsonValue
    | undefined;

  return {
    variant: dto.variant,
    title: dto.title,
    subtitle: dto.subtitle,
    isActive: dto.isActive ?? true,

    imageUrl: dto.imageUrl,
    videoUrl: dto.videoUrl,
    ctaText: dto.ctaText,
    ctaLink: dto.ctaLink,

    // стили/цвета
    font: dto.font,
    titleColor: dto.titleColor,
    textColor: dto.textColor,
    ctaBg: dto.ctaBg,
    ctaColor: dto.ctaColor,
    bgColor: dto.bgColor,
    contentSide: dto.contentSide,
    heightPx: dto.heightPx,

    // стили/числа
    paddingTopPx: dto.paddingTopPx,
    paddingBottomPx: dto.paddingBottomPx,
    contentFontSizePx: dto.contentFontSizePx,
    titleFontSizePx: dto.titleFontSizePx,

    // JSONB
    content,

    // даты
    startsAt: toDateOrNull(dto.startsAt) ?? null,
    endsAt: toDateOrNull(dto.endsAt) ?? null,

    // автор
    createdBy: { connect: { id: dto.createdById ?? "admin-system" } },
  } satisfies Prisma.PromoSectionCreateInput;
}

export function normalizeSectionUpdate(dto: UpdatePromoSectionDto) {
  const data: Prisma.PromoSectionUpdateInput = {};

  if (dto.variant !== undefined) data.variant = dto.variant;
  if (dto.title !== undefined) data.title = dto.title;
  if (dto.subtitle !== undefined) data.subtitle = dto.subtitle;
  if (dto.isActive !== undefined) data.isActive = dto.isActive;

  if (dto.imageUrl !== undefined) data.imageUrl = dto.imageUrl;
  if (dto.videoUrl !== undefined) data.videoUrl = dto.videoUrl;
  if (dto.ctaText !== undefined) data.ctaText = dto.ctaText;
  if (dto.ctaLink !== undefined) data.ctaLink = dto.ctaLink;

  // стили/цвета
  if (dto.font !== undefined) data.font = dto.font;
  if (dto.titleColor !== undefined) data.titleColor = dto.titleColor;
  if (dto.textColor !== undefined) data.textColor = dto.textColor;
  if (dto.ctaBg !== undefined) data.ctaBg = dto.ctaBg;
  if (dto.ctaColor !== undefined) data.ctaColor = dto.ctaColor;
  if (dto.bgColor !== undefined) data.bgColor = dto.bgColor;
  if (dto.contentSide !== undefined) data.contentSide = dto.contentSide;
  if (dto.heightPx !== undefined) data.heightPx = dto.heightPx;

  if (dto.paddingTopPx !== undefined) data.paddingTopPx = dto.paddingTopPx;
  if (dto.paddingBottomPx !== undefined)
    data.paddingBottomPx = dto.paddingBottomPx;
  if (dto.contentFontSizePx !== undefined)
    data.contentFontSizePx = dto.contentFontSizePx;
  if (dto.titleFontSizePx !== undefined)
    data.titleFontSizePx = dto.titleFontSizePx;

  if (dto.content !== undefined) {
    data.content = parseJsonMaybe(dto.content) as Prisma.InputJsonValue;
  }

  const s = toDateOrNull(dto.startsAt);
  if (dto.startsAt !== undefined) data.startsAt = s;

  const e = toDateOrNull(dto.endsAt);
  if (dto.endsAt !== undefined) data.endsAt = e;

  if (dto.createdById !== undefined)
    data.createdBy = { connect: { id: dto.createdById } };

  return data;
}
