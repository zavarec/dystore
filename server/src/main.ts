import { NestFactory } from "@nestjs/core";
import { ValidationPipe, Logger, VersioningType } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import helmet from "helmet";
import * as compression from "compression";
import { WinstonModule } from "nest-winston";
import { createLogger } from "./config/logger.config";

async function bootstrap() {
  const logger = new Logger("Bootstrap");

  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      instance: createLogger(),
    }),
  });

  const configService = app.get(ConfigService);

  // Security
  app.use(
    helmet({
      contentSecurityPolicy: false,
    }),
  );
  app.use(compression());

  // CORS
  app.enableCors({
    origin: configService.get<string[]>("cors.origins"),
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  });

  // Global prefix and versioning
  const apiPrefix = configService.get<string>("app.apiPrefix");
  app.setGlobalPrefix(apiPrefix);
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: "1",
  });

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
  if (configService.get<boolean>("swagger.enabled")) {
    const config = new DocumentBuilder()
      .setTitle(configService.get<string>("swagger.title"))
      .setDescription(configService.get<string>("swagger.description"))
      .setVersion(configService.get<string>("swagger.version"))
      .addBearerAuth()
      .addTag("Authentication", "User authentication and authorization")
      .addTag("Users", "User management")
      .addTag("Categories", "Product categories management")
      .addTag("Products", "Products management")
      .addTag("Cart", "Shopping cart operations")
      .addTag("Orders", "Order management")
      .build();

    const document = SwaggerModule.createDocument(app, config);
    const swaggerPath = configService.get<string>("swagger.path");
    SwaggerModule.setup(swaggerPath, app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        tagsSorter: "alpha",
        operationsSorter: "alpha",
      },
    });

    logger.log(`Swagger documentation available at /${swaggerPath}`);
  }

  // Graceful shutdown
  app.enableShutdownHooks();

  const port = configService.get<number>("app.port");
  await app.listen(port);

  logger.log(
    `Application is running on: http://localhost:${port}/${apiPrefix}`,
  );
  logger.log(`Environment: ${configService.get<string>("app.nodeEnv")}`);
}

bootstrap();
