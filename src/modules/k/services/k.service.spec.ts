import { Test, TestingModule } from '@nestjs/testing';
import { KService } from './k.service';

describe('KService', () => {
  let service: KService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KService],
    }).compile();

    service = module.get<KService>(KService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
