import { Provider } from "@nestjs/common";
import Redis from "ioredis";

export const REDIS_CLIENT = "REDIS_CLIENT";

export const redisProvider: Provider = {
  provide: REDIS_CLIENT,
  useFactory: async () => {
    const url = process.env.REDIS_URL;
    if (!url) throw new Error("REDIS_URL is not set");

    const u = new URL(url);
    const useTLS = u.protocol === "rediss:";

    const client = new Redis({
      host: u.hostname,
      port: Number(u.port || 6379),
      username: u.username || undefined,
      password: u.password || undefined,
      tls: useTLS ? {} : undefined, // ← TLS только для rediss://
      enableReadyCheck: true,
      maxRetriesPerRequest: null, // не режь пайплайн на старте
      retryStrategy: (times) => Math.min(times * 200, 2000),
      connectTimeout: 10_000,
      keepAlive: 10_000,
    });

    client.on("connect", () => console.log("[Redis] connected"));
    client.on("ready", () => console.log("[Redis] ready"));
    client.on("end", () => console.warn("[Redis] connection ended"));
    client.on("error", (e) => console.error("[Redis] error:", e));

    return client;
  },
};
