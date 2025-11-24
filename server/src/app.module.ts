import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { validationSchema } from "./config/validation.schema";
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

import { SeoMetaModule } from "./seo-meta/seo-meta.module";
import { CsrfController } from "./common/controllers/csrf.controller";
import { SpecAttributesModule } from "./spec-attributes/spec-attributes.module";
import { PromosModule } from "./promos/promo.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { UploadModule } from "./upload/upload.module";
import { AmocrmModule } from "./amo-crm/amo-crm.module";
import { ContactModule } from "./contact/contact.module";
import { YandexYmlModule } from "./yml/yandex-yml.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
      // validationSchema,
    }),
    ServeStaticModule.forRootAsync({
      useFactory: () => {
        const uploadPath = process.env.UPLOAD_PATH || "./uploads";
        return [
          {
            rootPath: join(process.cwd(), uploadPath),
            serveRoot: "/uploads",
            exclude: ["/api*"], // исключаем API роуты
          },
        ];
      },
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

    SeoMetaModule,
    SpecAttributesModule,
    PromosModule,
    UploadModule,
    AmocrmModule,
    ContactModule,
    YandexYmlModule,
  ],
  controllers: [AppController, CsrfController],
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
