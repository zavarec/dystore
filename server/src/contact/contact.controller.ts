import { Body, Controller, Post } from "@nestjs/common";
import { ContactService } from "./contact.service";
import { CreateContactRequestDto } from "./dto/create-contact-request.dto";

@Controller("contact")
export class ContactController {
  constructor(private readonly contact: ContactService) {}

  @Post()
  async create(@Body() body: CreateContactRequestDto) {
    const result = await this.contact.createSupportLead(body);
    return result;
  }
}
