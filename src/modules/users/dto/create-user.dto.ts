import { IsString, IsEmail, MinLength, IsOptional, IsBoolean, IsArray, ArrayNotEmpty, ArrayUnique } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  roles: number[];
}
