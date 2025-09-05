import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { SeoMetaService } from "../seo-meta.service";

@ApiTags("Public SeoMeta")
@Controller("seo-meta")
export class PublicSeoMetaController {
  constructor(private readonly seoMeta: SeoMetaService) {}

  @Get(":pageType/:entityId")
  getOne(
    @Param("pageType") pageType: string,
    @Param("entityId") entityId: string,
    @Query("locale") locale = "ru",
  ) {
    return this.seoMeta.findOne(pageType, entityId, locale);
  }

  @Get()
  getOneQuery(
    @Query("pageType") pageType: string,
    @Query("entityId") entityId: string,
    @Query("locale") locale = "ru",
  ) {
    return this.seoMeta.findOne(pageType, entityId, locale);
  }
}
