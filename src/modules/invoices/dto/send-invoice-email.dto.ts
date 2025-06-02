import { IsEmail, IsOptional, IsBoolean } from 'class-validator';

export class SendInvoiceEmailDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsBoolean()
  isNonCreditClient?: boolean;
}
