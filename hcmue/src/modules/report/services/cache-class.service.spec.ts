import { Test, TestingModule } from '@nestjs/testing';
import { CacheClassService } from './cache-class.service';

describe('CacheClassService', () => {
  let service: CacheClassService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CacheClassService],
    }).compile();

    service = module.get<CacheClassService>(CacheClassService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
