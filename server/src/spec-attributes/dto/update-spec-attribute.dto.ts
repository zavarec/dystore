import { PartialType } from "@nestjs/mapped-types";
import { CreateSpecAttributeDto } from "./create-spec-attribute.dto";
export class UpdateSpecAttributeDto extends PartialType(
  CreateSpecAttributeDto,
) {}
