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
    unit?: string; // Единица измерения (например, "шт")
  }) {
    const skuId = Number(this.cfg.get("AMO_CF_CATALOG_SKU_ID") || 0);
    const priceId = Number(
      this.cfg.get("AMO_CF_CATALOG_ELEMENT_PRICE_ID") || 0,
    );
    const unitId = Number(this.cfg.get("AMO_CF_CATALOG_UNIT_ID") || 0);

    const cf: any[] = [];
    if (skuId > 0 && params.sku) {
      cf.push({ field_id: skuId, values: [{ value: params.sku }] });
    }
    if (priceId > 0 && typeof params.price === "number") {
      cf.push({
        field_id: priceId,
        values: [{ value: Math.round(params.price) }],
      });
    }
    if (unitId > 0) {
      const unitValue = (params.unit || "шт").trim();
      if (unitValue) {
        cf.push({ field_id: unitId, values: [{ value: unitValue }] });
      }
    }

    const payload = [
      {
        name: params.name,
        ...(cf.length ? { custom_fields_values: cf } : {}), // <-- если cf пуст, ничего не шлём
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
