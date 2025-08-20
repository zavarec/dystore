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
  Query,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from "@nestjs/swagger";
import { ProductsService } from "./products.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { ProductResponseDto } from "./dto/update-product.dto";
import { ProductsFilterDto } from "./dto/update-product.dto";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/role.guard";
import { Roles } from "../common/decorators/role.decorator";
import { Role } from "@prisma/client";
import { PaginationDto } from "../common/dto/pagination.dto";
import { ApiPaginatedResponse } from "../common/decorators/api-paginated-response.decorator";

@ApiTags("Products")
@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiOperation({ summary: "Get all products" })
  @ApiPaginatedResponse(ProductResponseDto)
  @Get()
  async findAll(
    @Query() paginationDto: PaginationDto,
    @Query() filterDto: ProductsFilterDto,
  ) {
    return this.productsService.findAll(paginationDto, filterDto);
  }

  @ApiOperation({ summary: "Get featured products" })
  @ApiResponse({ status: 200, type: [ProductResponseDto] })
  @Get("featured")
  async findFeatured(@Query("limit") limit?: number) {
    return this.productsService.findFeatured(limit || 10);
  }

  @ApiOperation({ summary: "Get popular products" })
  @ApiResponse({ status: 200, type: [ProductResponseDto] })
  @Get("popular")
  async findPopular(@Query("limit") limit?: number) {
    return this.productsService.findPopular(limit || 10);
  }

  @ApiOperation({ summary: "Get product by ID" })
  @ApiResponse({ status: 200, type: ProductResponseDto })
  @ApiResponse({ status: 404, description: "Product not found" })
  @Get(":id")
  async findOne(@Param("id", ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @ApiOperation({ summary: "Get products by category" })
  @ApiPaginatedResponse(ProductResponseDto)
  @Get("category/:categoryId")
  async findByCategory(
    @Param("categoryId", ParseIntPipe) categoryId: number,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.productsService.findByCategory(categoryId, paginationDto);
  }

  @ApiOperation({ summary: "Create new product (Admin only)" })
  @ApiResponse({ status: 201, type: ProductResponseDto })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @ApiOperation({ summary: "Update product (Admin only)" })
  @ApiResponse({ status: 200, type: ProductResponseDto })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiResponse({ status: 404, description: "Product not found" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Put(":id")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @ApiOperation({ summary: "Delete product (Admin only)" })
  @ApiResponse({ status: 200, description: "Product deleted" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiResponse({ status: 404, description: "Product not found" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(":id")
  async remove(@Param("id", ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }

  @ApiOperation({ summary: "Update product stock (Admin/Moderator)" })
  @ApiResponse({ status: 200, type: ProductResponseDto })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MODERATOR)
  @Put(":id/stock")
  async updateStock(
    @Param("id", ParseIntPipe) id: number,
    @Body("stock") stock: number,
  ) {
    return this.productsService.updateStock(id, stock);
  }
}
