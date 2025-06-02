import { IsNotEmpty, IsPositive } from "class-validator";

export class CreatePaymentsCreditDto {
  
  @IsNotEmpty()
  @IsPositive()
  creditId: number;

  @IsNotEmpty()
  amountPaid: number;

  dateAmountPaid: Date;
}
