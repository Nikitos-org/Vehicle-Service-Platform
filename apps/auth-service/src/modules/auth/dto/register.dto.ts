import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MaxLength(40)
  @MinLength(3)
  fullName!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(36)
  password!: string;
}
