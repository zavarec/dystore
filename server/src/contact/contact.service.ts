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

  private taskTypeId = Number(process.env.AMO_TASK_TYPE_ID) || 1; // проверь через GET task_types

  private async debugGetNotes(leadId: number) {
    const res = await this.amo.request<any>({
      url: `leads/${leadId}/notes`,
      method: "GET",
      params: { limit: 50, page: 1 },
    });
    this.logger.log(`NOTES for lead ${leadId}: ${JSON.stringify(res)}`);
    return res;
  }

  private sleep(ms: number) {
    return new Promise((r) => setTimeout(r, ms));
  }

  private normalizeNoteText(s: string, limit = 4000) {
    const normalized = s.replace(/\r?\n/g, "\r\n");
    return normalized.length > limit
      ? normalized.slice(0, limit - 1) + "…"
      : normalized;
  }

  private async addLeadNoteWithRetry(leadId: number, text: string) {
    const body = [
      {
        note_type: "common",
        params: { text: this.normalizeNoteText(text) },
      },
    ];
    const maxAttempts = 4;
    const delays = [250, 500, 1000];

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        this.logger.log(
          `NOTE TRY ${attempt}/${maxAttempts} leadId=${leadId} body=${JSON.stringify(body)}`,
        );

        const res = await this.amo.request<any>({
          url: `leads/${leadId}/notes`,
          method: "POST",
          data: body,
        });
        this.logger.log(
          `Note created for lead ${leadId}: ${JSON.stringify(res)}`,
        );
        this.logger.log(
          `NOTE RESP status=OK leadId=${leadId} resp=${JSON.stringify(res?._embedded?.notes ?? res)}`,
        );
        return res;
      } catch (e: any) {
        this.logger.error(
          `NOTE ERR leadId=${leadId} code=${e?.response?.status} data=${JSON.stringify(e?.response?.data)}`,
        );
        const code = e?.response?.status;
        if (attempt < delays.length && (code === 404 || code === 409)) {
          await this.sleep(delays[attempt]);
          continue;
        }

        throw e;
      }
    }
  }

  private async createTaskWithRetry(leadId: number, text: string) {
    const payload = [
      {
        text,
        task_type_id: this.taskTypeId,
        complete_till: Math.floor((Date.now() + 4 * 3600_000) / 1000),
        entity_id: leadId,
        entity_type: "leads",
        responsible_user_id: this.responsibleUserId || undefined,
      },
    ];
    const delays = [300, 600];

    for (let i = 0; i < delays.length + 1; i++) {
      try {
        return await this.amo.request({
          url: "tasks",
          method: "POST",
          data: payload,
        });
      } catch (e: any) {
        const code = e?.response?.status;
        if (i < delays.length && (code === 404 || code === 409)) {
          await this.sleep(delays[i]);
          continue;
        }
        throw e;
      }
    }
  }

  /** Создаёт лид + контакт + заметку + задачу */
  async createSupportLead(dto: CreateContactRequestDto) {
    const name = dto.fullName?.trim() || "Клиент с сайта";
    const leadName = `Обращение с сайта — ${name}`;

    // contact custom fields
    const contactFields: any[] = [];
    if (dto.email) {
      contactFields.push({
        field_code: "EMAIL",
        values: [{ value: dto.email, enum_code: "WORK" }],
      });
    }
    if (dto.phone) {
      // если храните без +7, можно префиксовать здесь
      contactFields.push({
        field_code: "PHONE",
        values: [{ value: dto.phone, enum_code: "WORK" }],
      });
    }

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
              ...(contactFields.length
                ? { custom_fields_values: contactFields }
                : {}),
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

    if (leadId) {
      // маленькая пауза — дать сделке "устаканиться"
      await this.sleep(300);

      const noteLines = [
        `Имя: ${name}`,
        dto.email ? `Email: ${dto.email}` : "",
        dto.phone ? `Телефон: ${dto.phone}` : "",
        dto.orderNumber ? `Номер заказа/серийный: ${dto.orderNumber}` : "",
        "",
        "Сообщение:",
        dto.message,
      ]
        .filter(Boolean)
        .join("\n");

      await this.addLeadNoteWithRetry(leadId, noteLines);

      await this.debugGetNotes(leadId);

      // задача
      await this.createTaskWithRetry(leadId, "Связаться по обращению с сайта");
    }

    return { success: true, leadId, contactId };
  }
}
