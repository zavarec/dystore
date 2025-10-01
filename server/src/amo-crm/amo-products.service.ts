import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AmoHttpService } from "./amo-http.service";

@Injectable()
export class AmoProductsService {
  constructor(
    private readonly cfg: ConfigService,
    private readonly http: AmoHttpService,
  ) {}

  private get catalogId() {
    return Number(this.cfg.get("AMO_PRODUCTS_CATALOG_ID"));
  }

  async findCatalogElement(query: string) {
    const res = await this.http.request<any>({
      url: `catalogs/${this.catalogId}/elements`,
      method: "GET",
      params: { query, limit: 1 },
    });
    return res?._embedded?.elements?.[0] ?? null;
  }

  async createCatalogElement(params: {
    name: string;
    sku?: string;
    price?: number;
  }) {
    const cf: any[] = [];
    if (params.sku) {
      cf.push({
        field_id: 223344, // TODO: заменить на ID поля SKU в каталоге
        values: [{ value: params.sku }],
      });
    }
    if (typeof params.price === "number") {
      cf.push({
        field_id: 223345, // TODO: заменить на ID поля цены в каталоге (если используете кастомное)
        values: [{ value: Math.round(params.price) }],
      });
    }

    const payload = [
      {
        name: params.name,
        custom_fields_values: cf.length ? cf : undefined,
      },
    ];
    const res = await this.http.request<any>({
      url: `catalogs/${this.catalogId}/elements`,
      method: "POST",
      data: payload,
    });
    return res?._embedded?.elements?.[0] ?? null;
  }
}
