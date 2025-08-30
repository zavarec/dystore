import * as Joi from "joi";

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid("development", "production", "test")
    .default("development"),
  PORT: Joi.number().default(3000),
  DATABASE_URL: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().default("7d"),
  JWT_REFRESH_SECRET: Joi.when("NODE_ENV", {
    is: "production",
    then: Joi.string().required(),
    otherwise: Joi.string().allow("").optional(),
  }),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default("30d"),
  REDIS_HOST: Joi.string().default("localhost"),
  REDIS_PORT: Joi.number().default(6379),
  REDIS_PASSWORD: Joi.string().allow("").optional(),
  SMS_RU_API_KEY: Joi.string().allow("").optional(),
  TELEGRAM_BOT_TOKEN: Joi.string().allow("").optional(),
  TELEGRAM_CHAT_ID: Joi.string().allow("").optional(),
});
