import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Prisma, ProductMediaType, SpecType } from "@prisma/client";
import { PrismaService } from "src/database/prisma.service";

const productInclude = {
  category: true,
  mainImage: {
    select: { url: true },
  },
  media: {
    where: { kind: ProductMediaType.IMAGE },
    include: { file: { select: { url: true } } },
    orderBy: [{ order: "asc" }, { id: "asc" }],
  },
  specs: {
    include: { attribute: true },
    orderBy: { order: "asc" },
  },
} satisfies Prisma.ProductInclude;

type ProductWithRelations = Prisma.ProductGetPayload<{
  include: typeof productInclude;
}>;

type DeliveryOption = { cost: string; days: string };

@Injectable()
export class YandexYmlService {
  private readonly defaults = {
    shopName: "Dyson Group",
    companyName: "Dyson Group",
    currency: "RUB",
    brand: "Dyson",
    frontendOrigin: "https://dyson-group.ru",
    deliveryOptions: "0:1-3;500:1-2",
  };

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async buildFeed(): Promise<string> {
    const frontendOrigin = this.normalizeOrigin(
      this.getEnv("FRONTEND_ORIGIN", this.defaults.frontendOrigin),
    );
    const shopName = this.getEnv("FEED_SHOP_NAME", this.defaults.shopName);
    const companyName = this.getEnv(
      "FEED_COMPANY_NAME",
      this.defaults.companyName,
    );
    const currencyId = this.getEnv("FEED_CURRENCY", this.defaults.currency);
    const brand = this.getEnv("FEED_BRAND", this.defaults.brand);
    const deliveryOptions = this.parseDeliveryOptions(
      this.getEnv("FEED_DELIVERY_OPTIONS", this.defaults.deliveryOptions),
    );

    const products = await this.prisma.product.findMany({
      where: {
        isActive: true,
        price: { gt: 0 },
      },
      include: productInclude,
      orderBy: [{ updatedAt: "desc" }],
    });

    const categories = this.buildCategories(products);
    const offersXml = products
      .map((product) =>
        this.buildOfferXml(
          product,
          {
            frontendOrigin,
            currencyId,
            brand,
          },
          deliveryOptions,
        ),
      )
      .join("");

    const dateAttr = this.buildDateAttribute(new Date());

    return [
      '<?xml version="1.0" encoding="UTF-8"?>',
      `<yml_catalog date="${dateAttr}">`,
      "<shop>",
      `<name>${this.escape(shopName)}</name>`,
      `<company>${this.escape(companyName)}</company>`,
      `<url>${this.escape(frontendOrigin)}</url>`,
      "<currencies>",
      `<currency id="${this.escape(currencyId)}" rate="1"/>`,
      "</currencies>",
      "<categories>",
      categories
        .map(
          (category) =>
            `<category id="${category.id}">${this.escape(category.name)}</category>`,
        )
        .join(""),
      "</categories>",
      "<offers>",
      offersXml,
      "</offers>",
      "</shop>",
      "</yml_catalog>",
    ]
      .join("")
      .trim();
  }

  private buildCategories(products: ProductWithRelations[]) {
    const map = new Map<number, { id: number; name: string }>();
    products.forEach((product) => {
      if (product.category && !map.has(product.categoryId)) {
        map.set(product.categoryId, {
          id: product.categoryId,
          name: product.category.name,
        });
      }
    });
    return Array.from(map.values());
  }

