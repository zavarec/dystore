import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  ParseEnumPipe,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/role.guard";
import { Roles } from "../../common/decorators/role.decorator";
import { PromotionSlot, Role } from "@prisma/client";
import { PromotionsService } from "../promotions.service";
import { CreatePromotionDto } from "../dto/create-promotion.dto";
import { UpdatePromotionDto } from "../dto/update-promotion.dto";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { User } from "@prisma/client";

@ApiTags("Admin Promotions")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.DIRECTOR, Role.MANAGER)
@Controller("admin/promotions")
export class AdminPromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @Post()
  create(@Body() dto: CreatePromotionDto, @CurrentUser() user: User) {
    return this.promotionsService.create(dto, user.id);
  }

  @Patch(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdatePromotionDto,
  ) {
    return this.promotionsService.update(id, dto);
  }

  @Get()
  list(
    @Query("slot", new ParseEnumPipe(PromotionSlot, { optional: true }))
    slot?: PromotionSlot,
    @Query("isPublished", new ParseBoolPipe({ optional: true }))
    isPublished?: boolean,
  ) {
    return this.promotionsService.list({ slot, isPublished });
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.promotionsService.remove(id);
  }
}
