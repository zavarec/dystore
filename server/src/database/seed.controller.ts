// src/database/seed.controller.ts
import { Controller, Post, Get, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SeedService } from './seed.service';
import { PrismaService } from './prisma.service';

@ApiTags('Database')
@Controller('seed')
export class SeedController {
  private readonly logger = new Logger(SeedController.name);

  constructor(
    private readonly seedService: SeedService,
    private readonly prisma: PrismaService
  ) {}

  @ApiOperation({ summary: 'Test database connection' })
  @ApiResponse({ status: 200, description: 'Database connection is working' })
  @ApiResponse({ status: 500, description: 'Database connection failed' })
  @Get('test')
  async testConnection() {
    try {
      this.logger.log('Testing database connection...');
      const result = await this.prisma.$queryRaw`SELECT 1 as test`;
      this.logger.log('Database connection is working');
      return { message: 'Database connection is working', data: result };
    } catch (error) {
      this.logger.error('Database connection failed', error.message);
      throw new HttpException(
        { message: 'Database connection failed', error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @ApiOperation({ summary: 'Test category creation' })
  @ApiResponse({ status: 200, description: 'Category created successfully' })
  @ApiResponse({ status: 500, description: 'Category creation failed' })
  @Get('categories-test')
  async testCategories() {
    try {
      this.logger.log('Testing category creation...');
      const category = await this.prisma.category.create({
        data: {
          name: 'Test Category',
          slug: 'test-' + Date.now(),
          image: 'https://example.com/test.jpg',
        },
      });
      this.logger.log('Category created successfully');
      return { message: 'Category created successfully', category };
    } catch (error) {
      this.logger.error('Category creation failed', error.message);
      throw new HttpException(
        { message: 'Category creation failed', error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @ApiOperation({ summary: 'Seed database with test data' })
  @ApiResponse({ status: 200, description: 'Database seeded successfully' })
  @ApiResponse({ status: 500, description: 'Database seeding failed' })
  @Post('database')
  async seedDatabase() {
    try {
      this.logger.log('Starting database seeding...');
      const result = await this.seedService.seedDatabase();
      this.logger.log('Database seeding completed successfully');
      return result;
    } catch (error) {
      this.logger.error('Database seeding failed', error.message);
      
      throw new HttpException(
        {
          message: 'Database seeding failed',
          error: error.message,
          details: error.stack
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}