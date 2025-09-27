import { NestFactory } from "@nestjs/core";
import { ValidationPipe, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import helmet from "helmet";
import * as express from "express";

// import compression from "compression";
import * as csrf from "csurf";

const cookieParser = require("cookie-parser");

async function bootstrap() {
  const logger = new Logger("Bootstrap");

  const isProd = process.env.NODE_ENV === "production";

  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  (app.getHttpAdapter().getInstance() as any).set("trust proxy", 1);

  // ВАЖНО: Увеличиваем лимиты для загрузки файлов
  // app.use(require("express").json({ limit: "50mb" }));
  // app.use(
  //   require("express").urlencoded({
  //     limit: "50mb",
  //     extended: true,
  //     parameterLimit: 50000,
  //   }),
  // );

  const isMultipart = (req: any) =>
    typeof req.headers["content-type"] === "string" &&
    req.headers["content-type"].startsWith("multipart/form-data");

  app.use(
    express.json({ limit: "50mb", type: (req: any) => !isMultipart(req) }),
  );
  app.use(
    express.urlencoded({
      limit: "50mb",
      extended: true,
      parameterLimit: 50000,
      type: (req: any) => !isMultipart(req),
    }),
  );

  app.use(cookieParser()); // ← ОБЯЗАТЕЛЬНО до роутов

  app.use((req, res, next) => {
    res.header("Vary", "Origin");
    next();
  });

  const whitelist: (string | RegExp)[] = [
    process.env.FRONTEND_ORIGIN || "",
    "http://localhost:3000",
    "https://dyson-group.ru",
    "http://127.0.0.1:3000",
    /^https?:\/\/194\.87\.76\.238(?::\d+)?$/, // твой сервер по IP и любому порту
    /^http?:\/\/194\.87\.76\.238(?::\d+)?$/,
  ].filter(Boolean) as (string | RegExp)[];

  // CORS
  app.enableCors({
    origin: whitelist,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-XSRF-TOKEN"],
    credentials: true,
  });

  const csrfProtection = csrf({
    // cookie для СЕКРЕТА (csurf хранит здесь secret, НЕ сам token!)
    cookie: {
      key: "_csrf", // ❗ другое имя, не XSRF-TOKEN
      httpOnly: true, // секрет фронту не нужен
      sameSite: "lax",
      secure: isProd,
      path: "/",
    },
    // где брать ТОКЕН при проверке (мы будем слать в заголовке)
    value: (req: any) =>
      req.headers["x-xsrf-token"] ||
      req.headers["x-csrf-token"] ||
      req.headers["csrf-token"] ||
      (req.body && req.body._csrf),
  });

  app.use("/api/csrf", csrfProtection, (req: any, res: any) => {
    const token = req.csrfToken();
    res.cookie("XSRF-TOKEN", token, {
      httpOnly: false, // фронту надо прочитать
      sameSite: "lax",
      secure: isProd,
      path: "/",
      maxAge: 12 * 60 * 60 * 1000,
    });
    res.json({ csrfToken: token });
  });

  // Security & performance
  app.use(helmet());
  // app.use(compression());

  // Global prefix
  app.setGlobalPrefix("api");

  // Global pipes с увеличенными лимитами
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      // Важно для загрузки файлов
      skipMissingProperties: false,
      skipNullProperties: false,
      skipUndefinedProperties: false,
    }),
  );

  // Swagger setup
  const swaggerConfig = new DocumentBuilder()
    .setTitle("DysonGroup API")
    .setDescription("DysonGroup E-commerce API Documentation")
    .setVersion("1.0.0")
    .addBearerAuth()
    .addTag("Authentication", "User authentication and authorization")
    .addTag("Categories", "Product categories management")
    .addTag("Products", "Products management")
    .addTag("Cart", "Shopping cart operations")
    .addTag("Orders", "Order management")
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
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

  const port = configService.get<number>("PORT", 3001);
  await app.listen(port, "0.0.0.0");

  logger.log(`Application is running on: http://localhost:${port}/api`);
  logger.log(
    `Environment: ${configService.get<string>("NODE_ENV", "development")}`,
  );
}

bootstrap();
