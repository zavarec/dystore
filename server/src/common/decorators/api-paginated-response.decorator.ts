import { applyDecorators, Type } from "@nestjs/common";
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from "@nestjs/swagger";
import { PaginatedResultDto } from "../dto/paginated-result.dto";

export const ApiPaginatedResponse = <TModel extends Type<any>>(
  model: TModel,
) => {
  return applyDecorators(
    ApiExtraModels(PaginatedResultDto),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginatedResultDto) },
          {
            properties: {
              data: {
                type: "array",
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    }),
  );
};
