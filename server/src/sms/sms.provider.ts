import { Provider } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SMS_GATEWAY } from "./sms.tokens";
import { SmsGateway, SmsRuGateway, SmsAeroGateway } from "./sms.gateway";

export const smsGatewayProvider: Provider = {
  provide: SMS_GATEWAY,
  inject: [ConfigService],
  useFactory: (cfg: ConfigService): SmsGateway | null => {
    const provider = (cfg.get<string>("SMS_PROVIDER") || "dev").toLowerCase();

    if (provider === "smsru") {
      const apiId = cfg.get<string>("SMS_RU_API_KEY") ?? "";
      const from = cfg.get<string>("SMS_RU_FROM") || undefined;
      if (!apiId) return null; // dev-режим
      return new SmsRuGateway(apiId, from);
    }

    if (provider === "smsaero") {
      const email = cfg.get<string>("SMS_AERO_EMAIL") ?? "";
      const key = cfg.get<string>("SMS_AERO_API_KEY") ?? "";
      const sign = cfg.get<string>("SMS_AERO_SIGN") || "SMS Aero";
      if (!email || !key) return null; // dev-режим
      return new SmsAeroGateway(email, key, sign);
    }

    // dev: без внешнего провайдера
    return null;
  },
};
