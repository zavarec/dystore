import { ConfigService } from "@nestjs/config";
import Redis from "ioredis";

export const REDIS_CLIENT = "REDIS_CLIENT" as const;

export const redisProvider = {
  provide: REDIS_CLIENT,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    return new Redis({
      host: configService.get<string>("REDIS_HOST", "localhost"),
      port: configService.get<number>("REDIS_PORT", 6379),
      password: configService.get<string>("REDIS_PASSWORD"),
      maxRetriesPerRequest: 3,
    });
  },
};
