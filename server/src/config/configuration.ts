import { registerAs } from "@nestjs/config";

export const appConfig = registerAs("app", () => ({
  nodeEnv: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT, 10) || 3000,
  apiPrefix: process.env.API_PREFIX || "api/v1",
}));

export const databaseConfig = registerAs("database", () => ({
  url: process.env.DATABASE_URL,
}));

export const jwtConfig = registerAs("jwt", () => ({
  secret: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  refreshSecret: process.env.JWT_REFRESH_SECRET,
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
}));

export const redisConfig = registerAs("redis", () => ({
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT, 10) || 6379,
  password: process.env.REDIS_PASSWORD,
  ttl: parseInt(process.env.REDIS_TTL, 10) || 300,
}));

export const throttleConfig = registerAs("throttle", () => ({
  ttl: parseInt(process.env.THROTTLE_TTL, 10) || 60000,
  limit: parseInt(process.env.THROTTLE_LIMIT, 10) || 10,
}));

export const swaggerConfig = registerAs("swagger", () => ({
  enabled: process.env.SWAGGER_ENABLED === "true",
  title: process.env.SWAGGER_TITLE || "API Documentation",
  description: process.env.SWAGGER_DESCRIPTION || "API Description",
  version: process.env.SWAGGER_VERSION || "1.0.0",
  path: process.env.SWAGGER_PATH || "api-docs",
}));

export const corsConfig = registerAs("cors", () => ({
  origins: process.env.CORS_ORIGINS?.split(",") || ["http://localhost:3001"],
}));
