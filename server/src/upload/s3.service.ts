import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { v4 as uuid } from "uuid";

@Injectable()
export class S3Service {
  private readonly s3: S3Client;
  private readonly bucket: string;
  private readonly endpoint: string;

  constructor(private readonly config: ConfigService) {
    // если есть getOrThrow — лучше использовать его
    this.endpoint = this.config.getOrThrow<string>("S3_ENDPOINT");
    const region = this.config.getOrThrow<string>("S3_REGION");
    const accessKeyId = this.config.getOrThrow<string>("S3_ACCESS_KEY_ID");
    const secretAccessKey = this.config.getOrThrow<string>(
      "S3_SECRET_ACCESS_KEY",
    );
    this.bucket = this.config.getOrThrow<string>("S3_BUCKET");

    this.s3 = new S3Client({
      endpoint: this.endpoint, // https://s3.twcstorage.ru
      region, // "ru-1"
      credentials: { accessKeyId, secretAccessKey },
      forcePathStyle: true, // TWC/S3-совместимые провайдеры часто требуют
    });
  }

  /**
   * Загрузка файла в S3 (ожидаем Multer memoryStorage -> file.buffer)
   */
  async uploadFile(file: Express.Multer.File) {
    if (!file || !file.buffer) {
      throw new Error(
        "Empty file/buffer. Ensure Multer memoryStorage is used.",
      );
    }

    const key = `uploads/${uuid()}-${file.originalname}`;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: "public-read", // если файлы должны открываться по прямой ссылке
      }),
    );

    const url = `${this.endpoint}/${this.bucket}/${key}`;
    return { key, url, contentType: file.mimetype, size: file.size };
  }

  async deleteFile(key: string) {
    await this.s3.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );
  }

  async uploadBuffer(params: {
    buffer: Buffer;
    originalName: string;
    contentType: string;
    prefix?: string; // например 'uploads/'
    aclPublic?: boolean; // по умолчанию true
  }) {
    const safeName = params.originalName.replace(/[^\w.\-]/g, "_");
    const key = `${params.prefix ?? "uploads/"}${uuid()}-${safeName}`;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: params.buffer,
        ContentType: params.contentType,
        ACL: params.aclPublic === false ? undefined : "public-read",
      }),
    );

    const url = `${this.endpoint}/${this.bucket}/${key}`;
    return {
      key,
      url,
      size: params.buffer.byteLength,
      contentType: params.contentType,
    };
  }

  async deleteObject(key: string) {
    await this.s3.send(
      new DeleteObjectCommand({ Bucket: this.bucket, Key: key }),
    );
  }
}
