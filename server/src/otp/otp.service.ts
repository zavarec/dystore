import { Inject, Injectable } from "@nestjs/common";
import type Redis from "ioredis";
import { REDIS_CLIENT } from "./redis.provider";

@Injectable()
export class OtpService {
  private readonly ttlSeconds = 60 * 5; // 5 минут

  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  async setCode(phone: string, code: string): Promise<void> {
    const key = this.buildKey(phone);
    await this.redis.setex(key, this.ttlSeconds, code);
  }

  async getAndDel(phone: string): Promise<string | null> {
    const key = this.buildKey(phone);
    const pipeline = this.redis.multi();
    pipeline.get(key);
    pipeline.del(key);
    const [getRes, _delRes] = (await pipeline.exec()) as any[];
    return getRes?.[1] ?? null;
  }

  async setRateLimitLock(phone: string, seconds = 30): Promise<boolean> {
    const key = `otp:lock:${phone}`;
    const res = await this.redis.set(key, "1", "EX", seconds, "NX");
    return res === "OK";
  }

  private buildKey(phone: string): string {
    return `otp:${phone}`;
  }
}
