/* eslint-disable @typescript-eslint/no-var-requires */
const SMSru = require("sms_ru");
const { SmsAero, SmsAeroError, SmsAeroHTTPError } = require("smsaero");

export type SendOptions = { sign?: string; from?: string };

export interface SmsGateway {
  sendText(to: string, text: string, opts?: SendOptions): Promise<void>;
  sendTelegram?(
    to: string,
    code: number,
    sign?: string,
    text?: string,
  ): Promise<void>;
  balance?(): Promise<any>;
}

export class SmsRuGateway implements SmsGateway {
  private client: any;
  private from?: string;

  constructor(apiId: string, from?: string) {
    this.client = new SMSru(apiId);
    this.from = from;
  }

  sendText(to: string, text: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const params: any = { to, text };
      if (this.from) params.from = this.from;

      this.client.sms_send(params, (res: any) => {
        // нормализуем ответ в “успех/ошибка”
        const ok =
          (res?.status === "OK" && res?.sms?.[to]?.status === "OK") ||
          (!!res?.code && Number(res.code) === 100);

        if (ok) return resolve();
        return reject(new Error(`sms.ru error: ${JSON.stringify(res)}`));
      });
    });
  }

  balance(): Promise<any> {
    return new Promise((resolve) => {
      this.client.my_balance((res: any) => resolve(res));
    });
  }
}

export class SmsAeroGateway implements SmsGateway {
  private client: any;

  constructor(email: string, apiKey: string) {
    this.client = new SmsAero(email, apiKey);
  }

  async sendText(to: string, text: string, opts?: SendOptions): Promise<void> {
    try {
      //   const sign = opts?.sign ?? this.sign;
      const res = await this.client.send(to, text);
      if (!res || res.success === false) {
        throw new Error(`SmsAero failed: ${JSON.stringify(res)}`);
      }
    } catch (error: any) {
      if (error instanceof SmsAeroError || error instanceof SmsAeroHTTPError)
        throw error;
      throw new Error(`SmsAero unknown error: ${error?.message || error}`);
    }
  }

  async sendTelegram(to: string, code: number, sign?: string, text?: string) {
    await this.client.sendTelegram(
      to,
      code,
      undefined,
      text ?? `Ваш код ${code}`,
    );
  }

  balance() {
    return this.client.balance();
  }
}
