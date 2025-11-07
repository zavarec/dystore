// server/src/contact/contact.service.ts
import { Injectable, Logger } from "@nestjs/common";
import { AmoHttpService } from "src/amo-crm/amo-http.service";
import { CreateContactRequestDto } from "./dto/create-contact-request.dto";

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(private readonly amo: AmoHttpService) {}

  private pipelineId = Number(process.env.AMO_PIPELINE_ID);
  private statusNewId = Number(process.env.AMO_STATUS_NEW_ID);
  private responsibleUserId = Number(process.env.AMO_RESPONSIBLE_USER_ID);
  private tagSupport = process.env.AMO_TAG_SUPPORT || "Support";
  private sourceId = process.env.AMO_SOURCE_ID;

  private sleep(ms: number) {
    return new Promise((r) => setTimeout(r, ms));
  }

  private async addLeadNoteWithRetry(leadId: number, text: string) {
    // amo любит \r\n в HTML-рендере
    const normalized = text.replace(/\r?\n/g, "\r\n");

    const body = [
      {
        note_type: "common", // тип корректный
        params: { text: normalized },
      },
    ];

    const maxAttempts = 4;
    const delays = [250, 500, 1000]; // нарастающая пауза

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const res = await this.amo.request<any>({
          url: `leads/${leadId}/notes`,
          method: "POST",
          data: body,
          // убедись, что AmoHttpService проставляет
          // headers: { 'Content-Type': 'application/json' }
        });

        // опционально — убедимся, что нотка действительно создалась
        this.logger.log(
          `Note created for lead ${leadId}: ${JSON.stringify(res)}`,
        );
        return res;
      } catch (e: any) {
        const status = e?.response?.status;
        // Часто 404/409 — сразу после complex-создания. Ретраим.
        if (attempt < maxAttempts && (status === 404 || status === 409)) {
          await this.sleep(delays[attempt - 1] ?? 1000);
          continue;
        }
        this.logger.error(
          `Failed to add note for lead ${leadId}`,
          e?.response?.data ?? e,
        );
        throw e;
      }
    }
  }

  /**
   * Создаёт лид + контакт + заметку + задачу
   */
  async createSupportLead(dto: CreateContactRequestDto) {
    const name = dto.fullName?.trim() || "Клиент с сайта";
    const leadName = `Обращение с сайта — ${name}`;

    // 1) Создаём лид (complex) с привязкой контакта (email)
    const payload = [
      {
        name: leadName,
        pipeline_id: this.pipelineId || undefined,
        status_id: this.statusNewId || undefined,
        responsible_user_id: this.responsibleUserId || undefined,
        _embedded: {
          contacts: [
            {
              name,
              custom_fields_values: [
                {
                  field_code: "EMAIL",
                  values: [{ value: dto.email }],
                },
              ],
            },
          ],
          tags: this.tagSupport ? [{ name: this.tagSupport }] : undefined,
        },
        ...(this.sourceId ? { source_id: this.sourceId } : {}),
      },
    ];

    const createResp = await this.amo.request<any>({
      url: "leads/complex",
      method: "POST",
      data: payload,
    });

    const lead = createResp?._embedded?.leads?.[0];
    const leadId: number | undefined = lead?.id;
    const contactId: number | undefined = lead?._embedded?.contacts?.[0]?.id;

    // 2) Добавляем заметку в лид с текстом обращения (с задержкой и ретраями)
    if (leadId) {
      const noteLines = [
        `Имя: ${name}`,
        `Email: ${dto.email}`,
        dto.orderNumber ? `Номер заказа/серийный: ${dto.orderNumber}` : "",
        "",
        "Сообщение:",
        dto.message,
      ]
        .filter(Boolean)
        .join("\n");

      await this.addLeadNoteWithRetry(leadId, noteLines);
    }

    // 3) Создаём задачу ответственному
    if (leadId && this.responsibleUserId) {
      const completeTill = Math.floor((Date.now() + 4 * 60 * 60 * 1000) / 1000);

      await this.amo.request({
        url: `tasks`,
        method: "POST",
        data: [
          {
            text: "Связаться по обращению с сайта",
            complete_till: completeTill,
            entity_id: leadId,
            entity_type: "leads",
            responsible_user_id: this.responsibleUserId,
          },
        ],
      });
    }

    return {
      success: true,
      leadId,
      contactId,
    };
  }
}
