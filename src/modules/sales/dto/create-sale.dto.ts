import { IsArray, IsEnum, IsNotEmpty, ValidateNested } from 'class-validator';
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
}