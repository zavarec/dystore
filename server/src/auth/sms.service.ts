import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);

  async sendVerificationCode(phone: string, code: string): Promise<void> {
    if (process.env.NODE_ENV === "production") {
      // Здесь реальная отправка SMS
      // await this.smsProvider.send(phone, `Ваш код: ${code}`);
      this.logger.log(`SMS sent to ${this.maskPhone(phone)}`);
    } else {
      // В разработке логируем код
      await Promise.resolve();
      this.logger.warn(
        `DEV MODE - SMS code for ${this.maskPhone(phone)}: ${code}`,
      );
    }
  }

  private maskPhone(phone: string): string {
    // Маскируем номер для безопасности: +7912***45-67
    return phone.replace(/(\+7\d{3})\d{3}(\d{2}-?\d{2})/, "$1***$2");
  }
}
