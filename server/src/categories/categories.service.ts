import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { Category, Prisma } from "@prisma/client";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { FindProductsDto } from "./dto/find-products.dto";

import { ProductSortBy } from "src/types/product.model";

type CategoryWithRelations = Category & {
  parent?: Category | null;
  children?: CategoryWithRelations[];
  products?: any[];
  image?: File | null; // <— relation
  imageUrl?: string | null; // <— для удобства фронта
};

const mapCategory = (c: any): CategoryWithRelations => ({
  ...c,
  imageUrl: c.image?.url ?? null, // <— вытаскиваем url из File
  children: (c.children ?? []).map(mapCategory),
});

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  private mapSort(
    sort: FindProductsDto["sort"],
  ): Prisma.ProductOrderByWithRelationInput[] {
    switch (sort) {
      case ProductSortBy.PRICE_LOW_TO_HIGH:
        return [{ price: "asc" }];
      case ProductSortBy.PRICE_HIGH_TO_LOW:
        return [{ price: "desc" }];
      case ProductSortBy.NEWEST:
        return [{ createdAt: "desc" }];
      case ProductSortBy.NAME:
        return [{ name: "asc" }];
      case ProductSortBy.POPULARITY:
      default:
        return [{ popularity: "desc" }];
    }
  }

  /**
   * Получить все категории с их связями
   */
  async findAll(): Promise<CategoryWithRelations[]> {
    const rows = await this.prisma.category.findMany({
      include: {
        parent: true,
        children: { include: { image: true } }, // если нужно превью у детей
        products: true,
        image: true,
      },
    });
    return rows.map(mapCategory);
  }

  /**
   * Получить только корневые категории (без родителей)
   */
  async findRootCategories(): Promise<CategoryWithRelations[]> {
    const rows = await this.prisma.category.findMany({
      where: { parentId: null },
      include: {
        children: {
          include: {
            children: true, // Включаем внуков для более полного дерева
            image: true,
          },
        },
        products: true,
        image: true,
      },
    });
    return rows.map(mapCategory);
  }

  /**
   * Получить дерево категорий (все категории организованные в иерархию)
   */
  async getCategoryTree(): Promise<CategoryWithRelations[]> {
    const allCategories = await this.prisma.category.findMany({
      include: {
        parent: true,
        children: true,
        products: true,
      },
    });

    // Строим дерево из плоского списка
    const categoryMap = new Map<number, CategoryWithRelations>();
    const rootCategories: CategoryWithRelations[] = [];

    // Создаем мапу всех категорий
    allCategories.forEach((category) => {
      categoryMap.set(category.id, { ...category, children: [] });
    });

    // Строим дерево
    allCategories.forEach((category) => {
      const node = categoryMap.get(category.id)!;

      if (category.parentId === null) {
        rootCategories.push(node);
      } else {
        const parent = categoryMap.get(category.parentId);
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(node);
        }
      }
    });

    return rootCategories;
  }

  /**
   * Получить категорию по ID с полной иерархией
   */
  async findOne(id: number): Promise<CategoryWithRelations | null> {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        image: true,
        parent: true,
        children: {
          include: {
            children: true,
          },
        },
        products: true,
      },
    });
    return category ? mapCategory(category) : null;
  }

  async findProductsBySlug(slug: string, q: FindProductsDto) {
    const deep = String(q.deep ?? "true") === "true";
    const page = q.page ?? 1;
    const limit = q.limit ?? 24;
    const skip = (page - 1) * limit;

    // 1) найдём id корневой категории
    const root = await this.prisma.category.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (!root) throw new NotFoundException("Category not found");

    // 2) соберём id всех потомков (включая корень) — рекурсивный CTE
    const idsRows = await this.prisma.$queryRaw<{ id: number }[]>`
      WITH RECURSIVE tree AS (
        SELECT id FROM "Category" WHERE slug = ${slug}
        UNION ALL
        SELECT c.id
        FROM "Category" c
        INNER JOIN tree t ON c."parentId" = t.id
      )
      SELECT id FROM tree
    `;
    const allIds = idsRows.map((r) => r.id);

    const categoryIds = deep ? allIds : [root.id];

    // 3) фильтры/сортировка/пагинация
    const where: Prisma.ProductWhereInput = {
      categoryId: { in: categoryIds },
      isActive: true,
      // price: { gte: q.minPrice, lte: q.maxPrice }, ...
    };

    const [total, items] = await this.prisma.$transaction([
      this.prisma.product.count({ where }),
      this.prisma.product.findMany({
        where,
        orderBy: this.mapSort(q.sort),
        skip,
        take: limit,
        include: {
          mainImage: true,
          dimensionsImage: true,
          // category: { select: { id: true, name: true, slug: true } },
        },
      }),
    ]);

    return {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
      items,
    };
  }

  /**
   * Получить все дочерние категории (включая вложенные)
   */
  async findDescendants(parentId: number): Promise<CategoryWithRelations[]> {
    const descendants: CategoryWithRelations[] = [];

    const findChildren = async (categoryId: number) => {
      const children = await this.prisma.category.findMany({
        where: { parentId: categoryId },
        include: {
          parent: true,
          children: true,
          products: true,
        },
      });

      for (const child of children) {
        descendants.push(child);
        await findChildren(child.id);
      }
    };

    await findChildren(parentId);
    return descendants;
  }

  /**
   * Создать новую категорию
   */
  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    // Проверяем, что родительская категория существует
    if (
      createCategoryDto.parentId !== undefined &&
      createCategoryDto.parentId !== null
    ) {
      const parentExists = await this.prisma.category.findUnique({
        where: { id: createCategoryDto.parentId },
      });

      if (!parentExists) {
        throw new BadRequestException("Родительская категория не найдена");
      }
    }

    const data: any = {
      name: createCategoryDto.name,
      slug: createCategoryDto.slug,
      description: createCategoryDto.description ?? null,
      // используем Unchecked-вариант: прямые FK
      ...(createCategoryDto.parentId !== undefined
        ? { parentId: createCategoryDto.parentId }
        : {}),
      // DTO.image трактуем как id файла
      ...((createCategoryDto as any).image !== undefined
        ? { imageId: (createCategoryDto as any).image }
        : {}),
    };

    return this.prisma.category.create({
      data,
      include: {
        parent: true,
        children: true,
      },
    });
  }

  /**
   * Обновить категорию
   */
  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryWithRelations> {
    // Проверяем, что категория не пытается стать своим собственным родителем
    if (updateCategoryDto.parentId === id) {
      throw new BadRequestException(
        "Категория не может быть своим собственным родителем",
      );
    }

    // Проверяем, что новый родитель существует
    if (
      updateCategoryDto.parentId !== undefined &&
      updateCategoryDto.parentId !== null
    ) {
      const parentExists = await this.prisma.category.findUnique({
        where: { id: updateCategoryDto.parentId },
      });

      if (!parentExists) {
        throw new BadRequestException("Родительская категория не найдена");
      }

      // Проверяем, что мы не создаем циклическую зависимость
      const descendants = await this.findDescendants(id);
      if (descendants.some((desc) => desc.id === updateCategoryDto.parentId!)) {
        throw new BadRequestException(
          "Нельзя переместить категорию в её собственную дочернюю категорию",
        );
      }
    }

    const data: any = {};
    if (updateCategoryDto.name !== undefined)
      data.name = updateCategoryDto.name;
    if (updateCategoryDto.slug !== undefined)
      data.slug = updateCategoryDto.slug;
    if (updateCategoryDto.description !== undefined)
      data.description = updateCategoryDto.description;

    // ✅ РОДИТЕЛЬ ЧЕРЕЗ РЕЛЯЦИЮ
    if (updateCategoryDto.parentId !== undefined) {
      if (updateCategoryDto.parentId === null) {
        data.parent = { disconnect: true };
      } else {
        // проверки как у тебя: существование и отсутствие цикла
        const parent = await this.prisma.category.findUnique({
          where: { id: updateCategoryDto.parentId },
        });
        if (!parent)
          throw new BadRequestException("Родительская категория не найдена");

        const descendants = await this.findDescendants(id);
        if (descendants.some((d) => d.id === updateCategoryDto.parentId)) {
          throw new BadRequestException(
            "Нельзя переместить категорию в её собственную дочернюю категорию",
          );
        }

        data.parent = { connect: { id: updateCategoryDto.parentId } };
      }
    }

    // Работа с изображением
    if (updateCategoryDto.imageId !== undefined) {
      if (updateCategoryDto.imageId === null) {
        data.image = { disconnect: true };
      } else {
        const file = await this.prisma.file.findUnique({
          where: { id: updateCategoryDto.imageId },
        });
        if (!file)
          throw new BadRequestException(
            `Файл с id=${updateCategoryDto.imageId} не найден`,
          );
        data.image = { connect: { id: updateCategoryDto.imageId } };
      }
    }

    return this.prisma.category.update({
      where: { id },
      data,
      include: {
        parent: true,
        children: true,
        products: true,
      },
    });
  }

  /**
   * Удалить категорию
   */
  async remove(id: number) {
    // Проверяем, есть ли дочерние категории
    const children = await this.prisma.category.findMany({
      where: { parentId: id },
    });

    if (children.length > 0) {
      throw new BadRequestException(
        "Нельзя удалить категорию, у которой есть дочерние категории",
      );
    }

    return this.prisma.category.delete({
      where: { id },
    });
  }
}
