import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ValidationPipe,
  ParseIntPipe,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category } from '@prisma/client';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly service: CategoriesService) {}

  @Get()
  async findAll(): Promise<Category[]> {
    try {
      return await this.service.findAll();
    } catch (error) {
      throw new HttpException(
        `Ошибка при получении списка категорий,  ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('tree')
  async getCategoryTree(): Promise<Category[]> {
    try {
      return await this.service.getCategoryTree();
    } catch (error) {
      throw new HttpException(
        `Ошибка при получении дерева категорий,  ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('root')
  async findRootCategories(): Promise<Category[]> {
    try {
      return await this.service.findRootCategories();
    } catch (error) {
      throw new HttpException(
        `Ошибка при получении корневых категорий,  ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id/descendants')
  async findDescendants(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Category[]> {
    try {
      return await this.service.findDescendants(id);
    } catch (error) {
      throw new HttpException(
        `Ошибка при получении дочерних категорий,  ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Category> {
    try {
      const category = await this.service.findOne(id);
      if (!category) {
        throw new HttpException('Категория не найдена', HttpStatus.NOT_FOUND);
      }
      return category;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Ошибка при получении категории',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body(ValidationPipe) createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    try {
      return await this.service.create(createCategoryDto);
    } catch (error) {
      throw new HttpException(
        `Ошибка при создании категории, ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    try {
      await this.service.update(id, updateCategoryDto);
      const category = await this.service.findOne(id);
      if (!category) {
        throw new HttpException('Категория не найдена', HttpStatus.NOT_FOUND);
      }
      return category;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Ошибка при обновлении категории',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    try {
      await this.service.remove(id);
      return { message: 'Категория успешно удалена' };
    } catch (error) {
      throw new HttpException(
        `Ошибка при удалении категории, ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
