import { Category, PrismaClient, Product, Role } from "@prisma/client";
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
  const subcategoriesMap: Record<number, string[]> = {
    [vacuums.id]: [
      "Беспроводные пылесосы",
      "Роботы-пылесосы",
      "Проводные пылесосы",
      "Моющие пылесосы",
    ],
    [hairCare.id]: [
      "Фены Dyson Supersonic",
      "Мультистайлеры Dyson Airwrap",
      "Выпрямители Dyson Corrale",
      "Аксессуары для волос",
    ],
    [climate.id]: ["Очистители воздуха", "Увлажнители воздуха", "Вентиляторы"],
    [headphones.id]: ["Наушники с ANC", "Премиум-наушники"],
    [lighting.id]: ["Настольные лампы", "Напольные лампы"],
  };

  const createdSubcategories: Category[] = [];

  for (const [parentIdStr, subNames] of Object.entries(subcategoriesMap)) {
    const parentId = Number(parentIdStr);
    for (const subName of subNames) {
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
          image: null,
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

  const adminEmail = "admin@dystore.local";

  // Проверим, есть ли уже админ
  const admin = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!admin) {
    const hashedPassword = await bcrypt.hash("SuperSecret123!", 10);

    await prisma.user.create({
      data: {
        email: adminEmail,
        phone: "79990000000",
        password: hashedPassword,
        name: "Super Admin",
        role: Role.ADMIN,
      },
    });

    console.log(`✅ Админ создан: ${adminEmail} / SuperSecret123!`);
  } else {
    console.log("ℹ️ Админ уже существует");
  }

  console.log("🎉 База данных успешно заполнена!");
  console.log(`📊 Статистика:`);
  console.log(`   📂 Основных категорий: ${categories.length}`);
  console.log(`   📁 Подкатегорий: ${createdSubcategories.length}`);
  console.log(`   🛍️ Товаров: ${allProducts.length}`);
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
