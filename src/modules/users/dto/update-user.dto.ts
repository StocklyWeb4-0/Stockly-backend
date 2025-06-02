import { IsString, IsEmail, MinLength, IsOptional, IsBoolean, IsInt, ArrayNotEmpty, IsArray, ArrayUnique } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  roles: number[];
}
