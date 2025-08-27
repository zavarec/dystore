// src/categories/categories.controller.ts
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
import { CategoriesService } from "./categories.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/role.guard";
import { Roles } from "../common/decorators/role.decorator";
import { Role } from "@prisma/client";

@ApiTags("Categories")
@Controller("categories")
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiOperation({ summary: "Get all categories" })
  @ApiResponse({ status: 200, description: "List of categories" })
  @Get()
  async findAll() {
    try {
      return await this.categoriesService.findAll();
    } catch (error) {
      throw new HttpException(
        `Ошибка при получении списка категорий: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOperation({ summary: "Get category tree" })
  @ApiResponse({ status: 200, description: "Category tree structure" })
  @Get("tree")
  async getCategoryTree() {
    try {
      return await this.categoriesService.getCategoryTree();
    } catch (error) {
      throw new HttpException(
        `Ошибка при получении дерева категорий: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOperation({ summary: "Get root categories" })
  @ApiResponse({ status: 200, description: "Root categories" })
  @Get("root")
  async findRootCategories() {
    try {
      return await this.categoriesService.findRootCategories();
    } catch (error) {
      throw new HttpException(
        `Ошибка при получении корневых категорий: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOperation({ summary: "Get category by ID" })
  @ApiResponse({ status: 200, description: "Category details" })
  @ApiResponse({ status: 404, description: "Category not found" })
  @Get(":id")
  async findOne(@Param("id", ParseIntPipe) id: number) {
    try {
      const category = await this.categoriesService.findOne(id);
      if (!category) {
        throw new HttpException("Категория не найдена", HttpStatus.NOT_FOUND);
      }
      return category;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        "Ошибка при получении категории",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOperation({ summary: "Get category descendants" })
  @ApiResponse({ status: 200, description: "Category descendants" })
  @Get(":id/descendants")
  async findDescendants(@Param("id", ParseIntPipe) id: number) {
    try {
      return await this.categoriesService.findDescendants(id);
    } catch (error) {
      throw new HttpException(
        `Ошибка при получении дочерних категорий: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOperation({ summary: "Create new category (requires authentication)" })
  @ApiResponse({ status: 201, description: "Category created" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MANAGER, Role.DIRECTOR)
  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    try {
      return await this.categoriesService.create(createCategoryDto);
    } catch (error) {
      throw new HttpException(
        `Ошибка при создании категории: ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @ApiOperation({ summary: "Update category (requires authentication)" })
  @ApiResponse({ status: 200, description: "Category updated" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "Category not found" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MANAGER, Role.DIRECTOR)
  @Put(":id")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    try {
      return await this.categoriesService.update(id, updateCategoryDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        "Ошибка при обновлении категории",
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @ApiOperation({ summary: "Delete category (requires authentication)" })
  @ApiResponse({ status: 200, description: "Category deleted" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "Category not found" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.DIRECTOR)
  @Delete(":id")
  async remove(@Param("id", ParseIntPipe) id: number) {
    try {
      await this.categoriesService.remove(id);
      return { message: "Категория успешно удалена" };
    } catch (error) {
      throw new HttpException(
        `Ошибка при удалении категории: ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
