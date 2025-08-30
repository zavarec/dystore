import {
  Category,
  PrismaClient,
  Product,
  Role,
  PageKey,
  SectionKey,
} from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Начинаю заполнение базы данных...");

  // Очищаем данные
  console.log("🧹 Очищаю существующие данные...");
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.cartItem.deleteMany({});
  await prisma.cart.deleteMany({});
  // Важно: удалить секции страниц ДО пользователей (FK createdById)
  await prisma.pageSection.deleteMany({});
  await prisma.promotion.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.user.deleteMany({});
  console.log("✅ Данные очищены");

  // Создаем категории
  console.log("📂 Создаю основные категории...");
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: "Пылесосы",
        slug: "vacuum-cleaners",
        image:
          "https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/home-page/homepage-category-tiles-floorcare.jpg",
      },
    }),
    prisma.category.create({
      data: {
        name: "Уход за волосами",
        slug: "hair-care",
        image:
          "https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/home-page/homepage-category-tiles-hair-care-2.jpg",
      },
    }),
    prisma.category.create({
      data: {
        name: "Климатическая техника",
        slug: "climate-tech",
        image:
          "https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/home-page/homepage-category-tiles-air-treatment.jpg",
      },
    }),
    prisma.category.create({
      data: {
        name: "Наушники",
        slug: "headphones",
        image:
          "https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/home-page/homepage-category-tiles-headphones-new.jpg",
      },
    }),
    prisma.category.create({
      data: {
        name: "Освещение",
        slug: "lighting",
        image:
          "https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/home-page/homepage-category-tiles-lighting.jpg",
      },
    }),
  ]);

  const [vacuums, hairCare, climate, headphones, lighting] = categories;
  console.log(`✅ Создано ${categories.length} основных категорий`);

  // Подкатегории
  console.log("📁 Создаю подкатегории...");
  const subcategoriesMap: Record<
    number,
    { name: string; image: string | null }[]
  > = {
    [vacuums.id]: [
      {
        name: "Беспроводные пылесосы",
        image:
          "https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/adobetarget/plp-2024/fc-cat-tiles/new-cat-card-1-cordless.jpg",
      },
      {
        name: "Роботы-пылесосы",
        image:
          "https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/adobetarget/plp-2024/fc-cat-tiles/new-cat-card-2-robot.jpg",
      },
      {
        name: "Вертикальные пылесосы",
        image:
          "https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/adobetarget/plp-2024/fc-cat-tiles/new-cat-card-4-upright.jpg",
      },
      {
        name: "Моющие пылесосы",
        image:
          "https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/adobetarget/plp-2024/fc-cat-tiles/new-cat-card-3-wet.jpg",
      },
      {
        name: "Аксессуары",
        image:
          "https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/adobetarget/plp-2024/fc-cat-tiles/new-cat-card-5-accessories.jpg",
      },
      {
        name: "Запчасти",
        image:
          "https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/adobetarget/plp-2024/fc-cat-tiles/Range-cards-Parts.jpg",
      },
    ],
    [hairCare.id]: [
      {
        name: "Фены Dyson Supersonic",
        image:
          "https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/products/hair-care/2025/category/505d/features/WEB_505_Category_Bento_Box_Hair_Dryer.jpg",
      },
      {
        name: "Мультистайлеры Dyson Airwrap",
        image:
          "https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/products/hair-care/2025/590/category/Web-590-Category-page-Tiles-Shop-all-hair-stylers.jpg",
      },
      {
        name: "Выпрямители Dyson Corrale",
        image:
          "https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/products/hair-care/708/category/Corrale-category-page-Shop-the-range-card.jpg",
      },
      {
        name: "Аксессуары для волос",
        image:
          "https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/products/hair-care/308fh-708/image-carousel/708-723-308FH-category-page-Shop-the-range-card-6.jpg",
      },
    ],
    [climate.id]: [
      {
        name: "Очистители воздуха",
        image:
          "https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/products/direct-new-journey/category/environmental-care/ec-cat-page-card-1-purifiers.jpg",
      },
      {
        name: "Очистители-увлажнители",
        image:
          "https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/products/air-treatment/dec-2024/category-page/us-bp04-cat-card.png",
      },
      {
        name: "Вентиляторы и обогреватели",
        image:
          "https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/products/air-treatment/dec-2024/category-page/categoryCard_FansAndHeaters.jpg",
      },
    ],
    [headphones.id]: [
      {
        name: "Наушники с ANC",
        image:
          "https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/home-page/571H_Nav_Image_Aluminium.jpg",
      },
      {
        name: "Премиум-наушники",
        image:
          "https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/home-page/571H_Nav_Image_Copper.jpg",
      },
    ],
    [lighting.id]: [
      {
        name: "Настольные лампы",
        image:
          "https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/products/lighting/category/creative-lighting/CD06_BLKBS-008_qq-RGB_3QRight-Perspective_LightOn-A4_REFW.jpg",
      },
      {
        name: "Напольные лампы",
        image:
          "https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/products/lighting/category/creative-lighting/CF06-BLKBS_008-qq_RGB-3QRight_Orthographic-LightOn_A4-REFW.jpg",
      },
    ],
  };

  const createdSubcategories: Category[] = [];

  for (const [parentIdStr, subcategories] of Object.entries(subcategoriesMap)) {
    const parentId = Number(parentIdStr);
    for (const { name: subName, image } of subcategories) {
      // Транслитерация для slug
      const cyrillicMap: Record<string, string> = {
        а: "a",
        б: "b",
        в: "v",
        г: "g",
        д: "d",
        е: "e",
        ё: "yo",
        ж: "zh",
        з: "z",
        и: "i",
        й: "y",
        к: "k",
        л: "l",
        м: "m",
        н: "n",
        о: "o",
        п: "p",
        р: "r",
        с: "s",
        т: "t",
        у: "u",
        ф: "f",
        х: "h",
        ц: "ts",
        ч: "ch",
        ш: "sh",
        щ: "sch",
        ъ: "",
        ы: "y",
        ь: "",
        э: "e",
        ю: "yu",
        я: "ya",
      };

      const slug = subName
        .toLowerCase()
        .split("")
        .map((char) => cyrillicMap[char] || char)
        .join("")
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

      const sub = await prisma.category.create({
        data: {
          name: subName,
          slug: slug,
          parentId,
          image: image || null,
        },
      });
      createdSubcategories.push(sub);
    }
  }

  console.log(`✅ Создано ${createdSubcategories.length} подкатегорий`);

  // Генерация товаров
  console.log("🛍️ Создаю товары...");
  const allProducts: Product[] = [];

  const imageMap: Record<number, string> = {
    [vacuums.id]:
      "http://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero/448799-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920",
    [hairCare.id]:
      "https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/primary/598976-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920",
    [climate.id]:
      "https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero-locale/en_GB/545814-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920",
    [headphones.id]:
      "https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero-locale/en_GB/759558-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920",
    [lighting.id]:
      "https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero/529476-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920",
  };

  for (const sub of createdSubcategories) {
    const baseName = sub.name;
    const parent = categories.find((p) => p.id === sub.parentId);
    const imageUrl = parent ? imageMap[parent.id] : "";

    const unique = await Promise.all(
      Array.from({ length: 5 }).map((_, i) =>
        prisma.product.create({
          data: {
            name: `${baseName} Model ${i + 1}`,
            shortDescription: `${baseName} кратко: модель ${i + 1}`,
            description: `Описание ${baseName} — уникальная модель ${i + 1} с особыми функциями.`,
            price: 29990 + i * 2000,
            stock: 10 + i,
            imageUrl,
            categoryId: sub.id,
            isFeatured: i % 2 === 0,
            popularity: 100 + i * 150,
          },
        }),
      ),
    );

    const copies = await Promise.all(
      unique.map((p) =>
        prisma.product.create({
          data: {
            name: `${p.name} Copy`,
            shortDescription: p.shortDescription,
            description: p.description,
            price: p.price,
            stock: p.stock,
            imageUrl: p.imageUrl || "",
            categoryId: p.categoryId,
            isFeatured: p.isFeatured,
            popularity: p.popularity,
          },
        }),
      ),
    );

    allProducts.push(...unique, ...copies);
  }

  const adminEmail = "director@dystore.local";

  const hashedPassword = await bcrypt.hash("SuperSecret123!", 10);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      // Не меняем пароль при повторном запуске, только гарантируем роль и имя
      role: Role.DIRECTOR,
      name: "Super Director",
      phone: "79990000000",
    },
    create: {
      email: adminEmail,
      phone: "79990000000",
      password: hashedPassword,
      name: "Super Director",
      role: Role.DIRECTOR,
    },
  });
  console.log(
    `✅ Директор гарантированно существует: ${adminEmail} (пароль: SuperSecret123!)`,
  );

  // Создаём MANAGER
  const managerEmail = "manager@dystore.local";
  const managerPassword = await bcrypt.hash("ManagerSecret123!", 10);
  const manager = await prisma.user.upsert({
    where: { email: managerEmail },
    update: {
      role: Role.MANAGER,
      name: "Content Manager",
      phone: "79990000001",
    },
    create: {
      email: managerEmail,
      phone: "79990000001",
      password: managerPassword,
      name: "Content Manager",
      role: Role.MANAGER,
    },
  });

  // Промо-сиды
  const now = new Date();
  const dayMs = 24 * 60 * 60 * 1000;
  const start = new Date(now.getTime() - 1 * dayMs);
  const end = new Date(now.getTime() + 7 * dayMs);

  const sampleProduct = await prisma.product.findFirst();

  // PRODUCT_OF_DAY (опубликованный)
  await prisma.promotion.create({
    data: {
      slot: "PRODUCT_OF_DAY",
      title: "Товар дня",
      ctaText: "Купить со скидкой",
      product: sampleProduct
        ? { connect: { id: sampleProduct.id } }
        : undefined,
      bgImageUrl:
        "https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/products/beauty/hair-stylers/airwrap-origin/rcc/Web-EntrySkus-308C-overview-banner-2.jpg?$responsive$&cropPathE=desktop&fit=stretch,1&fmt=pjpeg&wid=1920",
      isPublished: true,
      startAt: start,
      endAt: end,
      position: 0,
      createdBy: { connect: { id: manager.id } },
    },
  });

  // FEATURED (2 шт)
  await prisma.promotion.createMany({
    data: [
      {
        slot: "FEATURED",
        title: "Хиты недели",
        ctaText: "Смотреть",
        ctaLink: "/catalog/hits",
        bgImageUrl:
          "https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/countries/ca/products/air-treatment/EC_Home-Editorial_Banner-3.jpg?$responsive$&cropPathE=desktop&fit=stretch,1&fmt=pjpeg&wid=1920",
        isPublished: true,
        startAt: start,
        endAt: end,
        position: 0,
        createdById: manager.id,
      },
      {
        slot: "FEATURED",
        title: "Рекомендации",
        ctaText: "Перейти",
        ctaLink: "/catalog/recommended",
        bgImageUrl:
          "https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/campaigns/summer-sales/Labor-Day_2025_FC_V12.jpg?$responsive$&cropPathE=desktop&fit=stretch,1&fmt=pjpeg&wid=3840",
        isPublished: true,
        startAt: start,
        endAt: end,
        position: 1,
        createdById: manager.id,
      },
    ],
  });

  // CUSTOM (1 шт)
  await prisma.promotion.create({
    data: {
      slot: "CUSTOM",
      title: "Эксклюзив",
      ctaText: "Подробнее",
      ctaLink: "/landing/exclusive",
      bgImageUrl:
        "https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/campaigns/summer-sales/Labor-Day_2025_FC_V12.jpg?$responsive$&cropPathE=desktop&fit=stretch,1&fmt=pjpeg&wid=3840",
      isPublished: true,
      startAt: start,
      endAt: end,
      position: 0,
      createdById: manager.id,
    },
  });

  const allPromotions = await prisma.promotion.findMany();

  // Секции главной (дефолтный порядок)
  console.log("🧩 Создаю секции главной страницы...");
  const existingSections = await prisma.pageSection.findMany({
    where: { page: PageKey.HOME },
  });
  if (existingSections.length === 0) {
    await prisma.pageSection.createMany({
      data: [
        {
          page: PageKey.HOME,
          key: SectionKey.PRODUCT_OF_DAY,
          title: "Товар дня",
          position: 0,
          createdById: manager.id,
        },
        {
          page: PageKey.HOME,
          key: SectionKey.FEATURED,
          title: "Избранное",
          position: 1,
          createdById: manager.id,
        },
        {
          page: PageKey.HOME,
          key: SectionKey.HITS,
          title: "Хиты",
          position: 2,
          createdById: manager.id,
        },
        {
          page: PageKey.HOME,
          key: SectionKey.CUSTOM,
          title: "Спецпредложения",
          position: 3,
          createdById: manager.id,
        },
      ],
    });
    console.log("✅ Секции главной созданы по умолчанию");
  } else {
    console.log("ℹ️ Секции главной уже существуют, пропускаю создание");
  }

  console.log("🎉 База данных успешно заполнена!");
  console.log(`📊 Статистика:`);
  console.log(`   📂 Основных категорий: ${categories.length}`);
  console.log(`   📁 Подкатегорий: ${createdSubcategories.length}`);
  console.log(`   🛍️ Товаров: ${allProducts.length}`);
  console.log(`   🛍️ Промо: ${allPromotions.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  .finally(async () => {
    await prisma.$disconnect();
  });
