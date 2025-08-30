import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { SmsService } from "./sms.service";

@Controller("sms")
export class SmsTestController {
  constructor(private readonly sms: SmsService) {}

  @Post("test")
  @HttpCode(200)
  async test(@Body() dto: { phone: string }) {
    await this.sms.sendCode(dto.phone, "123456");
    return { ok: true };
  }
}
