import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { Prisma, PrismaClient, Product } from "@prisma/client";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { CategoriesService } from "../categories/categories.service";
import { SpecItemDto } from "./dto/save-specs.dto";
import { BoxItemDto } from "./dto/save-box-items.dto";
import { ensureSpecAttribute, slugifyKey } from "src/common/utils/slug";
import { isUUID } from "class-validator";

type ProductWithDetails = Prisma.ProductGetPayload<{
  include: {
    category: true;
    boxItems: { include: { accessory: true; customImage: true } };
    specs: { include: { attribute: true } };
  };
}>;

function toNull<T>(v: T | null | undefined): T | null {
  if (v == null) return null;
  if (typeof v === "string" && v.trim() === "") return null;
  return v as T;
}

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly categoriesService: CategoriesService,
  ) {}

  async findAll(): Promise<ProductWithDetails[]> {
    return this.prisma.product.findMany({
      include: {
        mainImage: true,
        dimensionsImage: true,
        category: true,
        boxItems: {
          include: { accessory: true, customImage: true },
          orderBy: { order: "asc" },
        },
        specs: {
          include: { attribute: true },
          orderBy: [{ attribute: { group: "asc" } }, { order: "asc" }],
        },
      },
    });
  }

  async findOne(id: number): Promise<ProductWithDetails | null> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        mainImage: true,
        dimensionsImage: true,
        category: true,
        boxItems: {
          include: { accessory: true, customImage: true },
          orderBy: { order: "asc" },
        },
        specs: {
          include: { attribute: true },
          orderBy: [{ attribute: { group: "asc" } }, { order: "asc" }],
        },
      },
    });

    if (!product) return null;

    const boxItems = product.boxItems.map((b) => ({
      id: b.id,
      productId: b.productId,
      accessoryId: b.accessoryId,
      customName: b.customName,
      description: b.description,
      qty: b.qty,
      order: b.order,
      customImageId: b.customImageId,
      customImageUrl: b.customImage?.url ?? null, // <- вот сюда кладём URL из File
      accessory: b.accessory
        ? {
            id: b.accessory.id,
            name: b.accessory.name,
            slug: b.accessory.slug,
            description: b.accessory.description,
            imageUrl: b.accessory.imageUrl,
            imageId: b.accessory.imageId,
          }
        : null,
      customImage: b.customImage,
    }));

    return {
      ...product,
      boxItems: boxItems,
    };
  }

  async findBySlug(slug: string): Promise<ProductWithDetails | null> {
    return this.prisma.product.findUnique({
      where: { slug },
      include: {
        mainImage: true,
        dimensionsImage: true,
        category: true,
        boxItems: {
          include: { accessory: true, customImage: true },
          orderBy: { order: "asc" },
        },
        specs: {
          include: { attribute: true },
          orderBy: [{ attribute: { group: "asc" } }, { order: "asc" }],
        },
      },
    });
  }

  async findByCategory(categoryId: number): Promise<ProductWithDetails[]> {
    return this.prisma.product.findMany({
      where: { categoryId },
      include: {
        mainImage: true,
        dimensionsImage: true,
        category: true,
        boxItems: {
          include: { accessory: true, customImage: true },
          orderBy: { order: "asc" },
        },
        specs: {
          include: { attribute: true },
          orderBy: [{ attribute: { group: "asc" } }, { order: "asc" }],
        },
      },
    });
  }

  async findByCategoryIncludingDescendants(
    categoryId: number,
  ): Promise<Product[]> {
    const allCategoryIds = await this.getAllDescendantCategoryIds(categoryId);
    return this.prisma.product.findMany({
      where: {
        categoryId: { in: allCategoryIds },
      },
      include: {
        category: true,
        mainImage: true,
        dimensionsImage: true,
        boxItems: { include: { accessory: true, customImage: true } },
        specs: { include: { attribute: true } },
      },
    });
  }

  private async getAllDescendantCategoryIds(
    categoryId: number,
  ): Promise<number[]> {
    const categories = await this.prisma.category.findMany();
    const collect = (id: number): number[] => {
      const children = categories.filter((cat) => cat.parentId === id);
      return [id, ...children.flatMap((child) => collect(child.id))];
    };
    return collect(categoryId);
  }

  async create(
    createProductDto: CreateProductDto,
  ): Promise<ProductWithDetails> {
    const { boxItems, specs, slug, ...productData } = createProductDto;

    // Проверка категории
    const category = await this.categoriesService.findOne(
      productData.categoryId,
    );
    if (!category) {
      throw new BadRequestException("Категория не найдена");
    }

    return this.prisma.$transaction(
      async (transaction: Prisma.TransactionClient) => {
        // Генерация slug (с уникальностью)
        const baseSlug = slug?.trim() || slugifyKey(productData.name);
        let uniqueSlug = baseSlug;
        let counter = 1;
        while (
          await transaction.product.findUnique({ where: { slug: uniqueSlug } })
        ) {
          uniqueSlug = `${baseSlug}-${counter++}`;
        }

        // Создание товара
        const productRecord = await transaction.product.create({
          data: { ...productData, slug: uniqueSlug },
        });

        // Комплектация (In the box)
        if (Array.isArray(boxItems) && boxItems.length > 0) {
          const boxItemsData = boxItems.map((boxItem, index) => ({
            productId: productRecord.id,
            accessoryId: boxItem.accessoryId ?? null,
            customName: boxItem.customName ?? null,
            customImage: boxItem.customImageId ?? null,
            description: boxItem.description ?? null,
            qty: Number(boxItem.qty ?? 1),
            order: Number.isFinite(boxItem.order) ? boxItem.order : index,
          }));

          await transaction.productBoxItem.createMany({ data: boxItemsData });
        }

        // Характеристики (Specifications)
        if (Array.isArray(specs) && specs.length > 0) {
          const specificationsToInsert: any[] = [];

          for (let index = 0; index < specs.length; index++) {
            const specification = specs[index];
            let attributeId = specification.attributeId;

            // Если нет attributeId, но есть label → создаём/находим атрибут
            if (!attributeId && specification.label) {
              attributeId = await ensureSpecAttribute(
                transaction as PrismaClient,
                specification.label,
                specification.unit,
              );
            }

            if (!attributeId) continue; // пустая строка → пропускаем

            specificationsToInsert.push({
              productId: productRecord.id,
              attributeId,
              valueString: specification.valueString ?? null,
              valueNumber: specification.valueNumber ?? null,
              valueBool:
                typeof specification.valueBool === "boolean"
                  ? specification.valueBool
                  : null,
              unitOverride: specification.unit ?? null,
              order: Number.isFinite(specification.order)
                ? specification.order
                : index,
            });
          }

          if (specificationsToInsert.length > 0) {
            await transaction.productSpec.createMany({
              data: specificationsToInsert,
            });
          }
        }

        const full = await transaction.product.findUnique({
          where: { id: productRecord.id },
          include: {
            category: true,
            boxItems: {
              include: { accessory: true },
              orderBy: { order: "asc" },
            },
            specs: {
              include: { attribute: true },
              orderBy: [{ attribute: { group: "asc" } }, { order: "asc" }],
            },
          },
        });

        // Возвращаем продукт с вложенными данными
        return full as ProductWithDetails;
      },
    );
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const { boxItems, specs, slug, ...productPatch } = updateProductDto;

    // валидируем категорию, если меняется
    if (typeof updateProductDto.categoryId === "number") {
      const category = await this.categoriesService.findOne(
        updateProductDto.categoryId,
      );
      if (!category) throw new BadRequestException("Категория не найдена");
    }

    // валидируем изображения, если они переданы
    if (updateProductDto.mainImageId) {
      const mainImage = await this.prisma.file.findUnique({
        where: { id: updateProductDto.mainImageId },
      });
      if (!mainImage)
        throw new BadRequestException("Основное изображение не найдено");
    }

    if (updateProductDto.dimensionsImageId) {
      const dimensionsImage = await this.prisma.file.findUnique({
        where: { id: updateProductDto.dimensionsImageId },
      });
      if (!dimensionsImage)
        throw new BadRequestException("Изображение габаритов не найдено");
    }

    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // 1) проверить, что продукт существует
      const existing = await tx.product.findUnique({ where: { id } });
      if (!existing) throw new BadRequestException("Товар не найден");

      // 2) обработка slug: если пришёл новый — сделать уникальным среди ДРУГИХ товаров
      let nextSlug = existing.slug;
      if (typeof slug === "string" && slug.trim()) {
        const baseSlug = slug.trim();
        let candidate = baseSlug;
        let k = 1;
        while (true) {
          const conflict = await tx.product.findUnique({
            where: { slug: candidate },
          });
          if (!conflict || conflict.id === id) break;
          candidate = `${baseSlug}-${++k}`;
        }
        nextSlug = candidate;
      }

      // 3) апдейт самого продукта
      const productRecord = await tx.product.update({
        where: { id },
        data: { ...productPatch, slug: nextSlug },
      });

      // ---------- Комплектация ----------
      if (boxItems !== undefined) {
        await tx.productBoxItem.deleteMany({ where: { productId: id } });

        if (Array.isArray(boxItems) && boxItems.length) {
          // 1) собрать кандидатов id и проверить их существование
          const candidateIds = Array.from(
            new Set(
              boxItems
                .map((b) => toNull(b.customImageId || null))
                .filter((x): x is string => !!x && isUUID(x)),
            ),
          );

          let existingFileIds = new Set<string>();
          if (candidateIds.length) {
            const existingFiles = await tx.file.findMany({
              select: { id: true },
              where: { id: { in: candidateIds } },
            });
            existingFileIds = new Set(existingFiles.map((f) => f.id));
          }

          // 2) подготовить payload, вычищая неверные id
          const data = boxItems.map((item, idx) => ({
            productId: id,
            accessoryId: item.accessoryId ?? null,
            customName: toNull(item.customName),
            description: toNull((item as any).description),
            qty: Number(item.qty ?? 1),
            order: Number.isFinite(item.order as any)
              ? (item.order as number)
              : idx,

            // FK безопасно:
            customImageId: (() => {
              const v = toNull(item.customImageId);
              return v && isUUID(v) && existingFileIds.has(v) ? v : null;
            })(),
            // customImageUrl: toNull(item.customImageUrl),
          }));

          // 3) записать
          if (data.length) {
            await tx.productBoxItem.createMany({ data });
          }
        }
      }

      // 5) характеристики: если поле присутствует (даже []), заменить полностью
      if (specs !== undefined) {
        await tx.productSpec.deleteMany({ where: { productId: id } });

        if (Array.isArray(specs) && specs.length) {
          const toInsert: Prisma.ProductSpecCreateManyInput[] = [];

          for (let i = 0; i < specs.length; i++) {
            const spec = specs[i];

            // поддержка двух режимов: attributeId или label
            let attributeId = spec.attributeId as number | undefined;
            if (!attributeId && (spec as any).label) {
              attributeId = await ensureSpecAttribute(
                tx as PrismaClient,
                (spec as any).label,
                spec.unit as any,
              );
            }
            if (!attributeId) continue;

            toInsert.push({
              productId: id,
              attributeId,
              valueString: spec.valueString ?? null,
              valueNumber: spec.valueNumber ?? null,
              valueBool:
                typeof spec.valueBool === "boolean" ? spec.valueBool : null,
              unitOverride: (spec as any).unit ?? null,
              order: Number.isFinite(spec.order as any)
                ? (spec.order as number)
                : i,
            });
          }

          if (toInsert.length) {
            await tx.productSpec.createMany({ data: toInsert });
          }
        }
      }

      // 6) вернуть с релейшенами
      const full = await tx.product.findUnique({
        where: { id: productRecord.id },
        include: {
          mainImage: true,
          dimensionsImage: true,
          category: true,
          boxItems: {
            include: { accessory: true, customImage: true },
            orderBy: { order: "asc" },
          },
          specs: {
            include: { attribute: true },
            orderBy: [{ attribute: { group: "asc" } }, { order: "asc" }],
          },
        },
      });

      return full as ProductWithDetails;
    });
  }

  async remove(id: number) {
    return this.prisma.product.delete({
      where: { id },
    });
  }

  // products.service.ts (продолжение класса)
  async replaceBoxItems(productId: number, items: BoxItemDto[]) {
    // убедимся, что продукт есть
    const exists = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { id: true },
    });
    if (!exists) throw new NotFoundException("Product not found");

    return this.prisma.$transaction(async (tx) => {
      await tx.productBoxItem.deleteMany({ where: { productId } });

      if (!items?.length) return [];

      await tx.productBoxItem.createMany({
        data: items.map((i, idx) => ({
          productId,
          accessoryId: i.accessoryId ?? null,
          customName: i.customName ?? null,
          customImage: i.customImageId ?? null,
          description: (i as any).description ?? null,
          qty: i.qty,
          order: i.order ?? idx,
        })),
      });

      return tx.productBoxItem.findMany({
        where: { productId },
        include: { accessory: true },
        orderBy: { order: "asc" },
      });
    });
  }

  async replaceSpecs(productId: number, items: SpecItemDto[]) {
    const exists = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { id: true },
    });
    if (!exists) throw new NotFoundException("Product not found");

    // валидация: ровно одно значение
    for (const it of items ?? []) {
      const filled = [it.valueString, it.valueNumber, it.valueBool].filter(
        (v) => v !== undefined && v !== null,
      );
      if (filled.length !== 1) {
        throw new BadRequestException(
          `attributeId=${it.attributeId}: укажи ровно одно значение (string|number|bool)`,
        );
      }
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.productSpec.deleteMany({ where: { productId } });

      if (!items?.length) return [];

      await tx.productSpec.createMany({
        data: items.map((i, idx) => ({
          productId,
          attributeId: i.attributeId ?? 0,
          valueString: i.valueString ?? null,
          valueNumber: i.valueNumber ?? null,
          valueBool: i.valueBool ?? null,
          unitOverride: i.unit ?? null,
          order: i.order ?? idx,
        })),
      });

      return tx.productSpec.findMany({
        where: { productId },
        include: { attribute: true },
        orderBy: [{ attribute: { group: "asc" } }, { order: "asc" }],
      });
    });
  }

  async setMainImage(productId: number, fileId: string) {
    // проверим существование
    await this.prisma.product.findUniqueOrThrow({
      where: { id: productId },
      select: { id: true },
    });
    await this.prisma.file.findUniqueOrThrow({
      where: { id: fileId },
      select: { id: true },
    });

    return this.prisma.product.update({
      where: { id: productId },
      data: { mainImageId: fileId },
      include: {
        mainImage: true,
      },
    });
  }

  async setDimensionsImage(productId: number, fileId: string) {
    await this.prisma.product.findUniqueOrThrow({
      where: { id: productId },
      select: { id: true },
    });
    await this.prisma.file.findUniqueOrThrow({
      where: { id: fileId },
      select: { id: true },
    });

    return this.prisma.product.update({
      where: { id: productId },
      data: { dimensionsImageId: fileId },
      include: { dimensionsImage: true },
    });
  }

  async addGalleryMedia(params: {
    productId: number;
    fileId: string;
    kind?: "IMAGE" | "VIDEO";
    role?: string; // 'MAIN' | 'GALLERY' | 'DIMENSIONS' | 'BRAND' | и т.п.
    alt?: string;
    title?: string;
    order?: number;
  }) {
    const { productId, fileId } = params;
    await this.prisma.product.findUniqueOrThrow({
      where: { id: productId },
      select: { id: true },
    });
    await this.prisma.file.findUniqueOrThrow({
      where: { id: fileId },
      select: { id: true },
    });

    // автоподбор order, если не указан
    let order = params.order;
    if (order === undefined) {
      const max = await this.prisma.productMedia.aggregate({
        where: { productId },
        _max: { order: true },
      });
      order = (max._max.order ?? -1) + 1;
    }

    return this.prisma.productMedia.create({
      data: {
        productId,
        fileId,
        kind: params.kind ?? "IMAGE",
        role: params.role ?? "GALLERY",
        order,
        alt: params.alt ?? null,
        title: params.title ?? null,
      },
      include: { file: true },
    });
  }

  async removeGalleryMedia(productId: number, mediaId: number) {
    // защита: удаляем только медиа данного товара
    const media = await this.prisma.productMedia.findUnique({
      where: { id: mediaId },
    });
    if (!media || media.productId !== productId) {
      throw new NotFoundException("Media not found for this product");
    }
    return this.prisma.productMedia.delete({ where: { id: mediaId } });
  }
}