  private buildOfferXml(
    product: ProductWithRelations,
    context: {
      frontendOrigin: string;
      currencyId: string;
      brand: string;
    },
    deliveryOptions: DeliveryOption[],
  ): string {
    const url = `${context.frontendOrigin}/product/${product.slug}`;
    const descriptionSrc =
      product.description?.trim() ??
      product.shortDescription?.trim() ??
      product.name;
    const description = this.escape(this.stripHtml(descriptionSrc ?? ""));

    const pictures = this.collectPictures(product, context.frontendOrigin)
      .slice(0, 10)
      .map((picture) => `<picture>${this.escape(picture)}</picture>`)
      .join("");

    const deliveryOptionsXml = deliveryOptions.length
      ? `<delivery-options>${deliveryOptions
          .map(
            (option) =>
              `<option cost="${this.escape(option.cost)}" days="${this.escape(option.days)}"/>`,
          )
          .join("")}</delivery-options>`
      : "";

    const paramsXml = product.specs
      .map((spec) => this.buildParamXml(spec))
      .filter((param): param is string => Boolean(param))
      .join("");

    const countXml =
      product.stock && product.stock > 0
        ? `<count>${product.stock}</count>`
        : "";

    return [
      `<offer id="${product.id}" available="${product.stock > 0 ? "true" : "false"}">`,
      `<url>${this.escape(url)}</url>`,
      `<price>${Number(product.price).toFixed(2)}</price>`,
      `<currencyId>${this.escape(context.currencyId)}</currencyId>`,
      `<categoryId>${product.categoryId}</categoryId>`,
      pictures,
      `<name>${this.escape(product.name)}</name>`,
      `<vendor>${this.escape(context.brand)}</vendor>`,
      `<vendorCode>${this.escape(product.slug)}</vendorCode>`,
      `<description><![CDATA[${description}]]></description>`,
      "<store>true</store>",
      "<pickup>false</pickup>",
      "<delivery>true</delivery>",
      deliveryOptionsXml,
      paramsXml,
      countXml,
      "</offer>",
    ].join("");
  }

  private buildParamXml(
    spec: ProductWithRelations["specs"][number],
  ): string | null {
    const label = spec.attribute?.label?.trim();
    if (!label) return null;

    const value = this.formatSpecValue(spec);
    if (value == null || value === "") return null;

    const unit = spec.unitOverride?.trim() || spec.attribute?.unit?.trim();
    const unitAttr = unit ? ` unit="${this.escape(unit)}"` : "";

    return `<param name="${this.escape(label)}"${unitAttr}>${this.escape(
      value,
    )}</param>`;
  }

  private formatSpecValue(
    spec: ProductWithRelations["specs"][number],
  ): string | null {
    const attributeType = spec.attribute?.type;

    if (attributeType === SpecType.BOOLEAN) {
      if (typeof spec.valueBool === "boolean") {
        return spec.valueBool ? "Да" : "Нет";
      }
      if (spec.valueString) return spec.valueString;
    }

    if (attributeType === SpecType.NUMBER) {
      if (typeof spec.valueNumber === "number")
        return Number(spec.valueNumber).toString();
      if (spec.valueString) return spec.valueString;
    }

    if (spec.valueString) return spec.valueString;
    if (typeof spec.valueNumber === "number")
      return Number(spec.valueNumber).toString();
    if (typeof spec.valueBool === "boolean")
      return spec.valueBool ? "Да" : "Нет";

    return null;
  }

  private collectPictures(product: ProductWithRelations, origin: string) {
    const urls: string[] = [];

    const pushUrl = (url?: string | null) => {
      const absolute = this.toAbsoluteUrl(url, origin);
      if (absolute && !urls.includes(absolute)) {
        urls.push(absolute);
      }
    };

    pushUrl(product.mainImage?.url);
    product.media.forEach((item) => pushUrl(item.file?.url));

    return urls;
  }

  private stripHtml(value: string): string {
    return value.replace(/<\/?[^>]+(>|$)/g, " ").replace(/\s+/g, " ").trim();
  }

  private escape(value: string): string {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  }

  private toAbsoluteUrl(
    url: string | null | undefined,
    origin: string,
  ): string | null {
    if (!url) return null;
    if (/^https?:\/\//i.test(url)) return url;
    const normalizedOrigin = origin.endsWith("/")
      ? origin.slice(0, -1)
      : origin;
    const normalizedPath = url.startsWith("/") ? url : `/${url}`;
    return `${normalizedOrigin}${normalizedPath}`;
  }

  private getEnv(key: string, fallback: string): string {
    return this.configService.get<string>(key) || fallback;
  }

  private normalizeOrigin(origin: string): string {
    return origin.replace(/\/+$/, "");
  }

  private parseDeliveryOptions(raw: string): DeliveryOption[] {
    if (!raw) return [];
    return raw
      .split(";")
      .map((chunk) => chunk.trim())
      .filter(Boolean)
      .map((chunk) => {
        const [cost, days] = chunk.split(":").map((item) => item?.trim() ?? "");
        return {
          cost: cost || "0",
          days: days || "1-3",
        };
      });
  }

  private buildDateAttribute(date: Date): string {
    const pad = (num: number) => num.toString().padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate(),
    )} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }
}
