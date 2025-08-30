import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { SmsService } from "./sms.service";
import { SmsProvider } from "./sms.provider";
import { SmsTestController } from "./sms.contrroller";

@Module({
  imports: [ConfigModule],
  providers: [SmsProvider, SmsService],
  controllers: [SmsTestController],
  exports: [SmsService],
})
export class SmsModule {}
