import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsCredit } from './entities/payments-credit.entity';
import { PaymentsCreditsService } from './payments-credits.service';
import { PaymentsCreditsController } from './payments-credits.controller';
import { CreditsModule } from '../credits/credits.module';
import { Credit } from '../credits/entities/credit.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentsCredit, Credit]),
    CreditsModule],
  controllers: [PaymentsCreditsController],
  providers: [PaymentsCreditsService],
  exports: [PaymentsCreditsService],
})
export class PaymentsCreditsModule {}
