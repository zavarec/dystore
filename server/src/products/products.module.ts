import { Module } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { ProductsController } from "./products.controller";
import { CategoriesModule } from "../categories/categories.module";
import { CategoriesService } from "src/categories/categories.service";
import { PrismaService } from "src/database/prisma.service";

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, CategoriesService, PrismaService],
  imports: [CategoriesModule],
  exports: [ProductsService],
})
export class ProductsModule {}
