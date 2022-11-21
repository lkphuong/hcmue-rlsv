import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { EvaluationItemEntity } from '../../../entities/evaluation_items.entity';

import { LogService } from '../../log/services/log.service';

import { Levels } from '../../../constants/enums/level.enum';
import { Methods } from '../../../constants/enums/method.enum';

@Injectable()
export class EvaluationItemService {
  constructor(
    @InjectRepository(EvaluationItemEntity)
    private readonly _evaluationItemRepository: Repository<EvaluationItemEntity>,
    private _logger: LogService,
  ) {}
}
