import { IsNumber, IsPositive } from "class-validator";

export class CreateCreditDto {
  customer: { id: number };
  sale: { id: number };

  @IsNumber()
  @IsPositive()
  total: number;

  @IsNumber()
  @IsPositive()
  amount: number;
  paymentDeadline: Date;
  statusCredit: { id: number };
  totalPayments: number;
}
