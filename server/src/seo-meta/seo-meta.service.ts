import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { UpsertSeoMetaDto } from "./dto/upsert-seo-meta.dto";

@Injectable()
export class SeoMetaService {
  constructor(private readonly prisma: PrismaService) {}

  upsert(data: UpsertSeoMetaDto) {
    const { pageType, entityId, locale = "ru", ...rest } = data as any;
    const prisma: any = this.prisma as any;
    return prisma.seoMeta.upsert({
      where: { pageType_entityId_locale: { pageType, entityId, locale } },
      update: rest,
      create: { pageType, entityId, locale, ...rest },
    });
  }

  findOne(pageType: string, entityId: string, locale = "ru") {
    const prisma: any = this.prisma as any;
    return prisma.seoMeta.findUnique({
      where: { pageType_entityId_locale: { pageType, entityId, locale } },
    });
  }

  list(params: { pageType?: string; entityId?: string; locale?: string }) {
    const { pageType, entityId, locale } = params;
    const prisma: any = this.prisma as any;
    return prisma.seoMeta.findMany({
      where: {
        pageType: pageType ?? undefined,
        entityId: entityId ?? undefined,
        locale: locale ?? undefined,
      },
      orderBy: { updatedAt: "desc" },
    });
  }

  remove(id: number) {
    const prisma: any = this.prisma as any;
    return prisma.seoMeta.delete({ where: { id } }).catch(() => {
      throw new NotFoundException("SeoMeta not found");
    });
  }
}
