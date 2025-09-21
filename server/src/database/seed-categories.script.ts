import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Типы для структуры категорий
interface CategoryData {
  id: number;
  name: string;
  slug: string;
  image?: string;
  children?: CategoryData[];
}

// Структура тестовых категорий с иерархией
const categoryHierarchy: CategoryData[] = [
  {
    id: 1,
    name: 'Новинки',
    slug: 'novinki',
    image: '/images/categories/new.jpg',
    children: [],
  },
  {
    id: 2,
    name: 'Пылесосы',
    slug: 'pylesosy',
    image:
      'https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero/447038-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920',
    children: [
      { id: 21, name: 'Беспроводные пылесосы', slug: 'besprovodnye-pylesosy' },
      {
        id: 22,
        name: 'Цилиндрические пылесосы',
        slug: 'tsilindricheskie-pylesosy',
      },
      {
        id: 23,
        name: 'Док-станции, насадки и аксессуары',
        slug: 'dok-stantsii-nasadki-aksessuary',
      },
    ],
  },
  {
    id: 3,
    name: 'Уход за волосами',
    slug: 'ukhod-za-volosami',
    image:
      'https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/primary/601857-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920',
    children: [
      { id: 31, name: 'Фены для волос', slug: 'feny-dlya-volos' },
      { id: 32, name: 'Стайлеры', slug: 'staylery' },
      { id: 33, name: 'Выпрямители', slug: 'vypryamiteli' },
      {
        id: 34,
        name: 'Чехлы, расчески и насадки',
        slug: 'chekhly-rascheski-nasadki',
      },
      { id: 35, name: 'Персонализация', slug: 'personalizatsiya-hair' },
    ],
  },
  {
    id: 4,
    name: 'Климатическая техника',
    slug: 'klimaticheskaya-tekhnika',
    image:
      'https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/gallery/home/air-treatment/fan-heaters/cf1/Web_739_Gallery_Images_1.jpg?cropPathE=desktop&fit=stretch,1&wid=2304',
    children: [
      {
        id: 41,
        name: 'Увлажнители-очистители',
        slug: 'uvlazhniteli-ochistiteli',
      },
      { id: 42, name: 'Увлажнители', slug: 'uvlazhniteli' },
      { id: 43, name: 'Очистители', slug: 'ochistiteli' },
      { id: 44, name: 'Фильтры', slug: 'filtry' },
    ],
  },
  {
    id: 5,
    name: 'Сушилки для рук',
    slug: 'sushilki-dlya-ruk',
    image: '/images/categories/hands.jpg',
    children: [
      { id: 51, name: 'Сушилки для рук 9kJ', slug: 'sushilki-9kj' },
      { id: 52, name: 'Сушилки для рук V', slug: 'sushilki-v' },
      {
        id: 53,
        name: 'Сушилки для рук интегрированные в смеситель Wash+Dry',
        slug: 'sushilki-wash-dry',
      },
    ],
  },
];

async function createCategoryWithChildren(
  categoryData: CategoryData,
  parentId: number | null = null,
): Promise<void> {
  // Создаем родительскую категорию
  const category = await prisma.category.create({
    data: {
      name: categoryData.name,
      slug: categoryData.slug,
      // image: categoryData.image,
      parentId: parentId,
    },
  });

  console.log(`✅ Создана категория: ${category.name} (ID: ${category.id})`);

  // Создаем дочерние категории, если они есть
  if (categoryData.children && categoryData.children.length > 0) {
    for (const child of categoryData.children) {
      await createCategoryWithChildren(child, category.id);
    }
  }
}

async function seedCategories() {
  console.log('🌱 Начинаем создание тестовых категорий...');

  try {
    // Очищаем существующие данные в правильном порядке (осторожно!)
    console.log('🧹 Очищаем связанные данные...');

    // Удаляем в порядке зависимостей: элементы заказов → заказы → элементы корзин → корзины → продукты → категории
    await prisma.orderItem.deleteMany({});
    console.log('   ✅ Элементы заказов удалены');

    await prisma.order.deleteMany({});
    console.log('   ✅ Заказы удалены');

    await prisma.cartItem.deleteMany({});
    console.log('   ✅ Элементы корзин удалены');

    await prisma.cart.deleteMany({});
    console.log('   ✅ Корзины удалены');

    await prisma.product.deleteMany({});
    console.log('   ✅ Продукты удалены');

    await prisma.category.deleteMany({});
    console.log('   ✅ Категории удалены');

    // Создаем иерархию категорий
    for (const rootCategory of categoryHierarchy) {
      await createCategoryWithChildren(rootCategory, null);
    }

    console.log('✅ Все категории успешно созданы!');

    // Выводим статистику
    const totalCategories = await prisma.category.count();
    const rootCategories = await prisma.category.count({
      where: { parentId: null },
    });
    const childCategories = totalCategories - rootCategories;

    console.log(`📊 Статистика:`);
    console.log(`   Всего категорий: ${totalCategories}`);
    console.log(`   Корневых категорий: ${rootCategories}`);
    console.log(`   Дочерних категорий: ${childCategories}`);

    // Показываем структуру дерева
    console.log('\n🌳 Структура категорий:');
    const categories = await prisma.category.findMany({
      include: {
        children: {
          include: {
            children: true,
          },
        },
      },
    });

    const printTree = (
      cats: Array<{
        id: number;
        name: string;
        slug: string;
        parentId: number | null;
      }>,
      parentId: number | null = null,
      level = 0,
    ) => {
      const filtered = cats.filter((c) => c.parentId === parentId);
      for (const cat of filtered) {
        const indent = '  '.repeat(level);
        console.log(`${indent}├─ ${cat.name} (${cat.slug})`);
        printTree(cats, cat.id, level + 1);
      }
    };

    printTree(categories);
  } catch (error) {
    console.error('❌ Ошибка при создании категорий:', error);
  }
}

// Основная функция
async function main() {
  await seedCategories();
  await prisma.$disconnect();
}

// Запуск скрипта
if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

export { seedCategories, categoryHierarchy };
export default main;
