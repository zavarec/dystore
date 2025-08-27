import { Module, Global } from "@nestjs/common";
import { OtpService } from "./otp.service";
import { redisProvider } from "./redis.provider";

@Global()
@Module({
  providers: [redisProvider, OtpService],
  exports: [OtpService],
})
export class OtpModule {}
