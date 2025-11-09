import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SMS_GATEWAY } from "./sms.tokens";
import { SmsGateway } from "./sms.gateway";

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private readonly testMode: boolean;

  constructor(
    private readonly config: ConfigService,
    @Inject(SMS_GATEWAY) private readonly gateway: SmsGateway | null,
  ) {
    this.testMode = this.config.get<string>("SMS_TEST") === "1";
  }

  async sendCode(phone: string, code: string): Promise<void> {
    const normalized = this.normalizePhone(phone);
    const text = `Ваш код подтверждения: ${code}`;

    try {
      if (!this.gateway) {
        this.logger.warn(
          `DEV MODE — SMS code for ${this.maskPhone(phone)}: ${code}`,
        );
        return;
      }
      if (this.testMode) {
        this.logger.log(
          `TEST MODE — skip send. ${this.maskPhone(phone)}: ${code}`,
        );
        return;
      }

      await this.gateway.sendText(normalized, text);
      this.logger.log(`SMS sent to ${this.maskPhone(phone)}`);
    } catch (e: any) {
      this.logger.error(`SMS send error: ${e?.message || e}`);
      throw new HttpException("Ошибка отправки SMS", HttpStatus.BAD_GATEWAY);
    }
  }

  async sendTelegramCode(phone: string, code: string): Promise<void> {
    if (!this.gateway || !("sendTelegram" in this.gateway) || this.testMode) {
      this.logger.log(
        `Skip Telegram send (no gateway/TEST). ${this.maskPhone(phone)}: ${code}`,
      );
      return;
    }
    try {
      const normalized = this.normalizePhone(phone);
      // @ts-expect-error — метод есть у SmsAero
      await this.gateway.sendTelegram(normalized, Number(code));
    } catch (e: any) {
      this.logger.error(`Telegram send error: ${e?.message || e}`);
    }
  }

  private normalizePhone(phone: string): string {
    const digits = phone.replace(/\D/g, "");
    if (digits.length === 11)
      return digits.startsWith("8") ? `7${digits.slice(1)}` : digits;
    if (digits.length === 10) return `7${digits}`;
    return digits;
  }

  private maskPhone(phone: string): string {
    return phone.replace(
      /(\+?\d{1,3})(\d{3})(\d{2})(\d{2})(\d{2})/,
      "$1$2****$5",
    );
  }
}
