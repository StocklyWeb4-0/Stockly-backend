import { PartialType } from '@nestjs/mapped-types';
import { CreateSaleStatusDto } from './create-sale-status.dto';

export class UpdateSaleStatusDto extends PartialType(CreateSaleStatusDto) {}
