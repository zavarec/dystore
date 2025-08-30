import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { CategoryPromoSectionsService } from "../category-promo-sections.service";
import { CreateCategoryPromoSectionDto } from "../dto/create-category-promo-section.dto";
import { UpdateCategoryPromoSectionDto } from "../dto/update-category-promo-section.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/role.guard";
import { Roles } from "../../common/decorators/role.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { Role, User } from "@prisma/client";

@Controller("admin/category-promo-sections")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.MANAGER, Role.DIRECTOR)
export class AdminCategoryPromoSectionsController {
  constructor(private readonly service: CategoryPromoSectionsService) {}

  @Get()
  async listAll() {
    return this.service.listAllAdmin();
  }

  @Post()
  async create(
    @Body() dto: CreateCategoryPromoSectionDto,
    @CurrentUser() user: User,
  ) {
    return this.service.create(dto, user.id);
  }

  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() dto: UpdateCategoryPromoSectionDto,
  ) {
    return this.service.update(Number(id), dto);
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return this.service.remove(Number(id));
  }
}
