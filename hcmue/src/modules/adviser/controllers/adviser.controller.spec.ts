import { Test, TestingModule } from '@nestjs/testing';
import { AdviserController } from './adviser.controller';

describe('AdviserController', () => {
  let controller: AdviserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdviserController],
    }).compile();

    controller = module.get<AdviserController>(AdviserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
