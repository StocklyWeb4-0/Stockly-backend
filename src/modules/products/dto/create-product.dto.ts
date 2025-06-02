import { IsString, IsNotEmpty, IsOptional, IsNumber, Min, MaxLength, IsPositive } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  code: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsNumber()
  @IsOptional()
  priceDiscount?: number;

  @IsNumber()
  @Min(0)
  stock?: number;

  @IsNumber()
  idCategory?: number;

  @IsString()
  @IsOptional()
  description?: string;
}
