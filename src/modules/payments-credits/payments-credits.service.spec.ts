import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsCreditsService } from './payments-credits.service';

describe('PaymentsCreditsService', () => {
  let service: PaymentsCreditsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentsCreditsService],
    }).compile();

    service = module.get<PaymentsCreditsService>(PaymentsCreditsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
