// src/upload/upload.module.ts
import { Module, MiddlewareConsumer, NestModule } from "@nestjs/common";
import { UploadController } from "./upload.controller";
import { UploadService } from "./upload.service";
import { S3Service } from "./s3.service";
import { UploadLoggerMiddleware } from "./middleware/upload-logger.middleware";

@Module({
  imports: [], // никакого MulterModule здесь
  controllers: [UploadController],
  providers: [UploadService, S3Service],
  exports: [UploadService, S3Service],
})
// export class UploadModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer.apply(UploadLoggerMiddleware).forRoutes("upload");
//   }
// }
export class UploadModule {}
