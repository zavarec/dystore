import { Injectable } from "@nestjs/common";
import { PageKey, SectionKey } from "@prisma/client";
import { PrismaService } from "../database/prisma.service";

@Injectable()
export class LayoutService {
  constructor(private readonly prisma: PrismaService) {}

  async getHomeLayout() {
    return this.prisma.pageSection.findMany({
      where: { page: PageKey.HOME, isEnabled: true },
      orderBy: [{ position: "asc" }, { id: "asc" }],
    });
  }

  async listAllSections() {
    return this.prisma.pageSection.findMany({
      where: { page: PageKey.HOME },
      orderBy: [{ position: "asc" }, { id: "asc" }],
    });
  }

  async reorder(items: { id: number; position: number }[]) {
    const updates = items.map((item) =>
      this.prisma.pageSection.update({
        where: { id: item.id },
        data: { position: item.position },
      }),
    );
    await this.prisma.$transaction(updates);
    return this.listAllSections();
  }

  async updateSection(
    id: number,
    data: Partial<{ title: string | null; isEnabled: boolean; settings: any }>,
  ) {
    return this.prisma.pageSection.update({
      where: { id },
      data: {
        title: data.title ?? undefined,
        isEnabled: data.isEnabled ?? undefined,
        settings: data.settings ?? undefined,
      },
    });
  }
}
