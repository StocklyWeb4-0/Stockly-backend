import { PartialType } from '@nestjs/mapped-types';
import { CreatePaymentsCreditDto } from './create-payments-credit.dto';

export class UpdatePaymentsCreditDto extends PartialType(CreatePaymentsCreditDto) {}
