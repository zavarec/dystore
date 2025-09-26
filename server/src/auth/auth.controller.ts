import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  HttpCode,
  HttpStatus,
  Res,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { Throttle, ThrottlerGuard } from "@nestjs/throttler";
import { AuthService } from "./auth.service";
import { SendCodeDto } from "./dto/send-code.dto";
import { VerifyCodeDto } from "./dto/verify-code.dto";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { User } from "@prisma/client";

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: "Send SMS verification code" })
  @ApiResponse({ status: 200, description: "Code sent successfully" })
  @ApiResponse({ status: 429, description: "Too many requests" })
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { ttl: 30000, limit: 1 } })
  @Post("send-code")
  @HttpCode(HttpStatus.OK)
  async sendCode(@Body() sendCodeDto: SendCodeDto) {
    return this.authService.sendVerificationCode(sendCodeDto);
  }

  @ApiOperation({ summary: "Verify SMS code" })
  @ApiResponse({ status: 200, description: "Authentication successful" })
  @ApiResponse({ status: 400, description: "Invalid code" })
  @Post("verify-code")
  @HttpCode(HttpStatus.OK)
  async verifyCode(@Body() verifyCodeDto: VerifyCodeDto) {
    return this.authService.verifyCode(verifyCodeDto);
  }

  @ApiOperation({ summary: "Register new user" })
  @ApiResponse({ status: 201, description: "User registered successfully" })
  @ApiResponse({ status: 409, description: "User already exists" })
  @Post("register")
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @ApiOperation({ summary: "Login user" })
  @ApiResponse({ status: 200, description: "Login successful" })
  @ApiResponse({ status: 401, description: "Invalid credentials" })
  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: any,
  ) {
    const { access_token, user } = await this.authService.login(loginDto);

    const isProd = process.env.NODE_ENV === "production";
    const domain =
      isProd && process.env.FRONTEND_ORIGIN
        ? new URL(process.env.FRONTEND_ORIGIN).hostname // dyson-group.ru
        : undefined;

    res.cookie("access_token", access_token, {
      httpOnly: true,
      secure: isProd, // HTTPS на проде
      sameSite: "lax",
      path: "/",
      domain, // можно НЕ указывать, тогда хост-онли
      maxAge: 24 * 60 * 60 * 1000, // 1 день
    });

    // В теле ответа токен уже не нужен
    return { user };
  }

  @ApiOperation({ summary: "Get current user profile" })
  @ApiResponse({ status: 200, description: "User profile" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get("profile")
  async getProfile(@CurrentUser() user: User) {
    return {
      id: user.id,
      email: user.email,
      phone: user.phone,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
    };
  }
}
