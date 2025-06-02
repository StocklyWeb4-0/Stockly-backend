import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsCredit } from './entities/payments-credit.entity';
import { PaymentsCreditsService } from './payments-credits.service';
import { PaymentsCreditsController } from './payments-credits.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentsCredit])],
  controllers: [PaymentsCreditsController],
  providers: [PaymentsCreditsService],
  exports: [PaymentsCreditsService],
})
export class PaymentsCreditsModule {}
