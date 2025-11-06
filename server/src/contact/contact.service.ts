// server/src/contact/contact.service.ts
import { Injectable } from "@nestjs/common";
import { AmoHttpService } from "src/amo-crm/amo-http.service";
import { CreateContactRequestDto } from "./dto/create-contact-request.dto";

@Injectable()
export class ContactService {
  constructor(private readonly amo: AmoHttpService) {}

  private pipelineId = Number(process.env.AMO_PIPELINE_ID); // ID воронки «Поддержка»
  private statusNewId = Number(process.env.AMO_STATUS_NEW_ID); // Статус «Новая заявка»
  private responsibleUserId = Number(process.env.AMO_RESPONSIBLE_USER_ID); // Ответственный
  private tagSupport = process.env.AMO_TAG_SUPPORT || "Support";
  private sourceId = process.env.AMO_SOURCE_ID; // опционально: ID источника «Сайт»

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
                  field_code: "EMAIL", // системный код поля для контакта
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

    // 2) Добавляем заметку в лид с текстом обращения
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

      await this.amo.request({
        url: `leads/${leadId}/notes`,
        method: "POST",
        data: [
          {
            note_type: "common",
            params: { text: noteLines },
          },
        ],
      });
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
