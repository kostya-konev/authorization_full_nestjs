import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class NewPasswordDto {
  @IsString({ message: 'Password must be string' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}
