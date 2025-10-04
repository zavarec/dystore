// src/amocrm/amo-http.service.ts
import { Injectable } from "@nestjs/common";
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { ConfigService } from "@nestjs/config";
import { AmoAuthService } from "./amo-auth.service";

@Injectable()
export class AmoHttpService {
  private http: AxiosInstance;

  constructor(
    private readonly config: ConfigService,
    private readonly auth: AmoAuthService,
  ) {
    this.http = axios.create({
      baseURL: `https://${this.config.get("AMO_SUBDOMAIN")}/api/v4/`,
      timeout: 20000,
    });
  }

  async request<T = any>(cfg: AxiosRequestConfig): Promise<T> {
    const token = await this.auth.getAccessToken();
    try {
      const res = await this.http.request<T>({
        ...cfg,
        headers: { ...(cfg.headers || {}), Authorization: `Bearer ${token}` },
      });
      return res.data as T;
    } catch (e: any) {
      if (e?.response?.status === 401) {
        await this.auth.refreshTokens();
        const retryToken = await this.auth.getAccessToken();
        const res = await this.http.request<T>({
          ...cfg,
          headers: {
            ...(cfg.headers || {}),
            Authorization: `Bearer ${retryToken}`,
          },
        });
        return res.data as T;
      }
      // ← вот это и есть "расширенный" catch для понятной ошибки
      const status = e?.response?.status;
      const data = e?.response?.data;
      const url = `${this.http.defaults.baseURL}${cfg.url}`;
      const method = (cfg.method || "GET").toUpperCase();
      throw new Error(
        `amo ${method} ${url} -> ${status}: ${typeof data === "string" ? data : JSON.stringify(data)}`,
      );
    }
  }
}
