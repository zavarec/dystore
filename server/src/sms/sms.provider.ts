import { Provider } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const SMSru = require("sms_ru");

export const SMS_RU_CLIENT = "SMS_RU_CLIENT";

export const SmsProvider: Provider = {
  provide: SMS_RU_CLIENT,
  inject: [ConfigService],
  useFactory: (cfg: ConfigService) => {
    const apiId = cfg.get<string>("SMS_RU_API_KEY") ?? "";
    if (!apiId) return null; // dev-режим без отправки
    const client = new SMSru(apiId);
    return client;
  },
};
