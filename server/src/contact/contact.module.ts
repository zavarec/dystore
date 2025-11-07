import { Module } from "@nestjs/common";

import { ContactService } from "./contact.service";
import { ContactController } from "./contact.controller";
import { AmocrmModule } from "src/amo-crm/amo-crm.module";

@Module({
  imports: [AmocrmModule],
  controllers: [ContactController],
  providers: [ContactService],
})
export class ContactModule {}
