import { Module } from "@nestjs/common";

import { ContactService } from "./contact.service";
import { ContactController } from "./contact.controller";
import { AmoHttpService } from "src/amo-crm/amo-http.service";

@Module({
  controllers: [ContactController],
  providers: [ContactService, AmoHttpService],
})
export class ContactModule {}
