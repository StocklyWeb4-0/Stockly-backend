import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatusCredit } from './entities/status-credit.entity';
import { StatusCreditsService } from './status-credits.service';
import { StatusCreditsController } from './status-credits.controller';

@Module({
  imports: [TypeOrmModule.forFeature([StatusCredit])],
  controllers: [StatusCreditsController],
  providers: [StatusCreditsService],
  exports: [StatusCreditsService],
})
export class StatusCreditsModule {}
