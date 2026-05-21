import { IsBoolean, IsEmail, IsNotEmpty, IsString } from "class-validator";

export class UpdateUserDto {
  @IsString({ message: 'Email must be string' })
  @IsNotEmpty({ message: 'Email is required' })
  name: string;

  @IsString({ message: 'Email must be string' })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Incorrect email format' })
  email: string;

  @IsBoolean({ message: 'isTwoFactorEnabled must be boolean' })
  isTwoFactorEnabled: boolean;
}