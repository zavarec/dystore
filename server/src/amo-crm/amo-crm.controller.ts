// server/src/amocrm/amocrm.controller.ts
import { Controller, Get, Query } from "@nestjs/common";
import { AmoAuthService } from "./amo-auth.service";

@Controller("amocrm")
export class AmoCrmController {
  constructor(private readonly auth: AmoAuthService) {}

  @Get("oauth/callback")
  async oauthCallback(@Query("code") code: string) {
    await this.auth.exchangeCodeForTokens(code);
    return { ok: true };
  }
}
