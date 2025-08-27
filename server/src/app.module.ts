import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";
import { APP_FILTER, APP_PIPE } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { ProductsModule } from "./products/products.module";
import { CategoriesModule } from "./categories/categories.module";
import { CartModule } from "./cart/cart.module";
import { OrdersModule } from "./orders/orders.module";
import { DatabaseModule } from "./database/database.module";
import { GlobalExceptionFilter } from "./common/filters/global-exception.filter";
import { PromotionsModule } from "./promotions/promotions.module";
import { LayoutModule } from "./layout/layout.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 минута
        limit: 10, // 10 запросов в минуту
      },
    ]),
    DatabaseModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    CategoriesModule,
    CartModule,
    OrdersModule,
    PromotionsModule,
    LayoutModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
