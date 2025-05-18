import { Module } from '@nestjs/common';
import { SaleStatusService } from './sale-status.service';
import { SaleStatusController } from './sale-status.controller';

@Module({
  controllers: [SaleStatusController],
  providers: [SaleStatusService],
})
export class SaleStatusModule {}
