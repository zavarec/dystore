import { Provider } from "@nestjs/common";
import Redis from "ioredis";

export const REDIS_CLIENT = "REDIS_CLIENT";

export const redisProvider: Provider = {
  provide: REDIS_CLIENT,
  useFactory: async () => {
    const url = process.env.REDIS_URL;
    if (!url) throw new Error("REDIS_URL is not set");

    const client = new Redis(url, {
      tls: {},
      maxRetriesPerRequest: 3,
      retryStrategy: (times) => Math.min(times * 200, 2000),
    });

    client.on("connect", () => console.log("[Redis] connected"));
    client.on("error", (e) => console.error("[Redis] error:", e));

    return client;
  },
};
