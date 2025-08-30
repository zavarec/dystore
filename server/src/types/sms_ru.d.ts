declare module "sms_ru" {
  class SMSru {
    constructor(api_id: string);
    sms_send(
      params: {
        to?: string;
        text?: string;
        from?: string;
        time?: number;
        translit?: boolean;
        test?: boolean;
        partner_id?: string | number;
        multi?: [string, string][];
      },
      cb: (res: any) => void,
    ): void;

    sms_status(id: string, cb: (res: any) => void): void;
    sms_cost(
      params: { to: string; text: string },
      cb: (res: any) => void,
    ): void;
  }
  export = SMSru;
}
