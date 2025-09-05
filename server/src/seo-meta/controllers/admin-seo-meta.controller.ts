import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/role.guard";
import { Roles } from "../../common/decorators/role.decorator";
import { Role } from "@prisma/client";
import { SeoMetaService } from "../seo-meta.service";
import { UpsertSeoMetaDto } from "../dto/upsert-seo-meta.dto";

@ApiTags("Admin SeoMeta")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.DIRECTOR, Role.MANAGER)
@Controller("admin/seo-meta")
export class AdminSeoMetaController {
  constructor(private readonly seoMeta: SeoMetaService) {}

  @Post("upsert")
  upsert(@Body() dto: UpsertSeoMetaDto) {
    return this.seoMeta.upsert(dto);
  }

  @Get()
  list(
    @Query("pageType") pageType?: string,
    @Query("entityId") entityId?: string,
    @Query("locale") locale?: string,
  ) {
    return this.seoMeta.list({ pageType, entityId, locale });
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.seoMeta.remove(id);
  }
}
