import { Controller, Post, Get, HttpException, HttpStatus } from '@nestjs/common';
import { SeedService } from './seed.service';
import { PrismaService } from './prisma.service';

@Controller('seed')
export class SeedController {
  constructor(
    private readonly seedService: SeedService,
    private readonly prisma: PrismaService
  ) {}

  @Get('test')
  async testConnection() {
    try {
      console.log('🔧 Тестирую подключение к базе данных...');
      const result = await this.prisma.$queryRaw`SELECT 1 as test`;
      console.log('🔧 Подключение к БД работает:', result);
      return { message: 'Подключение к БД работает', data: result };
    } catch (error) {
      console.error('🔧 Ошибка подключения к БД:', error);
      throw new HttpException(
        { message: 'Ошибка подключения к БД', error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('categories-test')
  async testCategories() {
    try {
      console.log('🔧 Тестирую создание категории...');
      const category = await this.prisma.category.create({
        data: {
          name: 'Тест',
          slug: 'test-' + Date.now(),
          image: 'https://example.com/test.jpg',
        },
      });
      console.log('🔧 Категория создана:', category);
      return { message: 'Категория создана', category };
    } catch (error) {
      console.error('🔧 Ошибка создания категории:', error);
      throw new HttpException(
        { message: 'Ошибка создания категории', error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('database')
  async seedDatabase() {
    try {
      console.log('🔧 Контроллер: начинаю seed...');
      const result = await this.seedService.seedDatabase();
      console.log('🔧 Контроллер: seed завершен успешно');
      return result;
    } catch (error) {
      console.error('🔧 Контроллер: ошибка в seed controller:', error);
      console.error('🔧 Контроллер: error message:', error.message);
      console.error('🔧 Контроллер: error stack:', error.stack);
      
      throw new HttpException(
        {
          message: 'Ошибка при заполнении базы данных',
          error: error.message,
          details: error.stack
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
