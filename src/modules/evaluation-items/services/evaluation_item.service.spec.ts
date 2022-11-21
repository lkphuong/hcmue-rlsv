import { Test, TestingModule } from '@nestjs/testing';
import { EvaluationItemService } from './evaluation_item.service';

describe('EvaluationItemService', () => {
  let service: EvaluationItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EvaluationItemService],
    }).compile();

    service = module.get<EvaluationItemService>(EvaluationItemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
