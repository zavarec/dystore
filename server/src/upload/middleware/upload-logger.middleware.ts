import { Injectable, NestMiddleware, Logger } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class UploadLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger("UploadLogger");

  use(req: Request, res: Response, next: NextFunction) {
    if (req.path.includes("/upload/")) {
      this.logger.log("=== MULTER MIDDLEWARE ===");
      this.logger.log(`Request to: ${req.path}`);
      this.logger.log(`Method: ${req.method}`);
      this.logger.log(`Content-Type: ${req.headers["content-type"]}`);
      this.logger.log(`Content-Length: ${req.headers["content-length"]}`);
      this.logger.log(
        `Authorization: ${req.headers["authorization"] ? "Present" : "Missing"}`,
      );
      this.logger.log(`Cookies: ${JSON.stringify(req.cookies)}`);

      // Логируем начало обработки multipart
      if (req.headers["content-type"]?.includes("multipart/form-data")) {
        this.logger.log("Processing multipart/form-data request");

        // Добавляем обработчики событий для multer
        req.on("data", (chunk) => {
          this.logger.log(`Received data chunk: ${chunk.length} bytes`);
        });

        req.on("end", () => {
          this.logger.log("Request body processing completed");
        });

        req.on("error", (error) => {
          this.logger.error("Request processing error:", error);
        });
      }
    }

    next();
  }
}

