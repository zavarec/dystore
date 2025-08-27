import * as winston from "winston";
import "winston-daily-rotate-file";

const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json(),
);

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(({ timestamp, level, message, context, trace }) => {
    return `${timestamp} [${context || "Application"}] ${level}: ${message}${
      trace ? `\n${trace}` : ""
    }`;
  }),
);

export const createLogger = () => {
  const transports: winston.transport[] = [
    new winston.transports.Console({
      format: consoleFormat,
    }),
  ];

  if (process.env.NODE_ENV === "production") {
    transports.push(
      new winston.transports.DailyRotateFile({
        filename: "logs/error-%DATE%.log",
        datePattern: "YYYY-MM-DD",
        level: "error",
        format: logFormat,
        maxSize: "20m",
        maxFiles: "14d",
      }),
      new winston.transports.DailyRotateFile({
        filename: "logs/combined-%DATE%.log",
        datePattern: "YYYY-MM-DD",
        format: logFormat,
        maxSize: "20m",
        maxFiles: "14d",
      }),
    );
  }

  return winston.createLogger({
    level: process.env.LOG_LEVEL || "info",
    format: logFormat,
    transports,
  });
};
