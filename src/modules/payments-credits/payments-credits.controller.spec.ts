import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsCreditsController } from './payments-credits.controller';
import { PaymentsCreditsService } from './payments-credits.service';

describe('PaymentsCreditsController', () => {
  let controller: PaymentsCreditsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentsCreditsController],
      providers: [PaymentsCreditsService],
    }).compile();

    controller = module.get<PaymentsCreditsController>(PaymentsCreditsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
