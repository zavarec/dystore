import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  Logger,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import Redis from "ioredis";
import { UsersService } from "../users/users.service";
import { SmsService } from "../sms/sms.service";
import { OtpService } from "../otp/otp.service";
import { generateOtp } from "../common/utils/otp.util";
import { SendCodeDto } from "./dto/send-code.dto";
import { VerifyCodeDto } from "./dto/verify-code.dto";
import { RegisterDto } from "./dto/register.dto";
import { Role } from "@prisma/client";
import { LoginDto } from "./dto/login.dto";
import { JwtPayload } from "./jwt.strategy";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly smsService: SmsService,
    private readonly otpService: OtpService,
  ) {}

  async sendVerificationCode(
    sendCodeDto: SendCodeDto,
  ): Promise<{ message: string }> {
    const { phone } = sendCodeDto;

    // Rate limit через Redis lock: 1 SMS / 30 сек
    const allowed = await this.otpService.setRateLimitLock(phone, 30);
    if (!allowed) {
      throw new BadRequestException(
        "Слишком частые запросы. Повторите попытку через 30 секунд",
      );
    }

    // Генерируем 6-значный код
    const code = generateOtp(6);

    // Сохраняем код в Redis с TTL 5 минут
    await this.otpService.setCode(phone, code);

    // Отправляем SMS через sms.ru
    await this.smsService.sendCode(phone, code);

    this.logger.log(`Код подтверждения отправлен на номер ${phone}`);

    return { message: "Код отправлен" };
  }

  async verifyCode(verifyCodeDto: VerifyCodeDto): Promise<{
    accessToken: string;
    refreshToken: string;
    access_token: string;
  }> {
    const { phone, code } = verifyCodeDto;

    // Получаем и удаляем код из Redis атомарно
    const storedCode = await this.otpService.getAndDel(phone);

    if (!storedCode) {
      throw new BadRequestException("Код истёк или не найден");
    }

    if (storedCode !== code) {
      throw new UnauthorizedException("Неверный код подтверждения");
    }

    // Находим или создаём пользователя
    const user = await this.upsertUserByPhone(phone);

    // Выдаём пару токенов
    const { accessToken, refreshToken } = await this.issueTokens(
      user.id,
      user.role,
    );

    this.logger.log(`Пользователь ${phone} успешно авторизован`);

    // Совместимость с клиентом: возвращаем и новое, и старое поле
    return { accessToken, refreshToken, access_token: accessToken };
  }

  // Регистрация по email и паролю
  async register(
    registerDto: RegisterDto,
  ): Promise<{ access_token: string; user: any }> {
    const { email, password, name } = registerDto;

    const user = await this.usersService.createUserWithEmail(
      email,
      password,
      name,
      Role.CUSTOMER,
    );

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email || undefined,
    };

    const access_token = this.jwtService.sign(payload);

    this.logger.log(`Пользователь ${user.email} успешно зарегистрирован`);

    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  // Вход по email и паролю
  async login(
    loginDto: LoginDto,
  ): Promise<{ access_token: string; user: any }> {
    const { email, password } = loginDto;

    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException("Неверный email или пароль");
    }

    const isPasswordValid = await this.usersService.validatePassword(
      user,
      password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException("Неверный email или пароль");
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email || undefined,
    };

    const access_token = this.jwtService.sign(payload);

    this.logger.log(`Пользователь ${user.email} успешно авторизован`);

    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  private generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Создание/поиск пользователя по телефону (upsert)
  async upsertUserByPhone(phone: string) {
    return this.usersService.findOrCreateByPhone(phone);
  }

  // Выпуск access/refresh токенов
  async issueTokens(userId: string, role: Role) {
    const payload: JwtPayload = { sub: userId };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>("JWT_SECRET", "default-secret"),
      expiresIn: "15m",
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>(
        "JWT_REFRESH_SECRET",
        "default-refresh-secret",
      ),
      expiresIn: this.configService.get<string>("JWT_REFRESH_EXPIRES_IN", "7d"),
    });

    return { accessToken, refreshToken };
  }
}
