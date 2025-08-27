import { Test } from "@nestjs/testing";
import { PromotionsService } from "../promotions.service";
import { DatabaseModule } from "../../database/database.module";
import { PrismaService } from "../../database/prisma.service";
import { PromotionSlot, Role } from "@prisma/client";

describe("PromotionsService", () => {
  let service: PromotionsService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [PromotionsService],
    }).compile();

    service = moduleRef.get(PromotionsService);
    prisma = moduleRef.get(PrismaService);
  });

  beforeEach(async () => {
    await prisma.promotion.deleteMany({});
  });

  it("getActiveBySlot возвращает только одну запись для PRODUCT_OF_DAY", async () => {
    const user = await prisma.user.findFirst({
      where: { role: Role.DIRECTOR },
    });
    const product = await prisma.product.findFirst();
    const now = new Date();
    const start = new Date(now.getTime() - 1000);
    const end = new Date(now.getTime() + 3600_000);

    await service.create(
      {
        slot: PromotionSlot.PRODUCT_OF_DAY,
        productId: product?.id,
        startAt: start.toISOString(),
        endAt: end.toISOString(),
        bgImageUrl: "https://example.com/bg.jpg",
        isPublished: true,
      },
      user!.id,
    );

    const active = await service.getActiveBySlot(
      PromotionSlot.PRODUCT_OF_DAY,
      now,
    );
    expect(active && !Array.isArray(active)).toBeTruthy();
  });

  it("Публикация PRODUCT_OF_DAY делает пересекающиеся неактивными", async () => {
    const user = await prisma.user.findFirst({
      where: { role: Role.DIRECTOR },
    });
    const product = await prisma.product.findFirst();
    const now = new Date();
    const start = new Date(now.getTime() - 1000);
    const end = new Date(now.getTime() + 3600_000);

    const p1 = await service.create(
      {
        slot: PromotionSlot.PRODUCT_OF_DAY,
        productId: product?.id,
        startAt: start.toISOString(),
        endAt: end.toISOString(),
        bgImageUrl: "https://example.com/bg1.jpg",
        isPublished: true,
      },
      user!.id,
    );

    const p2 = await service.create(
      {
        slot: PromotionSlot.PRODUCT_OF_DAY,
        productId: product?.id,
        startAt: start.toISOString(),
        endAt: end.toISOString(),
        bgImageUrl: "https://example.com/bg2.jpg",
        isPublished: true,
      },
      user!.id,
    );

    const first = await prisma.promotion.findUnique({ where: { id: p1.id } });
    const second = await prisma.promotion.findUnique({ where: { id: p2.id } });

    expect(first?.isPublished).toBe(false);
    expect(second?.isPublished).toBe(true);
  });
});
