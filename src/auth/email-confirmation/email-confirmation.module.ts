import { forwardRef, Module } from "@nestjs/common";
import { EmailConfirmationService } from './email-confirmation.service';
import { EmailConfirmationController } from './email-confirmation.controller';
import { AuthModule } from "@/auth/auth.module";
import { MailModule } from "@/libs/mail/mail.module";
import { UserModule } from "@/user/user.module";

@Module({
  imports: [MailModule, UserModule, forwardRef(() => AuthModule)],
  controllers: [EmailConfirmationController],
  providers: [EmailConfirmationService],
  exports: [EmailConfirmationService],
})
export class EmailConfirmationModule {}
