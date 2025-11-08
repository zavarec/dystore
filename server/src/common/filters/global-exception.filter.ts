import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Request, Response } from "express";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = "Внутренняя ошибка сервера";
    let error = "Internal Server Error";

    // HTTP исключения
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse() as
        | string
        | { message?: string; error?: string };

      if (typeof exceptionResponse === "string") {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === "object") {
        message = exceptionResponse.message || message;
        error = exceptionResponse.error || error;
      }
    }
    // Prisma ошибки
    else if (exception instanceof PrismaClientKnownRequestError) {
      status = HttpStatus.BAD_REQUEST;

      switch (exception.code) {
        case "P2002":
          message = "Запись с такими данными уже существует";
          error = "Unique constraint violation";
          break;
        case "P2025":
          message = "Запись не найдена";
          error = "Record not found";
          status = HttpStatus.NOT_FOUND;
          break;
        case "P2003":
          message = "Нарушение связи между таблицами";
          error = "Foreign key constraint violation";
          break;
        default:
          message = "Ошибка базы данных";
          error = "Database error";
      }

      this.logger.error(`Prisma error ${exception.code}: ${exception.message}`);
    }
    // Неизвестные ошибки
    else {
      if (exception instanceof Error) {
        this.logger.error("Unexpected error", {
          message: exception.message,
          stack: exception.stack,
        });
      } else {
        this.logger.error("Unexpected non-Error exception", {
          value: String(exception),
        });
      }
    }

    if (Number(status) >= 500) {
      const stack = exception instanceof Error ? exception.stack : undefined;
      this.logger.error(
        `${request.method} ${request.url} - ${status} - ${exception instanceof Error ? exception.message : message}`,

        { stack },
      );
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
      error,
      ...(process.env.NODE_ENV === "development" && {
        stack: exception instanceof Error ? exception.stack : undefined,
      }),
    });
  }
}
