// src/amocrm/amo-orders.service.ts
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AmoHttpService } from "./amo-http.service";
import { AmoAuthService } from "./amo-auth.service";
import { AmoProductsService } from "./amo-products.service";
import { OrderDTO } from "./dto/amo-crm-order.dto";

/**
 * Логика:
 * 1) upsert контакта (по phone/email)
 * 2) создать сделку в нужной воронке/статусе
 * 3) привязать товары каталога к сделке
 * 4) добавить заметку с деталями
 */
@Injectable()
export class AmoOrdersService {
  constructor(
    private readonly cfg: ConfigService,
    private readonly http: AmoHttpService,
    private readonly auth: AmoAuthService,
    private readonly products: AmoProductsService,
    private readonly logger = new Logger(AmoOrdersService.name),
  ) {}

  private get pipelineId() {
    return Number(this.cfg.get("AMO_PIPELINE_ID"));
  }
  private get statusId() {
    return Number(this.cfg.get("AMO_STATUS_ID"));
  }
  private get responsibleUserId() {
    return Number(this.cfg.get("AMO_RESPONSIBLE_USER_ID"));
  }
  private get catalogId() {
    return Number(this.cfg.get("AMO_PRODUCTS_CATALOG_ID"));
  }
  private get productPriceId() {
    return Number(this.cfg.get("AMO_CF_PRODUCT_PRICE_ID"));
  }

  private leadCfv(order: OrderDTO) {
    const addrId = Number(this.cfg.get("AMO_CF_LEAD_ADDRESS_ID") || 0);
    const methodId = Number(
      this.cfg.get("AMO_CF_LEAD_DELIVERY_METHOD_ID") || 0,
    );
    const commentId = Number(this.cfg.get("AMO_CF_LEAD_COMMENT_ID") || 0);

    const cfv: any[] = [];
    if (addrId && order.deliveryAddress)
      cfv.push({
        field_id: addrId,
        values: [{ value: order.deliveryAddress }],
      });
    if (methodId && order.deliveryMethod)
      cfv.push({
        field_id: methodId,
        values: [{ value: order.deliveryMethod }],
      });
    if (commentId && order.comment)
      cfv.push({ field_id: commentId, values: [{ value: order.comment }] });

    if (this.productPriceId && order.items.length) {
      const totalItemsPrice = Math.round(
        order.items.reduce((acc, item) => acc + item.price * item.quantity, 0),
      );
      cfv.push({
        field_id: this.productPriceId,
        values: [
          {
            value: totalItemsPrice,
          },
        ],
      });
    }
    return cfv.length ? cfv : undefined;
  }

  // 1) Контакт
  private async upsertContact(
    customer: OrderDTO["customer"],
  ): Promise<number | null> {
    if (!customer?.phone && !customer?.email) return null;

    const query = customer.phone || customer.email!;
    const search = await this.http.request<any>({
      url: `contacts`,
      method: "GET",
      params: { query, limit: 1 },
    });
    if (search?._embedded?.contacts?.length) {
      return search._embedded.contacts[0].id;
    }

    const cfv = [
      customer.phone && {
        field_code: "PHONE",
        values: [{ value: customer.phone }],
      },
      customer.email && {
        field_code: "EMAIL",
        values: [{ value: customer.email }],
      },
    ].filter(Boolean);

    const created = await this.http.request<any>({
      url: `contacts`,
      method: "POST",
      data: [
        {
          name: customer.name || customer.phone || customer.email,
          custom_fields_values: cfv.length ? cfv : undefined,
        },
      ],
    });
    return created?._embedded?.contacts?.[0]?.id ?? null;
  }

  // 2) Сделка
  private async createLead(
    order: OrderDTO,
    contactId: number | null,
  ): Promise<number> {
    const payload = [
      {
        name: `Заказ #${order.orderId}`,
        price: Math.round(order.total),
        pipeline_id: this.pipelineId,
        status_id: this.statusId,
        responsible_user_id: this.responsibleUserId,
        tags: order.source ? [{ name: order.source }] : undefined,
        custom_fields_values: this.leadCfv(order),
        _embedded: contactId
          ? { contacts: [{ id: contactId, is_main: true }] }
          : undefined,
      },
    ];

    this.logger.log(
      "AMO payload (lead create)",
      JSON.stringify(payload, null, 2),
    );

    const created = await this.http.request<any>({
      url: `leads`,
      method: "POST",
      data: payload,
    });
    return created?._embedded?.leads?.[0]?.id;
  }

  // 3) Привязка товаров к сделке
  private async attachProducts(leadId: number, order: OrderDTO) {
    const links: any[] = [];

    for (const it of order.items) {
      // 3.1 Найти элемент каталога по SKU/названию
      const query = it.sku || it.name;
      let el = await this.products.findCatalogElement(query);

      // 3.2 Если нет — создать
      if (!el) {
        el = await this.products.createCatalogElement({
          name: it.name,
          sku: it.sku,
          price: it.price,
        });
      }

      if (!el?.id) continue;

      // 3.3 Линк к сделке
      links.push({
        to_entity_id: el.id,
        to_entity_type: "catalog_elements",
        metadata: {
          catalog_id: this.catalogId,
          quantity: it.quantity,
          // при необходимости можно зафиксировать сумму позиции:
          // amount: Math.round(it.price * it.quantity),
        },
      });
    }

    if (links.length) {
      await this.http.request<any>({
        url: `leads/${leadId}/link`,
        method: "POST",
        data: links,
      });
    }
  }

  // 4) Заметка
  private async addNote(leadId: number, order: OrderDTO) {
    const text = [
      `Заказ #${order.orderId}`,
      order.comment && `Комментарий: ${order.comment}`,
      order.deliveryMethod && `Доставка: ${order.deliveryMethod}`,
      order.deliveryAddress && `Адрес: ${order.deliveryAddress}`,
      "",
      "Состав:",
      ...order.items.map(
        (i) =>
          `• ${i.name} × ${i.quantity} = ${Math.round(i.price * i.quantity)}`,
      ),
      "",
      `Итого: ${Math.round(order.total)}`,
    ]
      .filter(Boolean)
      .join("\n");

    await this.http.request<any>({
      url: `leads/notes`,
      method: "POST",
      data: [{ note_type: "common", params: { text }, entity_id: leadId }],
    });
  }

  // Публичный метод: создать сделку по заказу
  async createOrderLead(
    order: OrderDTO,
  ): Promise<{ leadId: number; contactId: number | null }> {
    const contactId = await this.upsertContact(order.customer);
    const leadId = await this.createLead(order, contactId);
    await this.attachProducts(leadId, order);
    await this.addNote(leadId, order);
    return { leadId, contactId };
  }
}
