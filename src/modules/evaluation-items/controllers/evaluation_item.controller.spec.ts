import { Test, TestingModule } from '@nestjs/testing';
import { EvaluationItemController } from './evaluation_item.controller';

describe('EvaluationItemController', () => {
  let controller: EvaluationItemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EvaluationItemController],
    }).compile();

    controller = module.get<EvaluationItemController>(EvaluationItemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
