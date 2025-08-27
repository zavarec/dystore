// src/main.ts
import { NestFactory } from "@nestjs/core";
import { ValidationPipe, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import helmet from "helmet";
// import compression from "compression";

async function bootstrap() {
  const logger = new Logger("Bootstrap");

  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // CORS
  app.enableCors({
    origin: ["http://localhost:3001", "http://127.0.0.1:3001"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  });

  // Security & performance
  app.use(helmet());
  // app.use(compression());

  // Global prefix
  app.setGlobalPrefix("api");

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle("DyStore API")
    .setDescription("DyStore E-commerce API Documentation")
    .setVersion("1.0.0")
    .addBearerAuth()
    .addTag("Authentication", "User authentication and authorization")
    .addTag("Categories", "Product categories management")
    .addTag("Products", "Products management")
    .addTag("Cart", "Shopping cart operations")
    .addTag("Orders", "Order management")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api-docs", app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: "alpha",
      operationsSorter: "alpha",
    },
  });

  logger.log(`Swagger documentation available at /api-docs`);

  // Graceful shutdown
  app.enableShutdownHooks();

  const port = configService.get<number>("PORT", 3000);
  await app.listen(port);

  logger.log(`Application is running on: http://localhost:${port}/api`);
  logger.log(
    `Environment: ${configService.get<string>("NODE_ENV", "development")}`,
  );
}

bootstrap();
