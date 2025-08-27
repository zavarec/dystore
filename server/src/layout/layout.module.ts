import { Module } from "@nestjs/common";
import { LayoutService } from "./layout.service";
import { LayoutPublicController } from "./layout.public.controller";
import { LayoutAdminController } from "./layout.admin.controller";
import { DatabaseModule } from "../database/database.module";

@Module({
  imports: [DatabaseModule],
  providers: [LayoutService],
  controllers: [LayoutPublicController, LayoutAdminController],
})
export class LayoutModule {}
