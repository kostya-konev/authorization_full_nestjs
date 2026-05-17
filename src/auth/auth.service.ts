import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException
} from "@nestjs/common";
import { UserService } from "@/user/user.service";
import { RegisterDto } from "@/auth/dto/register.dto";
import { AuthMethod } from "@prisma/__generated__/enums";
import { User } from "@prisma/__generated__/client";
import { LoginDto } from "@/auth/dto/login.dto";
import { verify } from "argon2";
import { ConfigService } from "@nestjs/config";
import { Request, Response } from "express";
import { ProviderService } from "@/auth/provider/provider.service";
import { PrismaService } from "@/prisma/prisma.service";
import { EmailConfirmationService } from "@/auth/email-confirmation/email-confirmation.service";

@Injectable()
export class AuthService {
  public constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly providerService: ProviderService,
    private readonly emailConfirmationService: EmailConfirmationService,
    private readonly prismaService: PrismaService,
  ) {}

  public async register(req: Request, dto: RegisterDto) {
    const isExists = await this.userService.findByEmail(dto.email);
    if (isExists) {
      throw new ConflictException("User with this email already exists");
    }
    const newUser = await this.userService.create(
      dto.email,
      dto.password,
      dto.name,
      '',
      AuthMethod.CREDENTIALS,
      false,
    );
    await this.emailConfirmationService.sendVerificationToken(newUser);

    return {
      message: "You successfully registered. Please confirm you email. Message was sent to your email address"
    }
  }

  public async login(req: Request, dto: LoginDto) {
    const user = await this.userService.findByEmail(dto.email);
    if (!user || !user.password) {
      throw new NotFoundException('User not found');
    }
    const isValidPassword = await verify(user.password, dto.password);
    if (!isValidPassword) {
      throw new UnauthorizedException('Incorrect password');
    }
    if (!user.isVerified) {
      await this.emailConfirmationService.sendVerificationToken(user);
      throw new UnauthorizedException('Your email is not confirmed. Please, check your email and confirm your email');
    }
    return this.saveSession(req, user);
  }

  public async extractProfileFromCode(req: Request, provider: string, code: string) {
    const providerInstance = this.providerService.findByService(provider);
    const profile = await providerInstance.findUserByCode(code);
    const account = await this.prismaService.account.findFirst({
      where: {
        id: profile.id,
        provider: profile.provider,
      }
    });
    let user = account?.userId ? await this.userService.findById(account.userId) : null;
    if (user) {
      return this.saveSession(req, user);
    }
    user = await this.userService.create(
      profile.email,
      '',
      profile.name,
      profile.picture,
      AuthMethod[profile.provider.toUpperCase()],
      true
    );
    if (!account) {
      await this.prismaService.account.create({
        data: {
          userId: user.id,
          type: 'oauth',
          provider: profile.provider,
          accessToken: profile.access_token,
          refreshToken: profile.refresh_token,
          expiresAt: profile.expires_at,
        }
      })
    }
    return this.saveSession(req, user);
  }

  public async logout(req: Request, res: Response): Promise<void> {
    return new Promise((resolve, reject) => {
      req.session.destroy(err => {
        if (err) {
          return reject(new InternalServerErrorException('Could not delete session'));
        }
        res.clearCookie(this.configService.getOrThrow<string>('SESSION_NAME'));
        resolve();
      });
    })
  }

  public async saveSession(req: Request, user: User) {
    return new Promise((resolve, reject) => {
      req.session.userId = user.id;
      req.session.save(err => {
        if (err) {
          console.error('session.save error:', err);
          return reject(new InternalServerErrorException('Could not save the session'));
        }
        resolve({ user });
      })
    })
  }
}
