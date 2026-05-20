import { Injectable } from '@nestjs/common';
import { MailerService } from "@nestjs-modules/mailer";
import { ConfigService } from "@nestjs/config";
import { render } from "@react-email/components";
import { ConfirmationTemplate } from "@/libs/mail/templates/confirmation.template";
import { ResetPasswordTemplate } from "@/libs/mail/templates/reset-password.template";

@Injectable()
export class MailService {
  public constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  public async sendConfirmationEmail(email: string, token: string) {
    const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN');
    const html = await render(ConfirmationTemplate({ domain, token }));
    return this.sendEmail(email, 'Email confirmation', html);
  }

  public async sendPasswordResetEmail(email: string, token: string) {
    const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN');
    const html = await render(ResetPasswordTemplate({ domain, token }));
    return this.sendEmail(email, 'Password reset', html);
  }

  private sendEmail(email: string, subject: string, html: string) {
    return this.mailerService.sendMail({ to: email, subject, html });
  }
}
