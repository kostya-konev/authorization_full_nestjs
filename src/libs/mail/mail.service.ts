import { Injectable } from '@nestjs/common';
import { MailerService } from "@nestjs-modules/mailer";

@Injectable()
export class MailService {
  public constructor(private readonly mailerService: MailerService) {}

  private sendEmail(email: string, subject: string, html: string) {
    return this.mailerService.sendMail({ to: email, subject, html });
  }
}
