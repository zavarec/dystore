import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { LayoutService } from "./layout.service";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { Roles } from "../common/decorators/role.decorator";
import { Role } from "@prisma/client";
import { RolesGuard } from "../common/guards/role.guard";

@ApiTags("Layout Admin")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("admin/layout")
export class LayoutAdminController {
  constructor(private readonly layoutService: LayoutService) {}

  @Roles(Role.DIRECTOR, Role.MANAGER)
  @Get("home")
  adminHome() {
    return this.layoutService.listAllSections();
  }

  @Roles(Role.DIRECTOR, Role.MANAGER)
  @Patch("home/reorder")
  reorder(@Body() items: { id: number; position: number }[]) {
    return this.layoutService.reorder(items);
  }

  @Roles(Role.DIRECTOR, Role.MANAGER)
  @Patch("home/section/:id")
  updateSection(
    @Param("id", ParseIntPipe) id: number,
    @Body()
    body: Partial<{ title: string | null; isEnabled: boolean; settings: any }>,
  ) {
    return this.layoutService.updateSection(id, body);
  }
}
