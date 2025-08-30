import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);
  private readonly botToken: string;
  private readonly chatId: string;

  constructor(private readonly configService: ConfigService) {
    this.botToken =
      this.configService.get<string>("TELEGRAM_BOT_TOKEN", "") ||
      this.configService.get<string>("TELEGRAM_BOT_API", "") ||
      this.configService.get<string>("TELEGRAM_BOT_API_KEY", "");
    this.chatId =
      this.configService.get<string>("TELEGRAM_CHAT_ID", "") ||
      this.configService.get<string>("TELEGRAM_CHAT", "");
  }

  async sendMessage(
    text: string,
    parseMode: "Markdown" | "HTML" | undefined = undefined,
  ): Promise<void> {
    try {
      console.log(text, "text");
      console.log(parseMode, "parseMode");

      if (!this.botToken || !this.chatId) {
        this.logger.warn(
          "TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID не заданы. Сообщение в Telegram пропущено.",
        );
        return;
      }

      const url = new URL(
        `https://api.telegram.org/bot${this.botToken}/sendMessage`,
      );
      const body = {
        chat_id: this.chatId,
        text,
        parse_mode: parseMode,
        disable_web_page_preview: true,
      } as const;

      const response = await fetch(url.toString(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = (await response.json()) as any;

      if (!response.ok || data?.ok !== true) {
        const errorText = `Telegram sendMessage failed: ${JSON.stringify(data)}`;
        this.logger.error(errorText);
        throw new HttpException(
          "Не удалось отправить Telegram-уведомление",
          HttpStatus.BAD_GATEWAY,
        );
      }

      this.logger.log("Telegram сообщение отправлено");
    } catch (error: any) {
      this.logger.error(
        `Ошибка отправки в Telegram: ${error?.message || error}`,
      );
      throw new HttpException(
        "Ошибка отправки Telegram",
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
}
