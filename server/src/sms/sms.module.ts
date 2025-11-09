import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { SmsService } from "./sms.service";

import { SmsTestController } from "./sms.contrroller";
import { smsGatewayProvider } from "./sms.provider";

@Module({
  imports: [ConfigModule],
  providers: [smsGatewayProvider, SmsService],
  controllers: [SmsTestController],
  exports: [SmsService],
})
export class SmsModule {}
