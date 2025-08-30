import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { Category } from "@prisma/client";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

type CategoryWithRelations = Category & {
  parent?: Category | null;
  children?: Category[];
  products?: any[];
};

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Получить все категории с их связями
   */
  async findAll(): Promise<CategoryWithRelations[]> {
    return this.prisma.category.findMany({
      include: {
        parent: true,
        children: true,
        products: true,
      },
    });
  }

  /**
   * Получить только корневые категории (без родителей)
   */
  async findRootCategories(): Promise<CategoryWithRelations[]> {
    return this.prisma.category.findMany({
      where: { parentId: null },
      include: {
        children: {
          include: {
            children: true, // Включаем внуков для более полного дерева
          },
        },
        products: true,
      },
    });
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
    return this.prisma.category.findUnique({
      where: { id },
      include: {
        parent: true,
        children: {
          include: {
            children: true,
          },
        },
        products: true,
      },
    });
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

    return this.prisma.category.create({
      data: createCategoryDto,
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

    return this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
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
