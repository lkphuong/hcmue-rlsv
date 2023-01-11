import { Test, TestingModule } from '@nestjs/testing';
import { AdviserClassesService } from './adviser_classes.service';

describe('AdviserClassesService', () => {
  let service: AdviserClassesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdviserClassesService],
    }).compile();

    service = module.get<AdviserClassesService>(AdviserClassesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
