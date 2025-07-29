import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Product } from '@prisma/client';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly categoriesService: CategoriesService,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.prisma.product.findMany({
      include: { category: true },
    });
  }

  async findOne(id: number): Promise<Product | null> {
    return this.prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
  }

  async findByCategory(categoryId: number): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: { categoryId },
      include: { category: true },
    });
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    // Проверяем существование категории
    const category = await this.categoriesService.findOne(
      createProductDto.categoryId,
    );
    if (!category) {
      throw new BadRequestException('Категория не найдена');
    }

    return this.prisma.product.create({
      data: createProductDto,
    });
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    // Если обновляется categoryId, проверяем существование категории
    if (updateProductDto.categoryId) {
      const category = await this.categoriesService.findOne(
        updateProductDto.categoryId,
      );
      if (!category) {
        throw new BadRequestException('Категория не найдена');
      }
    }

    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
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

  async remove(id: number) {
    return this.prisma.product.delete({
      where: { id },
    });
  }
}
