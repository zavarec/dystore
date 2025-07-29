import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { UsersService } from '../users/users.service';
import { SmsService } from './sms.service';
import { SendCodeDto } from './dto/send-code.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './jwt.strategy';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly redis: Redis;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly smsService: SmsService,
  ) {
    this.redis = new Redis({
      host: this.configService.get<string>('REDIS_HOST', 'localhost'),
      port: this.configService.get<number>('REDIS_PORT', 6379),
      password: this.configService.get<string>('REDIS_PASSWORD'),
      maxRetriesPerRequest: 3,
    });
  }

  async sendVerificationCode(
    sendCodeDto: SendCodeDto,
  ): Promise<{ message: string }> {
    const { phone } = sendCodeDto;

    // Проверяем rate limiting
    const rateLimitKey = `rate_limit:${phone}`;
    const lastRequest = await this.redis.get(rateLimitKey);

    if (lastRequest) {
      throw new BadRequestException(
        'Код можно запросить не чаще одного раза в минуту',
      );
    }

    // Генерируем 6-значный код
    const code = this.generateVerificationCode();

    // Сохраняем код в Redis с TTL 5 минут
    const codeKey = `verification_code:${phone}`;
    await this.redis.setex(codeKey, 300, code); // 300 секунд = 5 минут

    // Устанавливаем rate limit на 1 минуту
    await this.redis.setex(rateLimitKey, 60, '1');

    // Отправляем SMS
    await this.smsService.sendVerificationCode(phone, code);

    this.logger.log(`Код подтверждения отправлен на номер ${phone}`);

    return { message: 'Код отправлен' };
  }

  async verifyCode(
    verifyCodeDto: VerifyCodeDto,
  ): Promise<{ access_token: string }> {
    const { phone, code } = verifyCodeDto;

    // Получаем код из Redis
    const codeKey = `verification_code:${phone}`;
    const storedCode = await this.redis.get(codeKey);

    if (!storedCode) {
      throw new BadRequestException('Код истёк или не найден');
    }

    if (storedCode !== code) {
      throw new UnauthorizedException('Неверный код подтверждения');
    }

    // Удаляем использованный код
    await this.redis.del(codeKey);

    // Находим или создаём пользователя
    const user = await this.usersService.findOrCreateByPhone(phone);

    // Генерируем JWT токен
    const payload: JwtPayload = {
      sub: user.id,
      phone: user.phone || undefined,
    };
    const access_token = this.jwtService.sign(payload);

    this.logger.log(`Пользователь ${phone} успешно авторизован`);

    return { access_token };
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
      throw new UnauthorizedException('Неверный email или пароль');
    }

    const isPasswordValid = await this.usersService.validatePassword(
      user,
      password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверный email или пароль');
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

  async onModuleDestroy() {
    await this.redis.quit();
  }
}
