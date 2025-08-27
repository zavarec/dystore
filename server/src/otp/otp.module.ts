import { Module, OnModuleDestroy } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { OtpService } from "./otp.service";
import { REDIS_CLIENT, redisProvider } from "./redis.provider";

@Module({
  imports: [ConfigModule],
  providers: [redisProvider, OtpService],
  exports: [OtpService, REDIS_CLIENT],
})
export class OtpModule implements OnModuleDestroy {
  constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private readonly redis: any,
  ) {}

  async onModuleDestroy() {
    if (this.redis && typeof this.redis.quit === "function") {
      await this.redis.quit();
    }
  }
}
