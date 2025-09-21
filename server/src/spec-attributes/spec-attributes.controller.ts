import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from "@nestjs/common";
import { SpecAttributesService } from "./spec-attributes.service";
import { CreateSpecAttributeDto } from "./dto/create-spec-attribute.dto";
import { UpdateSpecAttributeDto } from "./dto/update-spec-attribute.dto";

@Controller("spec-attributes")
export class SpecAttributesController {
  constructor(private readonly specAttributesService: SpecAttributesService) {}

  @Get()
  list(@Query("q") q?: string) {
    return this.specAttributesService.list(q);
  }

  @Get(":id")
  get(@Param("id") id: string) {
    return this.specAttributesService.get(+id);
  }

  @Post()
  create(@Body() dto: CreateSpecAttributeDto) {
    return this.specAttributesService.create(dto);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateSpecAttributeDto) {
    return this.specAttributesService.update(+id, dto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.specAttributesService.remove(+id);
  }
}
