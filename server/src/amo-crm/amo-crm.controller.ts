// server/src/amocrm/amocrm.controller.ts
import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { AmoAuthService } from "./amo-auth.service";
import { AmoHttpService } from "./amo-http.service";
import { AmoProductsService } from "./amo-products.service";

@Controller("amocrm")
export class AmoCrmController {
  constructor(
    private readonly auth: AmoAuthService,
    private readonly http: AmoHttpService,
    private readonly products: AmoProductsService,
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

  // 1) Явно создать элемент в каталоге amo (проверка прав/ID каталога)
  @Post("debug/create-product")
  async createProduct(
    @Body() dto: { name?: string; price?: number; sku?: string },
  ) {
    const el = await this.products.createCatalogElement({
      name: dto?.name || `TEST-${Date.now()}`,
      price: dto?.price ?? 1000,
      sku: dto?.sku,
    });
    return { createdId: el.id, name: el.name };
  }

  // // 2) Гарантированно создать/найти элемент для нашего Product.id
  // @Post("debug/ensure/:id")
  // async ensure(
  //   @Param("id") id: string,
  //   @Body() dto: { name?: string; price?: number; sku?: string },
  // ) {
  //   const elementId = await this.products.ensureCatalogElementForProductId(
  //     Number(id),
  //     {
  //       fallbackName: dto?.name,
  //       price: dto?.price,
  //       sku: dto?.sku,
  //     },
  //   );
  //   return { elementId };
  // }
}
