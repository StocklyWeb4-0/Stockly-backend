import { IsInt, IsNotEmpty, IsNumber, IsPositive } from "class-validator";

export class CreateSalesDetailDto {

    @IsNumber()
    @IsPositive()
    saleId: number;

    @IsInt()
    @IsPositive()
    productId: number;

    @IsInt()
    @IsPositive()
    @IsNotEmpty()
    quantity: number;

    @IsNotEmpty()
    unitPrice: number;

    @IsNotEmpty()
    subtotal: number;
}
