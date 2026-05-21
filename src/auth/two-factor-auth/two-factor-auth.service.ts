import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import { MailService } from "@/libs/mail/mail.service";
import { v4 as uuidv4 } from "uuid";
import { TokenType } from "@prisma/__generated__/enums";
import { User } from "@prisma/__generated__/client";

@Injectable()
export class TwoFactorAuthService {
  public constructor(
    private readonly prismaService: PrismaService,
    public readonly mailService: MailService
  ) {}

  public async validateTwoFactorToken(email: string, code: string) {
    const existingToken = await this.prismaService.token.findFirst({
      where: {
        email,
        type: TokenType.TWO_FACTOR,
      }
    });
    if (!existingToken) {
      throw new NotFoundException('Two factor authorization token not found.');
    }
    if (existingToken.token !== code) {
      throw new BadRequestException('Two factor authorization token not correct.');
    }
    const isExpired = new Date(existingToken.expiresIn) < new Date();
    if (isExpired) {
      throw new BadRequestException('Token expired');
    }
    await this.prismaService.token.delete({
      where: {
        id: existingToken.id,
        type: TokenType.TWO_FACTOR,
      }
    });
    return true;
  }

  public async sendTwoFactorToken(email: string) {
    const twoFactorToken = await this.generateTwoFactorToken(email);
    await this.mailService.sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);
    return true;
  }

  private async generateTwoFactorToken(email: string) {
    const token = Math.floor(Math.random() * 900000 + 100000).toString();
    const expiresIn = new Date(new Date().getTime() + 300000);
    const existingToken = await this.prismaService.token.findFirst({
      where: {
        email,
        type: TokenType.TWO_FACTOR,
      }
    });
    if (existingToken) {
      await this.prismaService.token.delete({
        where: {
          id: existingToken.id,
          type: TokenType.TWO_FACTOR,
        }
      });
    }
    const twoFactorToken = await this.prismaService.token.create({
      data: {
        email,
        token,
        expiresIn,
        type: TokenType.TWO_FACTOR,
      }
    });
    return twoFactorToken;
  }
}
