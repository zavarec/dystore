import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AmoAuthService } from "./amo-auth.service";
import { AmoHttpService } from "./amo-http.service";
import { AmoOrdersService } from "./amo-order.service";
import { AmoProductsService } from "./amo-products.service";
import { AmoCrmController } from "./amo-crm.controller";

@Module({
  imports: [ConfigModule],
  controllers:[AmoCrmController],
  providers: [
    AmoAuthService,
    AmoHttpService,
    AmoOrdersService,
    AmoProductsService,
  ],
  exports: [AmoOrdersService, AmoAuthService],
})
export class AmocrmModule {}
