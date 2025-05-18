import { Module } from '@nestjs/common';
import { SalesDetailService } from './sales-detail.service';
import { SalesDetailController } from './sales-detail.controller';

@Module({
  controllers: [SalesDetailController],
  providers: [SalesDetailService],
})
export class SalesDetailModule {}
