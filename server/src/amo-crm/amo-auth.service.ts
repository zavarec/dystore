import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Redis from "ioredis";
import axios from "axios";

type Tokens = {
  access_token: string;
  refresh_token: string;
  expires_at: number; // ms epoch
};

@Injectable()
export class AmoAuthService {
  private redis: Redis;
  private key: string;

  constructor(private readonly config: ConfigService) {
    // Если у тебя Redis уже инициализирован где-то — прокинь через DI.
    this.redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
    this.key = `amocrm:tokens:${this.config.get("AMO_SUBDOMAIN")}`;
  }

  private async readTokens(): Promise<Tokens | null> {
    const raw = await this.redis.get(this.key);
    return raw ? (JSON.parse(raw) as Tokens) : null;
  }

  private async saveTokens(t: Tokens) {
    await this.redis.set(this.key, JSON.stringify(t));
  }

  async getAccessToken(): Promise<string> {
    const t = await this.readTokens();
    if (!t) throw new Error("Amo tokens not initialized");
    // авто-рефреш по сроку
    if (Date.now() > t.expires_at - 60_000) {
      await this.refreshTokens();
      const nt = await this.readTokens();
      return nt!.access_token;
    }
    return t.access_token;
  }

  async exchangeCodeForTokens(code: string) {
    const base = `https://${this.config.get("AMO_SUBDOMAIN")}`;
    const res = await axios.post(`${base}/oauth2/access_token`, {
      client_id: this.config.get("AMO_CLIENT_ID"),
      client_secret: this.config.get("AMO_CLIENT_SECRET"),
      grant_type: "authorization_code",
      code,
      redirect_uri: this.config.get("AMO_REDIRECT_URI"),
    });
    const expires_at = Date.now() + res.data.expires_in * 1000;
    const payload: Tokens = {
      access_token: res.data.access_token,
      refresh_token: res.data.refresh_token,
      expires_at,
    };
    await this.saveTokens(payload);
  }

  async refreshTokens() {
    const t = await this.readTokens();
    if (!t) throw new Error("Amo tokens not initialized");
    const base = `https://${this.config.get("AMO_SUBDOMAIN")}`;
    const res = await axios.post(`${base}/oauth2/access_token`, {
      client_id: this.config.get("AMO_CLIENT_ID"),
      client_secret: this.config.get("AMO_CLIENT_SECRET"),
      grant_type: "refresh_token",
      refresh_token: t.refresh_token,
      redirect_uri: this.config.get("AMO_REDIRECT_URI"),
    });
    const expires_at = Date.now() + res.data.expires_in * 1000;
    const payload: Tokens = {
      access_token: res.data.access_token,
      refresh_token: res.data.refresh_token,
      expires_at,
    };
    await this.saveTokens(payload);
  }
}
