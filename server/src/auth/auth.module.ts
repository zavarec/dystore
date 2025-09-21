import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { SmsModule } from "../sms/sms.module";
import { JwtStrategy } from "./jwt.strategy";
import { UsersModule } from "../users/users.module";
import { OtpModule } from "../otp/otp.module";

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET", "default-secret"),
        signOptions: {
          expiresIn: configService.get<string>("JWT_EXPIRES_IN", "7d"),
        },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    SmsModule,
    OtpModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
