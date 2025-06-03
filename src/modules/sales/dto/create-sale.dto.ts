import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsNumber, ValidateNested, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentType } from '../../payment-types/entities/payment-type.entity';

export class ProductItemDto {
  @IsNotEmpty()
  code: string;

  @IsNotEmpty()
  quantity: number;
}

export class CreateSaleDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductItemDto)
  products: ProductItemDto[];

  @IsEnum(PaymentType)
  paymentType: PaymentType;

  @IsOptional()
  @IsNumber()
  saleStatusId?: number;

  @IsOptional()
  @IsNumber()
  customerId?: number;

  @IsOptional()
  @IsString()
  customerEmail?: string;

  @IsOptional()
  @IsNumber()
  totalPayments: number;
}
