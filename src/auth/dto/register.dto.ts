import { Type } from "class-transformer";
import { IsDate, IsEmail, IsNotEmpty, IsString, IsStrongPassword, Matches } from "class-validator";

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1
  })
  password: string;

  // @IsString()
  // @IsStrongPassword({
  //   minLength: 8,
  //   minLowercase: 1,
  //   minUppercase: 1,
  //   minNumbers: 1,
  //   minSymbols: 1
  // })
  // confirmPassword: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  // @IsNotEmpty()
  // @Matches(/^\+?[1-9]\d{1,14}$/, {
  //   message: 'Phone number must be in valid international format (E.164)',
  // })
  // phoneNumber: string;
  //
  // @IsNotEmpty()
  // @Type(() => Date)
  // @IsDate()
  // dateOfBirth: Date;
}
