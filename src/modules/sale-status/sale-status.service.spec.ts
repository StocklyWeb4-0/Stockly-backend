import { Test, TestingModule } from '@nestjs/testing';
import { SaleStatusService } from './sale-status.service';

describe('SaleStatusService', () => {
  let service: SaleStatusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SaleStatusService],
    }).compile();

    service = module.get<SaleStatusService>(SaleStatusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
