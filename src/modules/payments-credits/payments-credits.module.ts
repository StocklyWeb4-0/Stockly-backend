import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsCredit } from './entities/payments-credit.entity';
import { PaymentsCreditsService } from './payments-credits.service';
import { PaymentsCreditsController } from './payments-credits.controller';
import { CreditsModule } from '../credits/credits.module';
import { Credit } from '../credits/entities/credit.entity';
import { StatusCredit } from '../status-credits/entities/status-credit.entity';
import { StatusCreditsModule } from '../status-credits/status-credits.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentsCredit, Credit, StatusCredit]),
    CreditsModule,
    StatusCreditsModule
  ],
  controllers: [PaymentsCreditsController],
  providers: [PaymentsCreditsService],
  exports: [PaymentsCreditsService],
})
export class PaymentsCreditsModule {}
