export type SendContactRequestPayload =
  | ({
      email: string;
      phone?: string;
    } & BaseSendContactRequestFields)
  | ({
      email?: string;
      phone: string;
    } & BaseSendContactRequestFields);

export interface BaseSendContactRequestFields {
  orderNumber?: string;
  message: string;
  fullName?: string;
}

export interface SendContacRequestResponse {
  success: boolean;
  leadId?: number;
  contactId?: number;
}
