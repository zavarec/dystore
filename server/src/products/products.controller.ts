import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ParseIntPipe,
  UseGuards,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { ProductsService } from "./products.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/role.guard";
import { Roles } from "../common/decorators/role.decorator";
import { Role } from "@prisma/client";

@ApiTags("Products")
@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiOperation({ summary: "Get all products" })
  @ApiResponse({ status: 200, description: "List of products" })
  @Get()
  async findAll() {
    try {
      return await this.productsService.findAll();
    } catch (error) {
      throw new HttpException(
        "Ошибка при получении списка товаров",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOperation({ summary: "Get product by slug" })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 404 })
  @Get("slug/:slug")
  async findOneBySlug(@Param("slug") slug: string) {
    const product = await this.productsService.findBySlug(slug);
    if (!product)
      throw new HttpException("Товар не найден", HttpStatus.NOT_FOUND);
    return product;
  }

  @ApiOperation({ summary: "Get product by ID" })
  @Get("id/:id")
  async findOne(@Param("id", ParseIntPipe) id: number) {
    const product = await this.productsService.findOne(id);
    if (!product)
      throw new HttpException("Товар не найден", HttpStatus.NOT_FOUND);
    return product;
  }

  @ApiOperation({ summary: "Get products by category including descendants" })
  @ApiResponse({ status: 200, description: "Products with subcategories" })
  @Get("category/:categoryId/with-descendants")
  async findByCategoryIncludingDescendants(
    @Param("categoryId", ParseIntPipe) categoryId: number,
  ) {
    try {
      return await this.productsService.findByCategoryIncludingDescendants(
        categoryId,
      );
    } catch (error) {
      throw new HttpException(
        "Ошибка при получении товаров с подкатегориями",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOperation({ summary: "Get products by category" })
  @ApiResponse({ status: 200, description: "Products in category" })
  @Get("category/:categoryId")
  async findByCategory(@Param("categoryId", ParseIntPipe) categoryId: number) {
    try {
      return await this.productsService.findByCategory(categoryId);
    } catch (error) {
      throw new HttpException(
        "Ошибка при получении товаров категории",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOperation({ summary: "Create new product (requires authentication)" })
  @ApiResponse({ status: 201, description: "Product created" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MANAGER, Role.DIRECTOR)
  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    try {
      return await this.productsService.create(createProductDto);
    } catch (error) {
      throw new HttpException(
        "Ошибка при создании товара",
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @ApiOperation({ summary: "Update product (requires authentication)" })
  @ApiResponse({ status: 200, description: "Product updated" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "Product not found" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MANAGER, Role.DIRECTOR)
  @Put(":id")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    try {
      const updatedProduct = await this.productsService.update(
        id,
        updateProductDto,
      );
      if (!updatedProduct) {
        throw new HttpException("Товар не найден", HttpStatus.NOT_FOUND);
      }
      return updatedProduct;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        "Ошибка при обновлении товара",
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @ApiOperation({ summary: "Delete product (requires authentication)" })
  @ApiResponse({ status: 200, description: "Product deleted" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "Product not found" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.DIRECTOR)
  @Delete(":id")
  async remove(@Param("id", ParseIntPipe) id: number) {
    try {
      await this.productsService.remove(id);
      return { message: "Товар успешно удален" };
    } catch (error) {
      throw new HttpException(
        "Ошибка при удалении товара",
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
