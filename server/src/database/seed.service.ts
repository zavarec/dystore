// src/database/seed.service.ts
import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(private readonly prisma: PrismaService) {}

  async seedDatabase() {
    try {
      this.logger.log("Starting simple database seeding...");

      // Clear existing data
      this.logger.log("Clearing existing data...");
      await this.prisma.orderItem.deleteMany({});
      await this.prisma.order.deleteMany({});
      await this.prisma.cartItem.deleteMany({});
      await this.prisma.cart.deleteMany({});
      await this.prisma.product.deleteMany({});
      await this.prisma.category.deleteMany({});
      await this.prisma.user.deleteMany({});
      this.logger.log("Data cleared successfully");

      // Create test category
      this.logger.log("Creating test category...");
      const category = await this.prisma.category.create({
        data: {
          name: "Test Category",
          slug: "test-category",
          image: "https://example.com/test.jpg",
        },
      });
      this.logger.log(
        `Category created: ${category.name} (ID: ${category.id})`,
      );

      // Create test product
      this.logger.log("Creating test product...");
      const product = await this.prisma.product.create({
        data: {
          name: "Test Product",
          shortDescription: "Short description",
          description: "Full description of test product",
          price: 1000,
          stock: 10,
          imageUrl: "https://example.com/product.jpg",
          categoryId: category.id,
          isFeatured: true,
          popularity: 100,
        },
      });
      this.logger.log(`Product created: ${product.name} (ID: ${product.id})`);

      return {
        message: "Database seeded successfully (test version)",
        categories: 1,
        products: 1,
      };
    } catch (error) {
      this.logger.error("Error seeding database", error.stack);
      throw error;
    }
  }
}
