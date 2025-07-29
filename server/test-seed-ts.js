import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function testCompilation() {
    try {
        // Тестируем синтаксис нашего кода
        const categories = await Promise.all([
            prisma.category.create({
                data: {
                    name: 'Пылесосы',
                    slug: 'vacuum-cleaners',
                    image: 'test.jpg',
                },
            }),
        ]);
        const [vacuums] = categories;
        const subcategoriesMap = {
            [vacuums.id]: ['Беспроводные пылесосы'],
        };
        const createdSubcategories = [];
        for (const [parentIdStr, subNames] of Object.entries(subcategoriesMap)) {
            const parentId = Number(parentIdStr);
            for (const subName of subNames) {
                const sub = await prisma.category.create({
                    data: {
                        name: subName,
                        slug: subName
                            .toLowerCase()
                            .replace(/\s+/g, '-')
                            .replace(/[^\w-]/g, ''),
                        parentId,
                        image: null,
                    },
                });
                createdSubcategories.push(sub);
            }
        }
        console.log('Тест компиляции прошел успешно');
    }
    catch (error) {
        console.error('Ошибка:', error);
    }
}
testCompilation();
