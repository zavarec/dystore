import {
  Controller,
  Get,
  Header,
  Res,
} from "@nestjs/common";
import type { Response } from "express";
import { YandexYmlService } from "./yandex-yml.service";

@Controller("feeds")
export class YandexYmlController {
  constructor(private readonly yandexYmlService: YandexYmlService) {}

  @Get("yandex.yml")
  async getYml(@Res() res: Response) {
    const xml = await this.yandexYmlService.buildFeed();
    res
      .status(200)
      .set({
        "Content-Type": "application/xml; charset=UTF-8",
        "Cache-Control": "public, max-age=900",
      })
      .send(xml);
  }
}
