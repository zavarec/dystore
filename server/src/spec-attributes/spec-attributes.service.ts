import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { Prisma } from "@prisma/client";
import { UpdateSpecAttributeDto } from "./dto/update-spec-attribute.dto";
import { CreateSpecAttributeDto } from "./dto/create-spec-attribute.dto";

@Injectable()
export class SpecAttributesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(q?: string) {
    const where: Prisma.SpecAttributeWhereInput | undefined = q
      ? {
          OR: [
            { label: { contains: q, mode: "insensitive" } },
            { key: { contains: q, mode: "insensitive" } },
            { unit: { contains: q, mode: "insensitive" } },
            { group: { contains: q, mode: "insensitive" } },
          ],
        }
      : undefined;

    return this.prisma.specAttribute.findMany({
      where,
      orderBy: [{ group: "asc" }, { order: "asc" }, { label: "asc" }],
    });
  }

  async get(id: number) {
    const row = await this.prisma.specAttribute.findUnique({ where: { id } });
    if (!row) throw new NotFoundException("Характеристика не найдена");
    return row;
  }

  async create(dto: CreateSpecAttributeDto) {
    const conflict = await this.prisma.specAttribute.findUnique({
      where: { key: dto.key },
    });
    if (conflict)
      throw new BadRequestException(
        "Характеристика с таким key уже существует",
      );

    return this.prisma.specAttribute.create({
      data: {
        key: dto.key,
        label: dto.label,
        unit: dto.unit ?? null,
        group: dto.group ?? null,
        order: dto.order ?? 0,
        type: (dto.type as any) ?? "STRING",
      },
    });
  }

  async update(id: number, dto: UpdateSpecAttributeDto) {
    await this.get(id);
    if (dto.key) {
      const conflict = await this.prisma.specAttribute.findUnique({
        where: { key: dto.key },
      });
      if (conflict && conflict.id !== id)
        throw new BadRequestException("Такой key уже занят");
    }
    return this.prisma.specAttribute.update({
      where: { id },
      data: {
        ...("key" in dto ? { key: dto.key! } : {}),
        ...("label" in dto ? { label: dto.label! } : {}),
        ...("unit" in dto ? { unit: dto.unit ?? null } : {}),
        ...("group" in dto ? { group: dto.group ?? null } : {}),
        ...("order" in dto ? { order: dto.order ?? 0 } : {}),
        ...("type" in dto ? { type: dto.type as any } : {}),
      },
    });
  }

  async remove(id: number) {
    // при желании: проверить, не используется ли в ProductSpec
    return this.prisma.specAttribute.delete({ where: { id } });
  }
}
