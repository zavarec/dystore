import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class SeedService {
  constructor(private readonly prisma: PrismaService) {}

  async seedDatabase() {
    try {
      console.log('🌱 Начинаю простое заполнение базы данных...');

      // Очищаем существующие данные
      console.log('🧹 Очищаю существующие данные...');
      await this.prisma.orderItem.deleteMany({});
      await this.prisma.order.deleteMany({});
      await this.prisma.cartItem.deleteMany({});
      await this.prisma.cart.deleteMany({});
      await this.prisma.product.deleteMany({});
      await this.prisma.category.deleteMany({});
      await this.prisma.user.deleteMany({});
      console.log('✅ Данные очищены');

      // Создаем простую категорию
      console.log('📂 Создаю тестовую категорию...');
      const category = await this.prisma.category.create({
        data: {
          name: 'Тестовая категория',
          slug: 'test-category',
          image: 'https://example.com/test.jpg',
        },
      });
      console.log('✅ Категория создана:', category);

      // Создаем простой продукт
      console.log('🛍️ Создаю тестовый товар...');
      const product = await this.prisma.product.create({
        data: {
          name: 'Тестовый товар',
          shortDescription: 'Краткое описание',
          description: 'Полное описание тестового товара',
          price: 1000,
          stock: 10,
          imageUrl: 'https://example.com/product.jpg',
          categoryId: category.id,
          isFeatured: true,
          popularity: 100,
        },
      });
      console.log('✅ Товар создан:', product);

      return {
        message: 'База данных успешно заполнена (тестовая версия)',
        categories: 1,
        products: 1,
      };
    } catch (error) {
      console.error('Ошибка при заполнении базы данных:', error);
      console.error('Stack trace:', error.stack);
      throw error;
    }
  }
}
