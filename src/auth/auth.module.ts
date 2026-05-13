import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from "@/user/user.service";
import { GoogleRecaptchaModule } from "@nestlab/google-recaptcha";
import { getRecaptchaConfig } from "@/config/recaptcha.config";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ProviderModule } from "@/auth/provider/provider.module";
import { getProviderConfig } from "@/config/providers.config";

@Module({
  imports: [
    ProviderModule.registerAsync({
      imports: [ConfigModule],
      useFactory: getProviderConfig,
      inject: [ConfigService],
    }),
    GoogleRecaptchaModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getRecaptchaConfig,
      inject: [ConfigService],
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService],
})
export class AuthModule {}
