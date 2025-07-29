import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
  Get,
} from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { SendCodeDto } from './dto/send-code.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { ttl: 60000, limit: 1 } })
  @Post('send-code')
  async sendCode(
    @Body(ValidationPipe) sendCodeDto: SendCodeDto,
  ): Promise<{ message: string }> {
    return this.authService.sendVerificationCode(sendCodeDto);
  }

  @Post('verify-code')
  async verifyCode(
    @Body(ValidationPipe) verifyCodeDto: VerifyCodeDto,
  ): Promise<{ access_token: string }> {
    return this.authService.verifyCode(verifyCodeDto);
  }

  @Post('register')
  async register(
    @Body(ValidationPipe) registerDto: RegisterDto,
  ): Promise<{ access_token: string; user: any }> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(
    @Body(ValidationPipe) loginDto: LoginDto,
  ): Promise<{ access_token: string; user: any }> {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@CurrentUser() user: User): User {
    return user;
  }
}
