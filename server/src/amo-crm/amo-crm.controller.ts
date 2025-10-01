// server/src/amocrm/amocrm.controller.ts
import { Controller, Get, Query } from "@nestjs/common";
import { AmoAuthService } from "./amo-auth.service";
import { AmoHttpService } from "./amo-http.service";

@Controller("amocrm")
export class AmoCrmController {
  constructor(
    private readonly auth: AmoAuthService,
    private readonly http: AmoHttpService,
  ) {}

  @Get("oauth/callback")
  async oauthCallback(@Query("code") code: string) {
    await this.auth.exchangeCodeForTokens(code);
    return { ok: true };
  }

  @Get("ids")
  async ids() {
    const [pipelines, users, catalogs] = await Promise.all([
      this.http.request<any>({ url: "leads/pipelines", method: "GET" }),
      this.http.request<any>({
        url: "users",
        method: "GET",
        params: { limit: 250 },
      }),
      this.http.request<any>({ url: "catalogs", method: "GET" }),
    ]);

    return {
      pipelines: pipelines?._embedded?.pipelines?.map((p: any) => ({
        id: p.id,
        name: p.name,
        first_stage_id: p?._embedded?.statuses?.[0]?.id,
        statuses: p?._embedded?.statuses?.map((s: any) => ({
          id: s.id,
          name: s.name,
        })),
      })),
      users: users?._embedded?.users?.map((u: any) => ({
        id: u.id,
        name: u.name,
      })),
      catalogs: catalogs?._embedded?.catalogs?.map((c: any) => ({
        id: c.id,
        name: c.name,
      })),
    };
  }
}
