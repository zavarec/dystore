import { Transform } from "class-transformer";
import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidateIf,
} from "class-validator";

function AtLeastOneOf<T extends Record<PropertyKey, unknown>>(
  props: (keyof T)[],
  options?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: "AtLeastOneOf",
      target: object.constructor,
      propertyName,
      options: {
        message: "Укажите email или телефон",
        ...options,
      },
      constraints: [props],
      validator: {
        validate(_: any, args: ValidationArguments) {
          const fields = args.constraints[0] as (keyof T)[];
          const obj = args.object as T;
          return fields.some((k) => {
            const v = obj[k];
            return typeof v === "string" ? v.trim().length > 0 : !!v;
          });
        },
      },
    });
  };
}

export class CreateContactRequestDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  fullName?: string;

  @ValidateIf((o: CreateContactRequestDto) => !o.phone)
  @IsEmail({}, { message: "Некорректный email" })
  @MaxLength(256)
  email?: string;

  @ValidateIf((o: CreateContactRequestDto) => !o.email)
  @Transform(({ value }) =>
    typeof value === "string" ? value.replace(/\D+/g, "") : value,
  )
  @IsString({ message: "Номер телефона должен быть строкой" })
  @MinLength(10, { message: "Укажите корректный номер телефона" })
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(64)
  orderNumber?: string;

  @IsString()
  @MinLength(8)
  @MaxLength(5000)
  message!: string;
}
