import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);

  async sendVerificationCode(phone: string, code: string): Promise<void> {
    // В реальном проекте здесь будет интеграция с SMS-провайдером
    // Например: Twilio, AWS SNS, или российские провайдеры
    this.logger.log(`📱 Отправка SMS на номер ${phone} с кодом: ${code}`);

    // Имитация отправки SMS
    await new Promise((resolve) => setTimeout(resolve, 100));

    this.logger.log(`✅ SMS успешно отправлено на ${phone}`);
  }
}
