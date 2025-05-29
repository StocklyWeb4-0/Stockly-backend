import { Module } from '@nestjs/common';
import { SaleStatusService } from './sale-status.service';
import { SaleStatusController } from './sale-status.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SaleStatus } from './entities/sale-status.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SaleStatus])],
  controllers: [SaleStatusController],
  providers: [SaleStatusService],
})
export class SaleStatusModule {}
