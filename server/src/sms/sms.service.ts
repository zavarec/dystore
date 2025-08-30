import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  Inject,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SMS_RU_CLIENT } from "./sms.provider";

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private readonly apiKey: string;
  private readonly from?: string; // альфа-имя (необяз.)
  private readonly testMode: boolean;

  constructor(
    private readonly configService: ConfigService,
    @Inject(SMS_RU_CLIENT) private readonly smsRuClient: any | null,
  ) {
    this.apiKey = this.configService.get<string>("SMS_RU_API_KEY", "");
    this.from = this.configService.get<string>("SMS_RU_FROM") || undefined;
    this.testMode = this.configService.get<string>("SMS_RU_TEST") === "1"; // включаем test-режим
  }

  async sendCode(phone: string, code: string): Promise<void> {
    try {
      // DEV-режим: если нет ключа или клиента
      if (!this.apiKey || !this.smsRuClient) {
        this.logger.warn("SMS_RU_API_KEY не задан — dev-логирование кода.");
        this.logger.warn(
          `DEV MODE — SMS code for ${this.maskPhone(phone)}: ${code}`,
        );
        return;
      }

      const params: any = {
        to: phone,
        text: `Ваш код подтверждения: ${code}`,
      };

      if (this.from) params.from = this.from;
      if (this.testMode) params.test = 1; // включаем test=1

      const result = await this.sendViaSmsRu(params);

      // Проверяем общий статус
      if (result?.status !== "OK") {
        this.logger.error(`SMS API error: ${JSON.stringify(result)}`);
        throw new HttpException(
          "Сервис SMS вернул ошибку",
          HttpStatus.BAD_GATEWAY,
        );
      }

      // Проверяем конкретный номер
      const phoneResult = result.sms?.[phone];
      if (!phoneResult || phoneResult.status !== "OK") {
        this.logger.error(
          `SMS not accepted for ${phone}: ${JSON.stringify(phoneResult)}`,
        );
        throw new HttpException(
          "SMS не было принято оператором",
          HttpStatus.BAD_GATEWAY,
        );
      }

      // Лог с деталями
      this.logger.log(
        `SMS ${this.testMode ? "(TEST MODE)" : ""} sent to ${this.maskPhone(
          phone,
        )}, sms_id=${phoneResult.sms_id}, balance=${result.balance}`,
      );
    } catch (e: any) {
      this.logger.error(`Ошибка при отправке SMS: ${e?.message || e}`);
      throw new HttpException("Ошибка отправки SMS", HttpStatus.BAD_GATEWAY);
    }
  }

  private sendViaSmsRu(params: any): Promise<any> {
    return new Promise((resolve) => {
      this.smsRuClient.sms_send(params, (res: any) => {
        // если пакет вернул уже вложенный объект (code/description) — оборачиваем его
        if (res && res.code && !res.status) {
          resolve({
            status: "OK",
            sms: {
              [params.to]: {
                status: "OK",
                status_code: Number(res.code),
                status_text: res.description,
                sms_id: res.ids,
              },
            },
            balance: res.balance,
          });
        } else {
          resolve(res);
        }
      });
    });
  }

  private maskPhone(phone: string): string {
    return phone.replace(
      /(\+?\d{1,3})(\d{3})(\d{2})(\d{2})(\d{2})/,
      "$1$2****$5",
    );
  }
}
