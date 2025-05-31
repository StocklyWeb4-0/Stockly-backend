import { IsEmail, IsOptional } from 'class-validator';

export class SendInvoiceEmailDto {
  @IsOptional()
  @IsEmail()
  email?: string;
}
