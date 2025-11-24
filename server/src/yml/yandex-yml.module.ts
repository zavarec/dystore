import { Module } from "@nestjs/common";
import { YandexYmlService } from "./yandex-yml.service";
import { YandexYmlController } from "./yandex-yml.controller";

@Module({
  providers: [YandexYmlService],
  controllers: [YandexYmlController],
})
export class YandexYmlModule {}
