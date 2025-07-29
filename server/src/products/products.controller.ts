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
import { ProductsService } from './products.service';
import { Product } from '@prisma/client';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly service: ProductsService) {}

  @Get()
  async findAll(): Promise<Product[]> {
    try {
      return await this.service.findAll();
    } catch (error) {
      console.log(`Ошибка: ${error} при получении списка товаров`);
      throw new HttpException(
        'Ошибка при получении списка товаров',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('category/:categoryId')
  async findByCategory(
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ): Promise<Product[]> {
    try {
      return await this.service.findByCategory(categoryId);
    } catch (error) {
      console.log(`Ошибка: ${error} при получении товаров категории`);
      throw new HttpException(
        'Ошибка при получении товаров категории',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Product> {
    try {
      const product = await this.service.findOne(id);
      if (!product) {
        throw new HttpException('Товар не найден', HttpStatus.NOT_FOUND);
      }
      return product;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Ошибка при получении товара',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body(ValidationPipe) createProductDto: CreateProductDto,
  ): Promise<Product> {
    try {
      return await this.service.create(createProductDto);
    } catch (error) {
      console.log(`Ошибка: ${error} при создании товара`);
      throw new HttpException(
        'Ошибка при создании товара',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    try {
      await this.service.update(id, updateProductDto);
      const product = await this.service.findOne(id);
      if (!product) {
        throw new HttpException('Товар не найден', HttpStatus.NOT_FOUND);
      }
      return product;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Ошибка при обновлении товара',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('category/:categoryId/with-descendants')
  async findByCategoryIncludingDescendants(
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ): Promise<Product[]> {
    try {
      return await this.service.findByCategoryIncludingDescendants(categoryId);
    } catch (error) {
      console.error(`Ошибка: ${error} при получении товаров с подкатегориями`);
      throw new HttpException(
        'Ошибка при получении товаров с подкатегориями',
        HttpStatus.INTERNAL_SERVER_ERROR,
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
      return { message: 'Товар успешно удален' };
    } catch (error) {
      console.log(`Ошибка: ${error} при удалении товара`);
      throw new HttpException(
        'Ошибка при удалении товара',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
