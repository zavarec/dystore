import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private readonly apiKey: string;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>("SMS_RU_API_KEY", "");
  }

  async sendCode(phone: string, code: string): Promise<void> {
    try {
      if (!this.apiKey) {
        this.logger.warn(
          "SMS_RU_API_KEY не задан. Переходим в dev-логирование кода.",
        );
        this.logger.warn(
          `DEV MODE - SMS code for ${this.maskPhone(phone)}: ${code}`,
        );
        return;
      }

      const url = new URL("https://sms.ru/sms/send");
      url.searchParams.set("api_id", this.apiKey);
      url.searchParams.set("to", phone);
      url.searchParams.set("msg", `Ваш код подтверждения: ${code}`);
      url.searchParams.set("json", "1");

      const response = await fetch(url.toString(), { method: "GET" });
      const data = (await response.json()) as any;

      if (!response.ok || data.status !== "OK") {
        const errorText = `SMS sending failed: ${JSON.stringify(data)}`;
        this.logger.error(errorText);
        throw new HttpException(
          "Не удалось отправить SMS",
          HttpStatus.BAD_GATEWAY,
        );
      }

      this.logger.log(`SMS sent to ${this.maskPhone(phone)}`);
    } catch (error: any) {
      this.logger.error(`Ошибка при отправке SMS: ${error?.message || error}`);
      throw new HttpException("Ошибка отправки SMS", HttpStatus.BAD_GATEWAY);
    }
  }

  private maskPhone(phone: string): string {
    return phone.replace(
      /(\+?\d{1,3})(\d{3})(\d{2})(\d{2})(\d{2})/,
      "$1$2****$5",
    );
  }
}
