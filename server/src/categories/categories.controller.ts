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
import { CategoriesService } from "./categories.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { CategoryResponseDto } from "./dto/category-response.dto";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { Role } from "@prisma/client";
import { PaginationDto } from "../common/dto/pagination.dto";
import { ApiPaginatedResponse } from "../common/decorators/api-paginated-response.decorator";

@ApiTags("Categories")
@Controller("categories")
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiOperation({ summary: "Get all categories" })
  @ApiPaginatedResponse(CategoryResponseDto)
  @ApiQuery({ name: "includeInactive", required: false, type: Boolean })
  @Get()
  async findAll(
    @Query() paginationDto: PaginationDto,
    @Query("includeInactive") includeInactive?: boolean,
  ) {
    return this.categoriesService.findAll(paginationDto, includeInactive);
  }

  @ApiOperation({ summary: "Get category tree" })
  @ApiResponse({ status: 200, type: [CategoryResponseDto] })
  @Get("tree")
  async getCategoryTree() {
    return this.categoriesService.getCategoryTree();
  }

  @ApiOperation({ summary: "Get root categories" })
  @ApiResponse({ status: 200, type: [CategoryResponseDto] })
  @Get("root")
  async findRootCategories() {
    return this.categoriesService.findRootCategories();
  }

  @ApiOperation({ summary: "Get category by ID" })
  @ApiResponse({ status: 200, type: CategoryResponseDto })
  @ApiResponse({ status: 404, description: "Category not found" })
  @Get(":id")
  async findOne(@Param("id", ParseIntPipe) id: number) {
    return this.categoriesService.findOne(id);
  }

  @ApiOperation({ summary: "Get category descendants" })
  @ApiResponse({ status: 200, type: [CategoryResponseDto] })
  @Get(":id/descendants")
  async findDescendants(@Param("id", ParseIntPipe) id: number) {
    return this.categoriesService.findDescendants(id);
  }

  @ApiOperation({ summary: "Create new category (Admin only)" })
  @ApiResponse({ status: 201, type: CategoryResponseDto })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @ApiOperation({ summary: "Update category (Admin only)" })
  @ApiResponse({ status: 200, type: CategoryResponseDto })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiResponse({ status: 404, description: "Category not found" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Put(":id")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @ApiOperation({ summary: "Delete category (Admin only)" })
  @ApiResponse({ status: 200, description: "Category deleted" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiResponse({ status: 404, description: "Category not found" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(":id")
  async remove(@Param("id", ParseIntPipe) id: number) {
    return this.categoriesService.remove(id);
  }
}
