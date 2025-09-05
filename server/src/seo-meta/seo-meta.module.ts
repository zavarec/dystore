import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { SeoMetaService } from "./seo-meta.service";
import { AdminSeoMetaController } from "./controllers/admin-seo-meta.controller";
import { PublicSeoMetaController } from "./controllers/public-seo-meta.controller";

@Module({
  controllers: [AdminSeoMetaController, PublicSeoMetaController],
  providers: [SeoMetaService],
  imports: [DatabaseModule],
  exports: [SeoMetaService],
})
export class SeoMetaModule {}
