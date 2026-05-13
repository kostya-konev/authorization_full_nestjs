import { IsEmail, IsNotEmpty, IsString, MinLength, Validate } from 'class-validator';
import { IsPasswordsMatchingConstraint} from "@/libs/common/decorators/is-passwords-matching-constraint";

export class RegisterDto {
  @IsString({ message: 'Name must be string' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsString({ message: 'Email must be string' })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Incorrect email format' })
  email: string;

  @IsString({ message: 'Password must be string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsString({ message: 'Password repeat must be string' })
  @IsNotEmpty({ message: 'Password repeat is required' })
  @MinLength(6, { message: 'Password repeat must be at least 6 characters long' })
  @Validate(IsPasswordsMatchingConstraint, {
    message: 'Passwords dont match'
  })
  passwordRepeat: string;
}