import { Module } from "@nestjs/common";
import { SpecAttributesController } from "./spec-attributes.controller";
import { SpecAttributesService } from "./spec-attributes.service";
import { PrismaService } from "../database/prisma.service";

@Module({
  controllers: [SpecAttributesController],
  providers: [SpecAttributesService, PrismaService],
  exports: [SpecAttributesService],
})
export class SpecAttributesModule {}
